using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTOs
{
    public class DevicesOnlineChecker
    {
        public string id {get;set;}
        public DateTime lastSeen {get;set;}
    }
}