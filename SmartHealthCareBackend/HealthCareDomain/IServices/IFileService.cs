using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareApplication.Contracts.IService
{
    public interface IFileService
    {
        Task<string> SaveFileAsync(IFormFile file, string path);
    }
}
