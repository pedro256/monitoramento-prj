using System;
using System.Threading.Tasks;

namespace backend.Infra.Realtime
{
    public interface IRealtimeNotifier
    {
        Task SendToOrganization(string organizationId, object message);
    }
}