import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const RealMapComponent = dynamic(() => import("./RealMapComponent"), {
  ssr: false,
});

export default function MapComponents({ selectedLat, selectedLon }) {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    async function fetchCars() {
      try {
        const res = await fetch("/api/currentpos");
        const data = await res.json();
        setCars(data.pos || []);
      } catch (error) {
        console.error("Gagal fetch data:", error);
      }
    }

    fetchCars();
    const interval = setInterval(fetchCars, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <RealMapComponent
        cars={cars}
        selectedLat={selectedLat}
        selectedLon={selectedLon}
      />
    </div>
  );
}
