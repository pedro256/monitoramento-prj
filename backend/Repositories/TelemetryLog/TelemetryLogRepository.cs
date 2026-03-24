using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Contexts;
using backend.Models;
using backend.Repositories.Base;

using Microsoft.EntityFrameworkCore;

namespace backend.Repositories.TelemetryLog
{
    public class TelemetryLogRepository : BaseRepository<TelemetryLogModel>
    {
        public TelemetryLogRepository(AppPgDbContext context) : base(context) { }

        public async Task<IEnumerable<TelemetryLogModel>> GetByDeviceAsync(Guid deviceId, int page = 1, int pageSize = 50)
        {
            return await _context.TelemetryLogs
                .Where(t => t.DeviceId == deviceId)
                .OrderByDescending(t => t.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }
    }
}