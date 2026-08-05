using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Contexts;
using backend.Models;
using backend.Repositories.Base;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories.Alert
{
    public class AlertRepository : BaseRepository<AlertModel>
    {
        public AlertRepository(AppPgDbContext context) : base(context) { }

        public async Task<IEnumerable<AlertModel>> GetByDeviceAsync(Guid deviceId, int limit = 50)
        {
            return await _context.Alerts
                .Where(a => a.DeviceId == deviceId)
                .OrderByDescending(a => a.CreatedAt)
                .Take(limit)
                .ToListAsync();
        }

        public async Task<IEnumerable<AlertModel>> GetUnresolvedAsync()
        {
            return await _context.Alerts
                .Where(a => !a.Resolved)
                .ToListAsync();
        }
    }
}