using HealthCareDomain.Entity.UserEntity;

namespace HealthCareDomain.IServices
{
    public interface ITokenService
    {
        string GenerateToken(ApplicationUser user, List<string> roles);
    }
}
