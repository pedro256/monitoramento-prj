import { apiFetch } from "@/lib/api/client";
import IDeviceItem from "@/shared/models/devices/IDeviceItem";

export async function listDevices(organizationId: string) {
  return apiFetch<IDeviceItem[]>(`/api/organizations/${organizationId}/devices`);
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
