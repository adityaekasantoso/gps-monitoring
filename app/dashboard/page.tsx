"use client";

import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function Page() {
  const handleSetMapView = (lat: number, lon: number) => {
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "49px",
        } as React.CSSProperties
      }
    >
      <AppSidebar onSetMapView={handleSetMapView} />
      <SidebarInset>
        <div className="flex flex-1 items-center justify-center p-4 text-gray-500">
          Halaman Kosong
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
