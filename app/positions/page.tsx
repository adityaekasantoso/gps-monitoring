"use client";

import React, { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import MapComponents from "../components/MapComponents";

export default function Page() {
  // State koordinat pusat peta yang dipilih dari sidebar
  const [selectedPosition, setSelectedPosition] = useState<{
    lat: number;
    lon: number;
  } | null>(null);

  // Fungsi ini akan dikirim ke AppSidebar, dipanggil saat klik item sidebar
  const handleSetMapView = (lat: number, lon: number) => {
    setSelectedPosition({ lat, lon });
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "350px",
        } as React.CSSProperties
      }
    >
      {/* Kirim fungsi handleSetMapView ke AppSidebar */}
      <AppSidebar onSetMapView={handleSetMapView} />

      <SidebarInset>
        <header className="bg-background sticky top-0 flex shrink-0 items-center gap-2 border-b p-4 z-10">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">All Positions</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Radio</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="relative flex flex-1 flex-col gap-4 p-4 absolute inset-0 z-0">
          <MapComponents
            selectedLat={selectedPosition?.lat}
            selectedLon={selectedPosition?.lon}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
