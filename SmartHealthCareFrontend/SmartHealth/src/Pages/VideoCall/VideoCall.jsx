import React, { useEffect, useRef, useState } from "react";
import { connectToMeetingHub } from "./useSignalR";
import { WebRTCConnection } from "./WebRtc";
import Cookies from "js-cookie";
import {
  MdOutlineScreenShare,
  MdOutlineStopScreenShare,
  MdCloudUpload,
} from "react-icons/md";
import {
  FaPhone,
  FaPhoneSlash,
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaRecordVinyl,
  FaStopCircle,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

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

  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const screenStreamRef = useRef(null);
  const originalVideoTrackRef = useRef(null);

  const [isRecording, setIsRecording] = useState(false);
  const [recordingFinished, setRecordingFinished] = useState(false);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const navigateTo = useNavigate();
  const token = Cookies.get("Token");
  const decodedToken = token ? JSON.parse(atob(token.split(".")[1])) : { Role: "" };

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
        originalVideoTrackRef.current = stream.getVideoTracks()[0];
      })
      .catch((err) => {
        console.error("Error accessing media devices.", err);
        toast.error("Failed to access camera or microphone");
      });

    const connection = connectToMeetingHub(meetingId, async (type, data) => {
      if (type === "offer") {
        const offer = JSON.parse(data.offer);
        const answer = await webrtcInstance.createAnswer(offer);
        connection.invoke("SendAnswer", meetingId, JSON.stringify(answer));
      } else if (type === "answer") {
        const answer = JSON.parse(data.answer);
        await webrtcInstance.setRemoteDescription(answer);
      } else if (type === "iceCandidate") {
        const candidate = JSON.parse(data.candidate);
        await webrtcInstance.addIceCandidate(candidate);
      } else if (type === "BothUsersReady") {
        setBothUsersReady(true);
        toast.success("Both users connected!", { autoClose: 2000 });
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
      localStream?.getTracks().forEach((track) => track.stop());
    };
  }, [meetingId]);

  const startCall = async () => {
    setStartButton(false);
    toast.info("Joining call...", { autoClose: 2000 });
    await connectionRef.current.invoke("SetUserReady", meetingId);
  };

  const endCall = () => {

    stopRecording();
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

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        toast.info("Starting screen share...", { autoClose: 2000 });
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        screenStreamRef.current = screenStream;
        const screenTrack = screenStream.getVideoTracks()[0];

        await webRTC.replaceVideoTrack(screenTrack);
        const newStream = new MediaStream([screenTrack, ...localStream.getAudioTracks()]);
        localVideoRef.current.srcObject = newStream;

        setIsScreenSharing(true);
        toast.success("Screen sharing started", { autoClose: 2000 });

        screenTrack.onended = () => {
          stopScreenShare();
        };
      } catch (err) {
        console.error("Error sharing screen:", err);
        toast.error("Failed to share screen");
      }
    } else {
      stopScreenShare();
    }
  };

  const stopScreenShare = async () => {
    screenStreamRef.current?.getTracks().forEach((track) => track.stop());
    screenStreamRef.current = null;

    if (originalVideoTrackRef.current) {
      await webRTC.replaceVideoTrack(originalVideoTrackRef.current);
    }

    localVideoRef.current.srcObject = localStream;
    setIsScreenSharing(false);
    toast.info("Screen sharing stopped", { autoClose: 2000 });
  };

  const toggleMute = () => {
    localStream?.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
    setIsMuted(!isMuted);
    toast.info(isMuted ? "Microphone unmuted" : "Microphone muted", { autoClose: 1500 });
  };

  const toggleCamera = () => {
    localStream?.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
    setIsCameraOff(!isCameraOff);
    toast.info(isCameraOff ? "Camera turned on" : "Camera turned off", { autoClose: 1500 });
  };

  const startRecording = () => {
    if (localVideoRef.current?.srcObject) {
      recordedChunksRef.current = [];
      setRecordingFinished(false);
      setUploadError(null);
      
      // Check for supported MIME types
      let options;
      if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
        options = { mimeType: 'video/webm;codecs=vp9' };
      } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
        options = { mimeType: 'video/webm;codecs=vp8' };
      } else if (MediaRecorder.isTypeSupported('video/webm')) {
        options = { mimeType: 'video/webm' };
      } else {
        // Fall back to default
        options = {};
      }
      
      const mediaRecorder = new MediaRecorder(localVideoRef.current.srcObject, options);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        setRecordingFinished(true);
        toast.success("Recording saved! Ready to upload.", { autoClose: 3000 });
      };

      mediaRecorder.start(1000); // Collect data in 1-second chunks
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      toast.info("Recording started", { 
        autoClose: false,
        toastId: "recording-toast" 
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.dismiss("recording-toast");
      toast.info("Recording stopped", { autoClose: 2000 });
    }
  };

  const uploadRecording = async () => {
    if (recordedChunksRef.current.length === 0) {
      console.error("No recording to upload");
      setUploadError("No recording data available");
      toast.error("No recording data available");
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    
    const uploadToastId = toast.loading("Uploading recording...");
    
    try {
      const recordedBlob = new Blob(recordedChunksRef.current, { type: "video/webm" });
      
      // Create a file from the blob
      const videoFile = new File(
        [recordedBlob], 
        `recording_${Date.now()}.webm`, 
        { type: "video/webm" }
      );
      
      const formData = new FormData();
      formData.append("Video", videoFile);
      formData.append("meetingId", meetingId);

      const response = await axios.post(
        "https://localhost:7070/api/Appointment/UploadVideo", 
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      console.log("Video uploaded successfully:", response.data);
      setRecordingFinished(false);
      toast.update(uploadToastId, { 
        render: "Video uploaded successfully!", 
        type: "success", 
        isLoading: false, 
        autoClose: 3000 
      });
    } catch (error) {
      console.error("Video upload failed:", error);
      const errorMsg = error.response?.data?.message || "Upload failed. Please try again.";
      setUploadError(errorMsg);
      toast.update(uploadToastId, { 
        render: `Upload failed: ${errorMsg}`, 
        type: "error", 
        isLoading: false, 
        autoClose: 5000 
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Debug function to verify recording exists
  const previewRecording = () => {
    if (recordedChunksRef.current.length === 0) {
      toast.error("No recording available to preview");
      return;
    }
    
    const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    
    // Create temporary video element for preview
    const videoElement = document.createElement("video");
    videoElement.src = url;
    videoElement.controls = true;
    videoElement.style.position = "fixed";
    videoElement.style.top = "10%";
    videoElement.style.left = "10%";
    videoElement.style.width = "80%";
    videoElement.style.height = "80%";
    videoElement.style.zIndex = 10000;
    videoElement.style.backgroundColor = "black";
    
    // Add close button
    const closeButton = document.createElement("button");
    closeButton.textContent = "Close Preview";
    closeButton.style.position = "fixed";
    closeButton.style.top = "5%";
    closeButton.style.right = "10%";
    closeButton.style.zIndex = 10001;
    closeButton.style.padding = "10px";
    closeButton.style.backgroundColor = "red";
    closeButton.style.color = "white";
    closeButton.style.border = "none";
    closeButton.style.borderRadius = "5px";
    closeButton.style.cursor = "pointer";
    
    closeButton.onclick = () => {
      document.body.removeChild(videoElement);
      document.body.removeChild(closeButton);
      URL.revokeObjectURL(url);
      toast.info("Preview closed", { autoClose: 1500 });
    };
    
    document.body.appendChild(videoElement);
    document.body.appendChild(closeButton);
    
    videoElement.play();
    toast.info("Playing recording preview", { autoClose: 2000 });
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  };
  
  const buttonAnimation = {
    hover: { scale: 1.1 },
    tap: { scale: 0.95 }
  };

  return (
    <motion.div 
      className="flex flex-col h-screen bg-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-center relative">
        <motion.video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-[92vh] object-cover px-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        />

        <motion.div 
          className="absolute top-2 right-1 w-48 rounded-lg overflow-hidden shadow-lg"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 120 }}
        >
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-48 h-32 object-cover"
          />
          <AnimatePresence>
            {isMuted && (
              <motion.div 
                className="absolute bottom-2 left-2 bg-black/50 p-1 rounded"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <FaMicrophoneSlash className="text-white text-sm" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        <AnimatePresence>
          {uploadError && (
            <motion.div 
              className="absolute bottom-20 left-0 right-0 mx-auto w-2/3 bg-red-500 text-white p-3 rounded text-center"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {uploadError}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div 
        className="bg-gray-800 px-4 py-2 flex justify-center"
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
      >
        <div className="max-w-6xl flex justify-center">
          <div className="flex gap-2">
            {startButton && !bothUsersReady ? (
              <motion.div 
                className="flex gap-1 flex-col items-center"
                whileHover={{ scale: 1.05 }}
              >
                <motion.button
                  onClick={startCall}
                  className="p-3 bg-green-500 rounded-full hover:bg-green-600 transition-colors"
                  variants={buttonAnimation}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <FaPhone className="w-6 h-6 text-white" />
                </motion.button>
                <p className="text-white">Join Call</p>
              </motion.div>
            ) : (
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={toggleScreenShare}
                  className={`p-4 rounded-full ${
                    isScreenSharing ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-600 hover:bg-gray-700"
                  }`}
                  variants={buttonAnimation}
                  whileHover="hover"
                  whileTap="tap"
                >
                  {isScreenSharing ? (
                    <MdOutlineStopScreenShare className="w-6 h-6 text-white" />
                  ) : (
                    <MdOutlineScreenShare className="w-6 h-6 text-white" />
                  )}
                </motion.button>

                <motion.button
                  onClick={toggleMute}
                  className={`p-4 rounded-full ${
                    isMuted ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-600 hover:bg-gray-700"
                  }`}
                  variants={buttonAnimation}
                  whileHover="hover"
                  whileTap="tap"
                >
                  {isMuted ? (
                    <FaMicrophoneSlash className="w-6 h-6 text-white" />
                  ) : (
                    <FaMicrophone className="w-6 h-6 text-white" />
                  )}
                </motion.button>

                <motion.button
                  onClick={endCall}
                  className="p-4 bg-red-500 rounded-full hover:bg-red-600"
                  variants={buttonAnimation}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <FaPhoneSlash className="w-6 h-6 text-white" />
                </motion.button>

                <motion.button
                  onClick={toggleCamera}
                  className={`p-4 rounded-full ${
                    isCameraOff ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-600 hover:bg-gray-700"
                  }`}
                  variants={buttonAnimation}
                  whileHover="hover"
                  whileTap="tap"
                >
                  {isCameraOff ? (
                    <FaVideoSlash className="w-6 h-6 text-white" />
                  ) : (
                    <FaVideo className="w-6 h-6 text-white" />
                  )}
                </motion.button>

                <motion.button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`p-4 rounded-full ${
                    isRecording ? "bg-yellow-600 hover:bg-yellow-700" : "bg-green-600 hover:bg-green-700"
                  }`}
                  variants={buttonAnimation}
                  whileHover="hover"
                  whileTap="tap"
                  animate={isRecording ? { scale: [1, 1.1, 1], transition: { repeat: Infinity, duration: 1.5 } } : {}}
                >
                  {isRecording ? (
                    <FaStopCircle className="w-6 h-6 text-white" />
                  ) : (
                    <FaRecordVinyl className="w-6 h-6 text-white" />
                  )}
                </motion.button>

                <AnimatePresence>
                  {recordingFinished && (
                    <>
                      <motion.button
                        onClick={previewRecording}
                        className="p-4 rounded-full bg-blue-600 hover:bg-blue-700"
                        title="Preview Recording"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        variants={buttonAnimation}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <FaVideo className="w-6 h-6 text-white" />
                      </motion.button>
                      
                      <motion.button
                        onClick={uploadRecording}
                        disabled={isUploading}
                        className={`p-4 rounded-full ${
                          isUploading ? "bg-gray-500" : "bg-purple-600 hover:bg-purple-700"
                        }`}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        variants={buttonAnimation}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <MdCloudUpload 
                          className={`w-6 h-6 text-white ${isUploading ? "animate-pulse" : ""}`} 
                        />
                      </motion.button>
                    </>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VideoCall;