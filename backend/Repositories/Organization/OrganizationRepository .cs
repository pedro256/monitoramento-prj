using backend.Contexts;
using backend.Models;
using backend.Repositories.Base;
using Microsoft.EntityFrameworkCore;


namespace backend.Repositories.Organization
{
    public class OrganizationRepository : BaseRepository<OrganizationModel>
    {
        public OrganizationRepository(AppPgDbContext context) : base(context) { }

        public async Task<IEnumerable<OrganizationModel>> GetByUserAsync(Guid userId)
        {
            return await _context.Organizations
                .Where(o => o.UserId == userId)
                .ToListAsync();
        }
        public async Task<bool> UserHasAccess(Guid userId, Guid orgId)
        {
            return _context.Organizations
            .Where(o => o.UserId == userId)
            .Where(o => o.Id == orgId)
            .Count() > 0;
        }
    }
}