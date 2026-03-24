
using backend.Contexts;
using backend.Models;
using backend.Repositories.Base;
using Microsoft.EntityFrameworkCore;



namespace backend.Repositories.Devices
{
    public class DeviceRepository : BaseRepository<DeviceModel>
    {
        public DeviceRepository(AppPgDbContext context) : base(context) { }

        public async Task<IEnumerable<DeviceModel>> GetByOrganizationAsync(Guid orgId)
        {
            return await _context.Devices
                .Where(d => d.OrganizationId == orgId)
                .ToListAsync();
        }

        public async Task<DeviceModel?> GetByApiTokenAsync(Guid token)
        {
            return await _context.Devices
                .FirstOrDefaultAsync(d => d.ApiToken == token);
        }
    }
}