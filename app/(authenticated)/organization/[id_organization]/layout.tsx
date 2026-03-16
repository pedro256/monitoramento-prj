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
      <div className="flex-1 h-screen overflow-y-auto pt-6 pb-54 px-6">
        {children}
      </div>
    </div>
  );
}
