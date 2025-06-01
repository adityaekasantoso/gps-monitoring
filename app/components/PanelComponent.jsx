"use client";

import React, { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { FaLocationArrow } from "react-icons/fa";
import { MdOutlineUpdate } from "react-icons/md";
import { parseISO, format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Command,
  CommandInput,
} from "@/components/ui/command";

function formatTime(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) return `${diffSec} second ago`;

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} minute ago`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return format(date, "HH:mm");

  return format(date, "yyyy-MM-dd HH:mm:ss");
}

function SkeletonCard() {
  return (
    <Card className="p-4 w-full rounded-md border border-gray-200 shadow-none mx-auto mb-4 cursor-pointer">
      <Skeleton className="h-4 w-3/4" />
      <div className="flex justify-between">
        <Skeleton className="h-3 w-1/4" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </Card>
  );
}

function isDataEqual(oldData, newData) {
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

function PanelComponent() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [minimizedCards, setMinimizedCards] = useState({});
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch data interval
  useEffect(() => {
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
              (a, b) => new Date(b.rxtime) - new Date(a.rxtime)
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

  // Initialize minimizedCards for new data items
  useEffect(() => {
    if (data.length > 0 && Object.keys(minimizedCards).length === 0) {
      const initialMinimized = {};
      data.forEach((item) => {
        initialMinimized[item.id] = true;
      });
      setMinimizedCards(initialMinimized);
    }
  }, [data, minimizedCards]);

  // Sync minimizedCards with showDetails toggle (expand/collapse all)
  useEffect(() => {
    setMinimizedCards((prev) => {
      const newState = {};
      Object.keys(prev).forEach((id) => {
        newState[id] = !showDetails;
      });
      return newState;
    });
  }, [showDetails]);

  function toggleMinimize(id) {
    setMinimizedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  // Filter data by search term (rname)
  const filteredData = data.filter((item) =>
    item.rname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full h-screen px-4 mt-5 flex flex-col">
      <div className="mb-4">
        <Command className="rounded-lg border">
          <CommandInput
            placeholder="Search"
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
        </Command>
      </div>

      <div className="flex flex-col justify-between flex-1">
        <ScrollArea className="h-140">
          {loading && data.length === 0 ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : filteredData.length > 0 ? (
            filteredData.map((item) => {
              const timeUpdated = parseISO(item.rxtime);
              const formattedTime = formatTime(timeUpdated);
              const isMinimized = minimizedCards[item.id] ?? true;

              return (
                <Card
                  key={item.id}
                  className="p-4 w-full rounded-md border border-gray-200 shadow-none mx-auto mb-4 cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-bold">{item.rname}</h4>
                      <button
                        onClick={() => toggleMinimize(item.id)}
                        className="text-gray-500 hover:text-gray-700"
                        aria-label={isMinimized ? "Expand card" : "Minimize card"}
                      >
                        {isMinimized ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center space-x-2 text-muted-foreground text-sm justify-between">
                      <p>#{item.id}</p>
                      <div className="flex items-center space-x-1 ml-4">
                        <MdOutlineUpdate className="w-4 h-4" />
                        <span>{formattedTime}</span>
                      </div>
                    </div>

                    {!isMinimized && (
                      <>
                        <Separator className="my-4" />
                        <div className="flex h-5 items-center space-x-4 text-sm justify-between mt-5">
                          <div>
                            Speed: <span className="font-bold">{item.speed} Km/h</span>
                          </div>
                          <Separator orientation="vertical" />
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-10 w-10 p-1"
                            title="Lihat lokasi"
                          >
                            <FaLocationArrow className="w-4 h-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </Card>
              );
            })
          ) : !error ? (
            <p className="text-sm text-muted-foreground text-center">Data Not Found</p>
          ) : null}
        </ScrollArea>

        <div className="flex items-center space-x-3 justify-center mb-6">
          <Switch
            id="toggle-details"
            checked={showDetails}
            onCheckedChange={setShowDetails}
          />
          <label htmlFor="toggle-details" className="select-none cursor-pointer">
            Tampilkan detail
          </label>
        </div>
      </div>
    </div>
  );
}

export default PanelComponent;
