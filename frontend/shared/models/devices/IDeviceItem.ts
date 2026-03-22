export default interface IDeviceItem {
  id: string;
  organizationId: string;
  name: string;
  model: string;
  location: string | null;
  apiToken: string;
  lastHeartbeat: string;
  createdAt: string;
  status: number;
}