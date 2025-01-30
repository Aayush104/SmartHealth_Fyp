using HealthCareApplication.Contract.IService;
using System.Collections.Concurrent;

namespace HealthCareApplication.Features.Services
{
    public class ConnectionService : IConnectionService
    {
        private readonly ConcurrentDictionary<string, string> _connections = new();

        public void AddConnection(string userId, string connectionId)
        {
            _connections.AddOrUpdate(userId, connectionId, (_, _) => connectionId);
        }

        public string GetConnection(string userId)
        {
            return _connections.TryGetValue(userId, out var connectionId) ? connectionId : null;
        }

        public void RemoveConnection(string connectionId)
        {
            var userEntry = _connections.FirstOrDefault(x => x.Value == connectionId);
            if (!string.IsNullOrEmpty(userEntry.Key))
            {
                _connections.TryRemove(userEntry.Key, out _);
            }
        }
    }
}