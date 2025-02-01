// export class WebRTCConnection {
//   constructor(remoteVideoRef) {
//     this.remoteVideoRef = remoteVideoRef;
//     this.localStream = null;
//     this.peerConnection = new RTCPeerConnection({
//       iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//     });
//   }

//   async startLocalStream() {
//     this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//     return this.localStream;
//   }

//   async createOffer() {
//     const offer = await this.peerConnection.createOffer();
//     await this.peerConnection.setLocalDescription(offer);
//     return offer;
//   }

//   async createAnswer(offer) {
//     await this.peerConnection.setRemoteDescription(offer);
//     const answer = await this.peerConnection.createAnswer();
//     await this.peerConnection.setLocalDescription(answer);
//     return answer;
//   }

//   async addIceCandidate(candidate) {
//     try {
//       await this.peerConnection.addIceCandidate(candidate);
//     } catch (error) {
//       console.error("Error adding received ICE candidate", error);
//     }
//   }

//   async setRemoteDescription(description) {
//     try {
//       await this.peerConnection.setRemoteDescription(description);
//     } catch (error) {
//       console.error("Error setting remote description", error);
//     }
//   }

//   setRemoteStream(stream) {
//     if (this.remoteVideoRef.current) {
//       this.remoteVideoRef.current.srcObject = stream;
//     }
//   }
// }
// WebRtc.js
// WebRtc.js
// WebRtc.js
export class WebRTCConnection {
  constructor(remoteVideoRef) {
    this.remoteVideoRef = remoteVideoRef;
    this.localStream = null;
    this.createPeerConnection();
  }

  // Create or reinitialize the RTCPeerConnection
  createPeerConnection() {
    this.peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    // Handle remote stream tracks
    this.peerConnection.ontrack = (event) => {
      console.log("Remote track event fired:", event);
      if (this.remoteVideoRef.current) {
        console.log("Remote stream:", event.streams[0]);
        this.remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // Handle ICE candidates
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("Local ICE candidate:", event.candidate);
        if (this.onIceCandidate) {
          this.onIceCandidate(event.candidate);
        }
      } else {
        console.log("All local ICE candidates have been sent.");
      }
    };

    this.peerConnection.onconnectionstatechange = () => {
      console.log("Connection state changed to:", this.peerConnection.connectionState);
    };
  }

  // Add all local tracks to the connection.
  addAllTracks() {
    if (!this.localStream) return;
    this.localStream.getTracks().forEach((track) => {
      try {
        // Check if the connection is closed before adding each track.
        if (this.peerConnection.signalingState === "closed") {
          console.warn("PeerConnection is closed. Reinitializing before adding track...");
          this.createPeerConnection();
        }
        this.peerConnection.addTrack(track, this.localStream);
      } catch (err) {
        console.error("Error adding track:", err);
      }
    });
  }

  async startLocalStream() {
    try {
      // If the RTCPeerConnection is closed, then create a fresh instance.
      if (!this.peerConnection || this.peerConnection.signalingState === "closed") {
        console.warn("PeerConnection is closed. Creating a new instance before adding tracks...");
        this.createPeerConnection();
      }
      
      // Get the local media stream.
      this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      console.log("Local stream acquired:", this.localStream);
  
      // Add all tracks.
      this.localStream.getTracks().forEach((track) => {
        try {
          this.peerConnection.addTrack(track, this.localStream);
        } catch (err) {
          console.error("Error adding track:", err);
        }
      });
      
      return this.localStream;
    } catch (error) {
      console.error("Failed to access media devices:", error);
      throw error;
    }
  }
  
  // Create and send an offer.
  async createOffer() {
    try {
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      console.log("Created offer:", offer);
      return offer;
    } catch (error) {
      console.error("Error creating offer:", error);
      throw error;
    }
  }

  // Create and send an answer to an offer.
  async createAnswer(offer) {
    try {
      await this.peerConnection.setRemoteDescription(offer);
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      console.log("Created answer:", answer);
      return answer;
    } catch (error) {
      console.error("Error creating answer:", error);
      throw error;
    }
  }

  // Add ICE candidate received from remote peer.
  async addIceCandidate(candidate) {
    try {
      await this.peerConnection.addIceCandidate(candidate);
      console.log("Added ICE candidate:", candidate);
    } catch (error) {
      console.error("Error adding received ICE candidate", error);
    }
  }

  // Set remote description.
  async setRemoteDescription(description) {
    try {
      await this.peerConnection.setRemoteDescription(description);
      console.log("Set remote description:", description);
    } catch (error) {
      console.error("Error setting remote description", error);
    }
  }

  // Close the connection and stop the local stream.
  closeConnection() {
    if (this.peerConnection) {
      this.peerConnection.close();
      console.log("Peer connection closed.");
    }
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      console.log("Local stream tracks stopped.");
    }
  }
}
