
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


        public async Task<Dictionary<string, string>> GetDictOrganizationsByArrayDeviceId(List<string> devicesId)
        {
            return await _context.Devices
                .Where(dev => devicesId.Contains(dev.Id.ToString()))
                .Select(d => new
                {
                    DeviceId = d.Id.ToString(),
                    OrganizationId = d.OrganizationId.ToString()
                })
                .ToDictionaryAsync(
                    x => x.DeviceId,
                    x => x.OrganizationId
                );
        }
    }
}