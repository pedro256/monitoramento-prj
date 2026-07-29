import { apiFetch } from "@/lib/api/client";
import IOrganizationItem from "@/shared/models/organization/IOrganizationItem";

export async function listOrganizations() {
  return apiFetch<IOrganizationItem[]>("/api/organizations");
}

export async function createOrganization(payload: { name: string; email: string }) {
  return apiFetch<IOrganizationItem>("/api/organizations", {
    method: "POST",
    body: payload,
  });
}

export async function getOrganization(id: string) {
  return apiFetch<IOrganizationItem>(`/api/organizations/${id}`);
}
