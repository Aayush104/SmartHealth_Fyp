// import * as signalR from "@microsoft/signalr";

// export const connectToMeetingHub = (meetingId, onMessageReceived) => {
//   // Ensure meetingId is a string.
//   const groupName = String(meetingId);

//   const connection = new signalR.HubConnectionBuilder()
//     .withUrl("https://localhost:7070/meetingHub")
//     .withAutomaticReconnect()
//     .build();

//   connection
//     .start()
//     .then(() => {
//       console.log("Connected to SignalR for video call");
//       connection.invoke("JoinRoom", groupName)
//         .catch(err => console.error("JoinRoom error:", err));
//     })
//     .catch(err => console.error("SignalR Connection Error: ", err));

//   connection.on("UserJoined", (connectionId) => {
//     console.log("User joined: ", connectionId);
//   });

 
//   connection.on("ReceiveOffer", (from, offer) => {
//     onMessageReceived("offer", { from, offer });
//   });

//   connection.on("ReceiveAnswer", (from, answer) => {
//     onMessageReceived("answer", { from, answer });
//   });

//   connection.on("ReceiveIceCandidate", (from, candidate) => {
//     onMessageReceived("iceCandidate", { from, candidate });
//   });

//   return connection;
// };
// useSignalR.js
// useSignalR.js
import * as signalR from "@microsoft/signalr";

export const connectToMeetingHub = (meetingId, onMessageReceived) => {
  const groupName = String(meetingId);
  console.log("Connecting to meeting with ID:", groupName);

  const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7070/meetingHub")
    .withAutomaticReconnect()
    .build();

  connection
    .start()
    .then(() => {
      console.log("Connected to SignalR for video call");
      // You can join the room later when both users are ready.
    })
    .catch((err) => console.error("SignalR Connection Error: ", err));

  // Listen for server events
  connection.on("UserJoined", (connectionId) => {
    console.log("User joined: ", connectionId);
  });

  connection.on("ReceiveOffer", (from, offer) => {
    onMessageReceived("offer", { from, offer });
  });

  connection.on("ReceiveAnswer", (from, answer) => {
    onMessageReceived("answer", { from, answer });
  });

  connection.on("ReceiveIceCandidate", (from, candidate) => {
    onMessageReceived("iceCandidate", { from, candidate });
  });

  connection.on("BothUsersReady", () => {
    console.log("Both users are ready to start the call.");
    onMessageReceived("BothUsersReady");
  });

  connection.on("UserReadyAck", () => {
    console.log("User is marked as ready.");
  });

  connection.on("WaitingForOtherUser", () => {
    console.log("Waiting for the other user to be ready...");
  });

  return connection;
};
