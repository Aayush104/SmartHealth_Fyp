// VideoCall.js
import React, { useEffect, useRef, useState } from "react";
import { connectToMeetingHub } from "./useSignalR";
import { WebRTCConnection } from "./WebRtc";
import Cookies from "js-cookie";
import { MdOutlineScreenShare } from "react-icons/md";
import { MdOutlineStopScreenShare } from "react-icons/md";
import { 
  FaPhone, 
  FaPhoneSlash, 
  FaMicrophone, 
  FaMicrophoneSlash, 
  FaVideo, 
  FaVideoSlash,
 
} from "react-icons/fa";
import { Navigate, useNavigate, useParams } from "react-router-dom";

const VideoCall = () => {
  const { meetingId } = useParams();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const connectionRef = useRef(null);

  const [webRTC, setWebRTC] = useState(null);
  const [startButton, setStartButton] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [bothUsersReady, setBothUsersReady] = useState(false);

  // Screen sharing
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const screenStreamRef = useRef(null);
  const originalVideoTrackRef = useRef(null); // Track original video track

  const navigateTo = useNavigate();

  const token = Cookies.get("Token");
  const decodedToken = token ? JSON.parse(atob(token.split(".")[1])) : { Role: "" };
  const userRole = decodedToken.Role;

  const [myTimestamp] = useState(Date.now());
  const shouldInitiateCall = () => myTimestamp % 2 === 0;

  useEffect(() => {
    const webrtcInstance = new WebRTCConnection(remoteVideoRef);
    setWebRTC(webrtcInstance);

    webrtcInstance
      .startLocalStream()
      .then((stream) => {
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        // Store original video track
        originalVideoTrackRef.current = stream.getVideoTracks()[0];
      })
      .catch((err) => console.error("Error accessing media devices.", err));

    const connection = connectToMeetingHub(meetingId, async (type, data) => {
      console.log("SignalR message received:", type, data);
      if (type === "offer") {
        const offer = typeof data.offer === "string" ? JSON.parse(data.offer) : data.offer;
        const answer = await webrtcInstance.createAnswer(offer);
        connection.invoke("SendAnswer", meetingId, JSON.stringify(answer));
      } else if (type === "answer") {
        const answer = typeof data.answer === "string" ? JSON.parse(data.answer) : data.answer;
        await webrtcInstance.setRemoteDescription(answer);
      } else if (type === "iceCandidate") {
        const candidate = typeof data.candidate === "string" ? JSON.parse(data.candidate) : data.candidate;
        await webrtcInstance.addIceCandidate(candidate);
      } else if (type === "BothUsersReady") {
        setBothUsersReady(true);
        if (shouldInitiateCall()) {
          const offer = await webrtcInstance.createOffer();
          connection.invoke("SendOffer", meetingId, JSON.stringify(offer));
        }
        connection.invoke("JoinRoom", meetingId);
      }
    });
    connectionRef.current = connection;

    webrtcInstance.onIceCandidate = (candidate) => {
      connection.invoke("SendIceCandidate", meetingId, JSON.stringify(candidate));
    };

    return () => {
      connection.stop();
      webrtcInstance.closeConnection();
      localStream?.getTracks().forEach(track => track.stop());
    };
  }, [meetingId]);

  const startCall = async () => {
    setStartButton(false);
    await connectionRef.current.invoke("SetUserReady", meetingId);
  };

  const endCall = () => {
    if (webRTC) {
      webRTC.closeConnection();
      if (localVideoRef.current) localVideoRef.current.srcObject = null;
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    }
    
    if (connectionRef.current) {
      connectionRef.current.stop();
    }
  
   
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
  
  
   window.location.href='/'
  };
  
  // screen sharing implementation
  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        screenStreamRef.current = screenStream;
        const screenTrack = screenStream.getVideoTracks()[0];

        // Store original track and replace with screen track
        await webRTC.replaceVideoTrack(screenTrack);
        
        // Update local preview to show screen share
        const newStream = new MediaStream([screenTrack, ...localStream.getAudioTracks()]);
        localVideoRef.current.srcObject = newStream;

        setIsScreenSharing(true);

        // Handle user stopping via browser UI
        screenTrack.onended = () => {
          stopScreenShare();
        };
      } catch (err) {
        console.error("Error sharing screen:", err);
      }
    } else {
      stopScreenShare();
    }
  };

  const stopScreenShare = async () => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
      screenStreamRef.current = null;
    }

    // Restore original video track
    if (originalVideoTrackRef.current) {
      await webRTC.replaceVideoTrack(originalVideoTrackRef.current);
    }

    // Restore local preview
    localVideoRef.current.srcObject = localStream;
    setIsScreenSharing(false);
  };

  const toggleMute = () => {
    localStream?.getAudioTracks().forEach(track => track.enabled = !track.enabled);
    setIsMuted(!isMuted);
  };

  const toggleCamera = () => {
    localStream?.getVideoTracks().forEach(track => track.enabled = !track.enabled);
    setIsCameraOff(!isCameraOff);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <div className="flex items-center justify-center relative">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-[92vh] object-cover px-2"
        />

        <div className="absolute top-2 right-1 w-48 rounded-lg overflow-hidden shadow-lg">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-48 h-32 object-cover"
          />
          {isMuted && (
            <div className="absolute bottom-2 left-2 bg-black/50 p-1 rounded">
              <FaMicrophoneSlash className="text-white text-sm" />
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-800 px-4 py-2 flex justify-center">
        <div className="max-w-6xl flex justify-center">
          <div className="flex gap-2">
            {startButton && !bothUsersReady ? (
              <div className="flex gap-1 flex-col items-center">
                <button
                  onClick={startCall}
                  className="p-3 bg-green-500 rounded-full hover:bg-green-600 transition-colors"
                >
                  <FaPhone className="w-6 h-6 text-white" />
                </button>
                <p className="text-white">Join Call</p>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleScreenShare}
                  className={`p-4 rounded-full ${
                    isScreenSharing ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-600 hover:bg-gray-700"
                  }`}
                >
                  {isScreenSharing ? (
                    <MdOutlineStopScreenShare className="w-6 h-6 text-white" />
                  ) : (
                    <MdOutlineScreenShare className="w-6 h-6 text-white" />
                  )}
                </button>

                <button
                  onClick={toggleMute}
                  className={`p-4 rounded-full ${
                    isMuted ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-600 hover:bg-gray-700"
                  }`}
                >
                  {isMuted ? (
                    <FaMicrophoneSlash className="w-6 h-6 text-white" />
                  ) : (
                    <FaMicrophone className="w-6 h-6 text-white" />
                  )}
                </button>

                <button
                  onClick={endCall}
                  className="p-4 bg-red-500 rounded-full hover:bg-red-600"
                >
                  <FaPhoneSlash className="w-6 h-6 text-white" />
                </button>

                <button
                  onClick={toggleCamera}
                  className={`p-4 rounded-full ${
                    isCameraOff ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-600 hover:bg-gray-700"
                  }`}
                >
                  {isCameraOff ? (
                    <FaVideoSlash className="w-6 h-6 text-white" />
                  ) : (
                    <FaVideo className="w-6 h-6 text-white" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;