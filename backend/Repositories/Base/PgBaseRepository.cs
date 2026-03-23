using backend.Contexts;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories.Base
{
    public class BaseRepository<T> : IBaseRepository<T> where T : class
{
    protected readonly AppPgDbContext _context;
    protected readonly DbSet<T> _dbSet;

    public BaseRepository(AppPgDbContext context)
    {
        _context = context;
        _dbSet = _context.Set<T>();
    }

    public async Task<IEnumerable<T>> GetAllAsync()
    {
        return await _dbSet.ToListAsync();
    }

    public async Task<T?> GetByIdAsync(object id)
    {
        return await _dbSet.FindAsync(id);
    }

    public async Task<T> CreateAsync(T entity)
    {
        await _dbSet.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task UpdateAsync(T entity)
    {
        _dbSet.Update(entity);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(object id)
    {
        var entity = await GetByIdAsync(id);
        if (entity == null) return;

        _dbSet.Remove(entity);
        await _context.SaveChangesAsync();
    }
}
}