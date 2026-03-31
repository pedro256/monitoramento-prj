using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTOs;

public class DevicesPayload
{
    public Guid DeviceId { get; set; }
    public DateTime Timestamp { get; set; }
    public List<SensorReading> Sensors { get; set; } = [];
    // public List<StatusReading> Status { get; set; } = [];
    public List<AlertsReading> Alerts { get; set; } = [];
    // public ProducaoReading? Producao { get; set; }
}

public record SensorReading(string Tag, double Value, string Unity);
// public record StatusReading(string Tag, bool Estado);
public record AlertsReading(string Cod, string Description, string Severity,bool Resolved);
// public record ProducaoReading(int PecasProduzidas, int Ciclos, string Turno);
