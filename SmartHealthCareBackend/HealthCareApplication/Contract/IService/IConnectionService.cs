using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareApplication.Contract.IService
{
    public interface IConnectionService
    {
        void AddConnection(string userId, string connectionId);
        void RemoveConnection(string connectionId);
        string GetConnection(string userId);
    }
}
