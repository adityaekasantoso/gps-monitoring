"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Command, LayoutDashboard, MapPin } from "lucide-react";

import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { FaCar, FaLocationArrow } from "react-icons/fa";
import { MdOutlineUpdate } from "react-icons/md";
import { parseISO, format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

const navMain = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Positions", url: "/positions", icon: MapPin },
];

const user = {
  name: "shadcn",
  email: "m@example.com",
  avatar: "/avatars/shadcn.jpg",
};

function formatTime(date: Date) {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) return `${diffSec} second ago`;

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} minute ago`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return format(date, "HH:mm");

  return format(date, "yyyy-MM-dd HH:mm:ss");
}

function isDataEqual(oldData: any[], newData: any[]) {
  if (oldData.length !== newData.length) return false;
  for (let i = 0; i < oldData.length; i++) {
    const oldItem = oldData[i];
    const newItem = newData[i];
    if (
      oldItem.id !== newItem.id ||
      oldItem.rxtime !== newItem.rxtime ||
      oldItem.speed !== newItem.speed ||
      oldItem.rname !== newItem.rname
    ) {
      return false;
    }
  }
  return true;
}

function PanelComponent({
  searchTerm,
  showDetails,
  setShowDetails,
}: {
  searchTerm: string;
  showDetails: boolean;
  setShowDetails: (val: boolean) => void;
}) {
  const [data, setData] = React.useState<any[]>([]);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch("/api/currentpos", { cache: "no-store" });
        const text = await res.text();
        const parsed = JSON.parse(text);

        if (isMounted) {
          if (parsed?.pos && Array.isArray(parsed.pos)) {
            const sortedData = parsed.pos.sort(
              (a: any, b: any) =>
                new Date(b.rxtime).getTime() - new Date(a.rxtime).getTime()
            );

            if (!isDataEqual(data, sortedData)) {
              setData(sortedData);
            }
            setError("");
          } else {
            setError("Data kosong atau tidak valid.");
            setData([]);
          }
        }
      } catch {
        if (isMounted) {
          setError("Gagal mengambil data.");
          setData([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();
    const intervalId = setInterval(fetchData, 1000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [data]);

  const filteredData = data.filter((item) =>
    item.rname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SidebarContent>
      <SidebarGroup className="px-0">
        <SidebarGroupContent>
          {loading && data.length === 0 ? (
            <p className="p-4 text-sm text-center text-muted-foreground">
              Loading...
            </p>
          ) : filteredData.length > 0 ? (
            filteredData.map((item) => {
              const timeUpdated = parseISO(item.rxtime);
              const formattedTime = formatTime(timeUpdated);

              return (
                <a
                  href="#"
                  key={item.id}
                  className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-col gap-2 border-b p-4 text-sm leading-tight whitespace-nowrap last:border-b-0"
                >
                  <div className="flex items-center gap-2">
                    <FaCar className="w-4 h-4 text-foreground" />
                    <span className="font-medium">{item.rname}</span>
                    <span className="ml-auto text-xs">{formattedTime}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs font-medium">#{item.id}</div>
                    <div className="text-xs font-medium">
                      Speed: {item.speed} km/h
                    </div>
                  </div>
                </a>
              );
            })
          ) : !error ? (
            <p className="text-sm text-muted-foreground text-center">
              Data Not Found
            </p>
          ) : (
            <p className="text-sm text-muted-foreground text-center">{error}</p>
          )}
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const router = useRouter();
  const { setOpen } = useSidebar();

  const activeItem =
    navMain.find((item) => pathname.startsWith(item.url)) || navMain[0];
  const isPositionsPage = pathname.startsWith("/positions");

  const [searchTerm, setSearchTerm] = React.useState("");
  const [showDetails, setShowDetails] = React.useState(false);

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
      {...props}
    >
      <Sidebar
        collapsible="none"
        className="w-[calc(var(--sidebar-width-icon)+1px)] border-r flex flex-col min-h-screen"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <a href="#">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <Command className="size-4" />
                  </div>
                  {isPositionsPage && (
                    <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                      <span className="truncate font-medium">GPS Monitoring</span>
                      <span className="truncate text-xs">Multiintegra Techology Group</span>
                    </div>
                  )}
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent className="flex-1">
          <SidebarGroup>
            <SidebarGroupContent
              className={isPositionsPage ? "px-1.5 md:px-0" : "p-0"}
            >
              <SidebarMenu>
                {navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: isPositionsPage ? false : true,
                      }}
                      onClick={() => {
                        router.push(item.url);
                        setOpen(true);
                      }}
                      isActive={pathname.startsWith(item.url)}
                      className={
                        isPositionsPage
                          ? "px-2.5 md:px-2 flex items-center gap-2"
                          : "p-0 flex justify-center"
                      }
                    >
                      <item.icon />
                      {isPositionsPage && <span>{item.title}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t">
          {isPositionsPage && <NavUser user={user} />}
        </SidebarFooter>
      </Sidebar>

      {isPositionsPage && (
        <Sidebar collapsible="none" className="hidden flex-1 md:flex flex-col">
          <SidebarHeader className="gap-3.5 border-b p-4 flex flex-col">
            <div className="flex w-full items-center justify-between mb-2">
              <div className="text-foreground text-base font-medium">
                {activeItem?.title}
              </div>
            </div>
            <SidebarInput
              placeholder="Type to search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SidebarHeader>

          <PanelComponent
            searchTerm={searchTerm}
            showDetails={showDetails}
            setShowDetails={setShowDetails}
          />
        </Sidebar>
      )}
    </Sidebar>
  );
}
