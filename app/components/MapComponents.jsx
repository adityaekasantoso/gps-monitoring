"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const RealMapComponent = dynamic(() => import("./RealMapComponent"), {

  ssr: false,
});

export default function MapComponents() {
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
      <RealMapComponent cars={cars} />
    </div>
  );
}
