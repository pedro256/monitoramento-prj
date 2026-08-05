export default interface IDeviceItem {
  id: string;
  organizationId: string;
  name: string;
  model: string | null;
  location: string | null;
  apiToken: string;
  lastHeartbeat: string | null;
  createdAt: string;
  status: string;
}

export interface ITelemetryAlert {
  id: string;
  deviceId: string | null;
  severity: string;
  message: string;
  resolved: boolean;
  createdAt: string;
}

export interface ITelemetryLog {
  id: number;
  deviceId: string | null;
  cycleCount: number | null;
  tag: string;
  value: number;
  unity: string;
  createdAt: string;
}
