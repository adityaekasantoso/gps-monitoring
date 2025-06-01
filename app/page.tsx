'use client';

import PanelComponent from './components/PanelComponent';
import MapComponents from './components/MapComponents';

export default function Home() {
  return (
    <div className="flex h-screen w-screen">
      <div className="w-[22%] border-r border-gray-300">
        <PanelComponent />
      </div>

      <div className="w-[78%]">
        <MapComponents />
      </div>
    </div>
  );
}
