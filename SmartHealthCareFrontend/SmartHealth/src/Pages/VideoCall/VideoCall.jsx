// VideoCall.js
import React, { useEffect, useRef, useState } from "react";
import { connectToMeetingHub } from "./useSignalR";
import { WebRTCConnection } from "./WebRtc";
import Cookies from "js-cookie";
import { 
  FaPhone, 
  FaPhoneSlash, 
  FaMicrophone, 
  FaMicrophoneSlash, 
  FaVideo, 
  FaVideoSlash,
  FaCommentAlt,
  FaUserFriends,
} from "react-icons/fa";
import { useParams } from "react-router-dom";

const VideoCall = () => {
  const { meetingId } = useParams();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const connectionRef = useRef(null); // Holds the SignalR connection

  const [webRTC, setWebRTC] = useState(null);
  const [startButton, setStartButton] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [bothUsersReady, setBothUsersReady] = useState(false);

  // Example token decoding (adjust as needed)
  const token = Cookies.get("Token");
  const decodedToken = token ? JSON.parse(atob(token.split(".")[1])) : { Role: "" };
  const userRole = decodedToken.Role;

  // Use a timestamp to decide which user should initiate the call.
  // For demonstration, if the timestamp is even, this client is designated as the caller.
  const [myTimestamp] = useState(Date.now());
  const shouldInitiateCall = () => myTimestamp % 2 === 0;

  useEffect(() => {
    // Initialize WebRTC connection and start local stream.
    const webrtcInstance = new WebRTCConnection(remoteVideoRef);
    setWebRTC(webrtcInstance);

    webrtcInstance
      .startLocalStream()
      .then((stream) => {
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      })
      .catch((err) => console.error("Error accessing media devices.", err));

    // Establish SignalR connection.
    const connection = connectToMeetingHub(meetingId, async (type, data) => {
      console.log("SignalR message received:", type, data);
      if (type === "offer") {
        const offer =
          typeof data.offer === "string" ? JSON.parse(data.offer) : data.offer;
        console.log("Received offer:", offer);
        const answer = await webrtcInstance.createAnswer(offer);
        console.log("Created answer:", answer);
        connection
          .invoke("SendAnswer", meetingId, JSON.stringify(answer))
          .catch((err) => console.error("SendAnswer error:", err));
      } else if (type === "answer") {
        const answer =
          typeof data.answer === "string" ? JSON.parse(data.answer) : data.answer;
        console.log("Received answer:", answer);
        await webrtcInstance.setRemoteDescription(answer);
      } else if (type === "iceCandidate") {
        const candidate =
          typeof data.candidate === "string"
            ? JSON.parse(data.candidate)
            : data.candidate;
        console.log("Received ICE candidate:", candidate);
        await webrtcInstance.addIceCandidate(candidate);
      } else if (type === "BothUsersReady") {
        console.log("Both users are ready to start the call.");
        setBothUsersReady(true);
        if (shouldInitiateCall()) {
          console.log("Designated as caller. Creating offer...");
          const offer = await webrtcInstance.createOffer();
          console.log("Created offer:", offer);
          connection
            .invoke("SendOffer", meetingId, JSON.stringify(offer))
            .catch((err) => console.error("SendOffer error:", err));
        }
        // Join the room once both users are ready.
        connection
          .invoke("JoinRoom", meetingId)
          .catch((err) => console.error("JoinRoom error:", err));
      }
    });
    connectionRef.current = connection;

    // Set ICE candidate callback to send candidate via SignalR.
    webrtcInstance.onIceCandidate = (candidate) => {
      if (connectionRef.current) {
        connectionRef.current
          .invoke("SendIceCandidate", meetingId, JSON.stringify(candidate))
          .catch((err) => console.error("SendIceCandidate error:", err));
      }
    };

    // Cleanup on unmount.
    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
      }
      if (webrtcInstance) {
        webrtcInstance.closeConnection();
      }
    };
  }, [meetingId]);

  // When the user clicks the start button, mark the user as ready.
  const startCall = async () => {
    setStartButton(false);
    if (connectionRef.current) {
      await connectionRef.current
        .invoke("SetUserReady", meetingId)
        .catch((err) => console.error("SetUserReady error:", err));
    }
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
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted((prev) => !prev);
    }
  };

  const toggleCamera = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsCameraOff((prev) => !prev);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Main content area */}
      <div className="flex items-center justify-center relative">
        {/* Remote video (main view) */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-[92vh] object-cover px-2"
        />
        {/* Local video (picture-in-picture) */}
        <div className="absolute top-2 right-1 w-48 rounded-lg overflow-hidden shadow-lg">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-48 h-32 object-cover"
          />
        </div>
      </div>
      {/* Bottom control bar */}
      <div className="bg-gray-800 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Meeting info */}
          <div className="text-gray-300 text-sm">{meetingId}</div>
          {/* Main controls */}
          <div className="flex gap-2">
            {startButton && !bothUsersReady ? (
              <button
                onClick={startCall}
                className="p-4 bg-green-500 rounded-full hover:bg-green-600 transition-colors"
              >
                <FaPhone className="w-6 h-6 text-white" />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className={`p-4 rounded-full transition-colors ${
                    isMuted
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-gray-600 hover:bg-gray-700"
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
                  className="p-4 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                >
                  <FaPhoneSlash className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={toggleCamera}
                  className={`p-4 rounded-full transition-colors ${
                    isCameraOff
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-gray-600 hover:bg-gray-700"
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
          {/* Right side controls */}
          <div className="flex gap-2">
            <button className="p-3 text-white hover:bg-gray-700 rounded-full transition-colors">
              <FaCommentAlt className="w-5 h-5" />
            </button>
            <button className="p-3 text-white hover:bg-gray-700 rounded-full transition-colors">
              <FaUserFriends className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
