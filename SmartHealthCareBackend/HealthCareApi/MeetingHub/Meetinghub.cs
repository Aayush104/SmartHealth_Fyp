// MeetingHub.cs
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HealthCareApi.MeetingHub
{
    public class MeetingHub : Hub
    {
        // Store users in meeting rooms
        private static readonly ConcurrentDictionary<string, HashSet<string>> MeetingRooms = new();

        // Track users' readiness for a call
        private static readonly ConcurrentDictionary<string, HashSet<string>> ReadyUsers = new();

        // User indicates readiness to start the call
        public async Task SetUserReady(string meetingId)
        {
            if (!ReadyUsers.ContainsKey(meetingId))
            {
                ReadyUsers[meetingId] = new HashSet<string>();
            }

            ReadyUsers[meetingId].Add(Context.ConnectionId);

            await Clients.Caller.SendAsync("UserReadyAck");

            if (ReadyUsers[meetingId].Count >= 2)
            {
                foreach (var connectionId in ReadyUsers[meetingId])
                {
                    await Clients.Client(connectionId).SendAsync("BothUsersReady");
                }
            }

        }

        // User joins the meeting room after both users are ready
        public async Task JoinRoom(string meetingId)
        {
            if (ReadyUsers.ContainsKey(meetingId) && ReadyUsers[meetingId].Count >= 2)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, meetingId);

                if (!MeetingRooms.ContainsKey(meetingId))
                {
                    MeetingRooms[meetingId] = new HashSet<string>();
                }
                MeetingRooms[meetingId].Add(Context.ConnectionId);

                Console.WriteLine($"User {Context.ConnectionId} joined room {meetingId}");
                // Notify the group that a new user has joined.
                await Clients.Group(meetingId).SendAsync("UserJoined", Context.ConnectionId);
            }
            else
            {
                await Clients.Caller.SendAsync("WaitingForOtherUser");
            }
        }

        // Send WebRTC offer to other users in the room.
        public async Task SendOffer(string meetingId, string offer)
        {
            await Clients.OthersInGroup(meetingId).SendAsync("ReceiveOffer", Context.ConnectionId, offer);
        }

        // Send WebRTC answer to other users in the room.
        public async Task SendAnswer(string meetingId, string answer)
        {
            await Clients.OthersInGroup(meetingId).SendAsync("ReceiveAnswer", Context.ConnectionId, answer);
        }

        // Send ICE candidate to other users in the room.
        public async Task SendIceCandidate(string meetingId, string candidate)
        {
            await Clients.OthersInGroup(meetingId).SendAsync("ReceiveIceCandidate", Context.ConnectionId, candidate);
        }

        // Clean up when a user disconnects.
        public override async Task OnDisconnectedAsync(Exception exception)
        {
            foreach (var room in MeetingRooms)
            {
                if (room.Value.Contains(Context.ConnectionId))
                {
                    room.Value.Remove(Context.ConnectionId);
                    if (ReadyUsers.ContainsKey(room.Key))
                    {
                        ReadyUsers[room.Key].Remove(Context.ConnectionId);
                    }
                    if (room.Value.Count == 0)
                    {
                        MeetingRooms.TryRemove(room.Key, out _);
                        ReadyUsers.TryRemove(room.Key, out _);
                    }
                    break;
                }
            }
            await base.OnDisconnectedAsync(exception);
        }
    }
}
