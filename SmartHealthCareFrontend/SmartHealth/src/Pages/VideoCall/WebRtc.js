export class WebRTCConnection {
  constructor(remoteVideoRef) {
    this.remoteVideoRef = remoteVideoRef;
    this.localStream = null;
    this.peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
  }

  async startLocalStream() {
    this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    return this.localStream;
  }

  async createOffer() {
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    return offer;
  }

  async createAnswer(offer) {
    await this.peerConnection.setRemoteDescription(offer);
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);
    return answer;
  }

  async addIceCandidate(candidate) {
    try {
      await this.peerConnection.addIceCandidate(candidate);
    } catch (error) {
      console.error("Error adding received ICE candidate", error);
    }
  }

  async setRemoteDescription(description) {
    try {
      await this.peerConnection.setRemoteDescription(description);
    } catch (error) {
      console.error("Error setting remote description", error);
    }
  }

  setRemoteStream(stream) {
    if (this.remoteVideoRef.current) {
      this.remoteVideoRef.current.srcObject = stream;
    }
  }
}
