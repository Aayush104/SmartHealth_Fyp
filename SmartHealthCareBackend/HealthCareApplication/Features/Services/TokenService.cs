using HealthCareDomain.Entity.UserEntity;
using HealthCareDomain.IServices;
using Microsoft.Identity.Client;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareApplication.Features.Services
{
    public class TokenService : ITokenService
    {
        public TokenService() { 


        
        }

        public string GenerateToken(ApplicationUser user, List<string> roles)
        {

            var claims = new List<Claim>
            {
            
                new Claim("Id", user.Id),
               new  Claim("Name", user.FullName),   
               new  Claim("Email", user.Email ),   
             
            };

            foreach (var role in roles)
            {

                claims.Add(new Claim("Role", role));

            }

            var JWT_SECRET = Environment.GetEnvironmentVariable("JWT_SECRET");
                var JWT_ISSUER = Environment.GetEnvironmentVariable("JWT_ISSUER");
                var JWT_AUDIENCE = Environment.GetEnvironmentVariable("JWT_AUDIENCE");
               

                var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JWT_SECRET));
                var credentails = new SigningCredentials(securityKey,SecurityAlgorithms.HmacSha256);

                var Token = new JwtSecurityToken
                (
                    JWT_ISSUER,
                    JWT_AUDIENCE,
                    claims,
                    expires: DateTime.Now.AddMinutes(60),
                    signingCredentials : credentails
                 );


              return new JwtSecurityTokenHandler().WriteToken(Token);   

          

         
        }

      
    }
}
