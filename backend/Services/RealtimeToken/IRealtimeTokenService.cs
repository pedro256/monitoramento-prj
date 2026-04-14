namespace backend.Services.RealtimeToken
{
    public interface IRealtimeTokenService
    {
         string Generate(string userId, string orgId);
    }
}