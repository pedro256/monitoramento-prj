
using backend.Contexts;
using backend.Repositories.Base;
using backend.Users.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories.Users;

public class UsersRepository : BaseRepository<UsersModel>
{
    public UsersRepository(AppPgDbContext context) : base(context) { }

    public async Task<UsersModel?> GetByEmailAsync(string email)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.Email == email);
    }
}