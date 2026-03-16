import React from "react";
import SidebarOrganization from "./_components/sidebar-my-organization";
export default async function AreaOrganizationLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="flex">
      <SidebarOrganization />
      <div className="flex-1 overflow-y-auto py-6 px-3">
        {children}
      </div>
    </div>
  );
}
