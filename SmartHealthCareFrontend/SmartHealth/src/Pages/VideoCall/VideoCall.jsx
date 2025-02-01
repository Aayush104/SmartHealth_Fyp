import React, { useEffect, useRef, useState } from "react";
import { connectToMeetingHub } from "./useSignalR";
import { WebRTCConnection } from "./WebRtc";
import Cookies from "js-cookie";
const VideoCall = ({ meetingId }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [webRTC, setWebRTC] = useState(null);
  const [signalRConnection, setSignalRConnection] = useState(null);
  const [startButton, setStartButton] = useState(false)

const token = Cookies.get("Token")
const decodedToken = JSON.parse(atob(token.split(".")[1]));
// const userId = decodedToken.userId;
const userRole = decodedToken.Role;

  useEffect(() => {

    if(userRole == "Doctor")
    { setStartButton(true);
    }
    // Create a new WebRTC connection instance.
    const webrtc = new WebRTCConnection(remoteVideoRef);
    setWebRTC(webrtc);

    // Start the local video/audio stream and attach to the local video element.
    webrtc.startLocalStream().then((stream) => {
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      // Add all tracks from the stream to the peer connection.
      stream.getTracks().forEach(track => {
        webrtc.peerConnection.addTrack(track, stream);
      });
    }).catch(err => console.error("Error accessing media devices.", err));

    // Connect to the SignalR hub.
    const connection = connectToMeetingHub(meetingId, async (type, data) => {
      if (type === "offer") {
        // Parse the received offer JSON.
        const offer = typeof data.offer === "string" ? JSON.parse(data.offer) : data.offer;
        const answer = await webrtc.createAnswer(offer);
        // Send back the answer as a JSON string.
        connection.invoke("SendAnswer", String(meetingId), JSON.stringify(answer))
          .catch(err => console.error("SendAnswer error:", err));
      } else if (type === "answer") {
        const answer = typeof data.answer === "string" ? JSON.parse(data.answer) : data.answer;
        await webrtc.setRemoteDescription(answer);
      } else if (type === "iceCandidate") {
        const candidate = typeof data.candidate === "string" ? JSON.parse(data.candidate) : data.candidate;
        await webrtc.addIceCandidate(candidate);
      }
    });

    // Setup sending ICE candidates to the remote peer.
    webrtc.peerConnection.onicecandidate = event => {
      if (event.candidate) {
        connection.invoke("SendIceCandidate", String(meetingId), JSON.stringify(event.candidate))
          .catch(err => console.error("SendIceCandidate error:", err));
      }
    };

    // When remote tracks arrive, display them.
    webrtc.peerConnection.ontrack = event => {
      if (remoteVideoRef.current) {
        // Some browsers send a stream with tracks already attached.
        const remoteStream = event.streams[0];
        webrtc.setRemoteStream(remoteStream);
      }
    };

    setSignalRConnection(connection);

    // Cleanup on unmount.
    return () => {
      connection.stop();
    };
  }, [meetingId]);

 
  
const startCall = async () => {
    if (webRTC && signalRConnection) {
      const offer = await webRTC.createOffer();
      await signalRConnection.invoke("SendOffer", String(meetingId), JSON.stringify(offer))
        .catch(err => console.error("SendOffer error:", err));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-xl font-bold">Meeting: {meetingId}</h2>
      <div className="flex gap-4 mt-4">
        <video ref={localVideoRef} autoPlay playsInline className="w-1/3 border" />
        <video ref={remoteVideoRef} autoPlay playsInline className="w-1/3 border" />
      </div>

{
    startButton ? (
        <button onClick={startCall} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Start Call
      </button>
    ) : (
       <p>The doctor will start the meeting</p>
    )
      
}

    </div>
  );
};

export default VideoCall;
