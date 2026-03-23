using backend.Models;
using backend.Users.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Contexts
{
    public class AppPgDbContext : DbContext
    {
        public AppPgDbContext(DbContextOptions<AppPgDbContext> options)
       : base(options) { }

        public DbSet<UsersModel> Users => Set<UsersModel>();
        public DbSet<OrganizationModel> Organizations => Set<OrganizationModel>();
        public DbSet<DeviceModel> Devices => Set<DeviceModel>();
        public DbSet<AlertModel> Alerts => Set<AlertModel>();
        public DbSet<TelemetryLogModel> TelemetryLogs => Set<TelemetryLogModel>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // USERS
            modelBuilder.Entity<UsersModel>()
                .ToTable("users");

            modelBuilder.Entity<UsersModel>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // ORGANIZATIONS
            modelBuilder.Entity<OrganizationModel>()
                .ToTable("organizations");

            modelBuilder.Entity<OrganizationModel>()
                .HasOne(o => o.User)
                .WithMany(u => u.Organizations)
                .HasForeignKey(o => o.UserId);

            // DEVICES
            modelBuilder.Entity<DeviceModel>()
                .ToTable("devices");

            modelBuilder.Entity<DeviceModel>()
                .HasOne(d => d.Organization)
                .WithMany(o => o.Devices)
                .HasForeignKey(d => d.OrganizationId);

            modelBuilder.Entity<DeviceModel>()
                .HasIndex(d => d.ApiToken)
                .IsUnique();

            modelBuilder.Entity<DeviceModel>()
                .Property(d => d.Settings)
                .HasColumnType("jsonb");

            // ALERTS
            modelBuilder.Entity<AlertModel>()
                .ToTable("alerts");

            modelBuilder.Entity<AlertModel>()
                .HasOne(a => a.Device)
                .WithMany(d => d.Alerts)
                .HasForeignKey(a => a.DeviceId);

            // TELEMETRY
            modelBuilder.Entity<TelemetryLogModel>()
                .ToTable("telemetry_logs");

            modelBuilder.Entity<TelemetryLogModel>()
                .HasOne(t => t.Device)
                .WithMany(d => d.TelemetryLogs)
                .HasForeignKey(t => t.DeviceId);

            modelBuilder.Entity<TelemetryLogModel>()
                .Property(t => t.Payload)
                .HasColumnType("jsonb");
        }
    }
}
