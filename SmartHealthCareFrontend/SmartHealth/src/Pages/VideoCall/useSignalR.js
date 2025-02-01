import * as signalR from "@microsoft/signalr";

export const connectToMeetingHub = (meetingId, onMessageReceived) => {
  // Ensure meetingId is a string.
  const groupName = String(meetingId);

  const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7070/meetingHub")
    .withAutomaticReconnect()
    .build();

  connection
    .start()
    .then(() => {
      console.log("Connected to SignalR for video call");
      connection.invoke("JoinRoom", groupName)
        .catch(err => console.error("JoinRoom error:", err));
    })
    .catch(err => console.error("SignalR Connection Error: ", err));

  connection.on("UserJoined", (connectionId) => {
    console.log("User joined: ", connectionId);
  });

  // Pass along the received JSON string so that the caller can parse it.
  connection.on("ReceiveOffer", (from, offer) => {
    onMessageReceived("offer", { from, offer });
  });

  connection.on("ReceiveAnswer", (from, answer) => {
    onMessageReceived("answer", { from, answer });
  });

  connection.on("ReceiveIceCandidate", (from, candidate) => {
    onMessageReceived("iceCandidate", { from, candidate });
  });

  return connection;
};
