"use client";

import { useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BadgeCheckIcon,
  AlertCircleIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const carIcon = new L.Icon({
  iconUrl: "/assets/car-icon.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

function isRecentlyUpdated(timeStr) {
  const now = dayjs();
  const time = dayjs(timeStr);
  const diffInSeconds = now.diff(time, "second");
  return diffInSeconds <= 10;
}

function ControlButtons({ setCenter }) {
  const map = useMap();

  return (
    <div className="absolute top-4 right-4 flex flex-col gap-2 z-[1000]">
      <Button
        size="icon"
        variant="outline"
        onClick={() => map.zoomIn()}
        title="Zoom In"
      >
        <ZoomInIcon className="h-4 w-4" />
      </Button>

      <Button
        size="icon"
        variant="outline"
        onClick={() => map.zoomOut()}
        title="Zoom Out"
      >
        <ZoomOutIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default function MapComponent({ cars }) {
  const mapRef = useRef();

  return (
    <div className="relative" style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={[3.3, 99.1]}
        zoom={9}
        zoomControl={false}
        style={{ height: "100%", width: "100%" }}
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {cars.map((car) => {
          const lat = parseFloat(car.lat);
          const lon = parseFloat(car.lon);
          if (isNaN(lat) || isNaN(lon)) return null;

          return (
            <Marker key={car.id} position={[lat, lon]} icon={carIcon}>
              <Popup
                className="!p-0 !border-none"
                closeButton={false}
                minWidth={140}
              >
                <div className="text-xs font-sans">
                  <div className="text-center font-bold text-sm mb-2 flex items-center justify-center gap-2">
                    <span>{car.rname}</span>
                    <span className="text-xs font-normal text-gray-500">
                      #{car.id}
                    </span>
                  </div>
                  <div className="text-center mb-3">
                    {isRecentlyUpdated(car.time) ? (
                      <Badge
                        variant="outline"
                        className="text-gray-500 gap-1 px-2 py-1 text-xs inline-flex items-center justify-center"
                      >
                        <BadgeCheckIcon className="w-3 h-3" />
                        Updated
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-gray-500 gap-1 px-2 py-1 text-xs inline-flex items-center justify-center"
                      >
                        <AlertCircleIcon className="w-3 h-3" />
                        {dayjs(car.time).fromNow()}
                      </Badge>
                    )}
                  </div>

                  <div className="flex justify-between mb-1">
                    <span>Speed</span>
                    <span className="font-bold text-gray-600">
                      {car.speed} Km/h
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        <ControlButtons />
      </MapContainer>
    </div>
  );
}
