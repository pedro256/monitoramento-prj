import { apiFetch } from "@/lib/api/client";
import IDeviceItem, {
  ITelemetryAlert,
  ITelemetryLog,
} from "@/shared/models/devices/IDeviceItem";

export async function listDevices(organizationId: string) {
  return apiFetch<IDeviceItem[]>(`/api/organizations/${organizationId}/devices`);
}

export async function getDevice(organizationId: string, deviceId: string) {
  return apiFetch<IDeviceItem>(
    `/api/organizations/${organizationId}/devices/${deviceId}`,
  );
}

export async function listDeviceAlerts(
  organizationId: string,
  deviceId: string,
  limit = 50,
) {
  return apiFetch<ITelemetryAlert[]>(
    `/api/organizations/${organizationId}/devices/${deviceId}/alerts?limit=${limit}`,
  );
}

export async function listDeviceTelemetry(
  organizationId: string,
  deviceId: string,
  pageSize = 50,
) {
  return apiFetch<ITelemetryLog[]>(
    `/api/organizations/${organizationId}/devices/${deviceId}/telemetry?page=1&pageSize=${pageSize}`,
  );
}

export async function createDevice(
  organizationId: string,
  payload: { name: string; model?: string; location?: string },
) {
  return apiFetch<IDeviceItem>(`/api/organizations/${organizationId}/devices`, {
    method: "POST",
    body: payload,
  });
}

export async function updateDevice(
  organizationId: string,
  payload: { id: string; name: string; model?: string; location?: string },
) {
  return apiFetch<IDeviceItem>(`/api/organizations/${organizationId}/devices`, {
    method: "PATCH",
    body: payload,
  });
}

export async function deleteDevice(organizationId: string, id: string) {
  return apiFetch<{ success: boolean }>(
    `/api/organizations/${organizationId}/devices?id=${id}`,
    { method: "DELETE" },
  );
}
