"use client"

import { useEffect, useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";

// Import Leaflet CSS directly
const leafletStyles = `
.leaflet-container {
  height: 100%;
  width: 100%;
  z-index: 1;
}

.leaflet-control-container {
  z-index: 1000;
}

.leaflet-popup-content-wrapper, 
.leaflet-popup-tip {
  background: white;
  color: #333;
  box-shadow: 0 3px 14px rgba(0,0,0,0.4);
}

.leaflet-container a.leaflet-popup-close-button {
  color: #999;
  padding: 4px 4px 0 0;
}

.leaflet-container a.leaflet-popup-close-button:hover {
  color: #000;
}
`;

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapProps {
  latitude: number;
  longitude: number;
  onLocationSelect?: (lat: number, lng: number) => void;
  interactive?: boolean;
  className?: string;
  mapType?: MapType;
}

type MapType = "standard" | "terrain" | "satellite" | "light";

const mapTypes: { [key in MapType]: { url: string; attribution: string } } = {
  standard: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },
  terrain: {
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors'
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a> contributors'
  },
  light: {
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> contributors'
  }
};

function LocationMarker({ onLocationSelect, initialLat, initialLng }: { 
  onLocationSelect?: (lat: number, lng: number) => void; 
  initialLat: number; 
  initialLng: number; 
}) {
  const [position, setPosition] = useState<[number, number]>([initialLat, initialLng]);
  const map = useMap();
  
  const mapEvents = useMapEvents({
    click(e) {
      if (onLocationSelect) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        onLocationSelect(lat, lng);
        map.setView([lat, lng], 15); // Zoom to selected location
      }
    },
  });

  useEffect(() => {
    if (initialLat !== 0 && initialLng !== 0) {
      setPosition([initialLat, initialLng]);
      map.setView([initialLat, initialLng], 15); // Zoom to location
    }
  }, [initialLat, initialLng, map]);

  return position[0] !== 0 && position[1] !== 0 ? (
    <Marker position={position} />
  ) : null;
}

function MapControls({ onMapTypeChange }: { onMapTypeChange: (type: MapType) => void }) {
  const [currentType, setCurrentType] = useState<MapType>("standard");

  const handleTypeChange = (type: MapType) => {
    setCurrentType(type);
    onMapTypeChange(type);
  };

  return (
    <div className="absolute top-4 right-4 z-[1000] bg-white rounded-lg shadow-md p-2 flex gap-1">
      <button
        onClick={() => handleTypeChange("standard")}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
          currentType === "standard" 
            ? "bg-blue-600 text-white" 
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
        title="Standard Map"
      >
        Standard
      </button>
      <button
        onClick={() => handleTypeChange("terrain")}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
          currentType === "terrain" 
            ? "bg-green-600 text-white" 
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
        title="Terrain Map"
      >
        Terrain
      </button>
      <button
        onClick={() => handleTypeChange("satellite")}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
          currentType === "satellite" 
            ? "bg-purple-600 text-white" 
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
        title="Satellite View"
      >
        Satellite
      </button>
      <button
        onClick={() => handleTypeChange("light")}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
          currentType === "light" 
            ? "bg-gray-600 text-white" 
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
        title="Light Map"
      >
        Light
      </button>
    </div>
  );
}

export function PropertyMap({ latitude, longitude, onLocationSelect, interactive = false, className = "", mapType: mapTypeProp }: MapProps) {
  const [isClient, setIsClient] = useState(false);
  const [mapType, setMapType] = useState<MapType>("standard");

  useEffect(() => {
    setIsClient(true);
    console.log('Map component mounted with props:', { latitude, longitude, mapTypeProp, interactive });
  }, []);

  const effectiveMapType = mapTypeProp || mapType;

  // Fallback coordinates if latitude or longitude are zero or invalid
  const validLatitude = latitude && latitude !== 0 ? latitude : 37.7749; // Default to San Francisco
  const validLongitude = longitude && longitude !== 0 ? longitude : -122.4194;

  if (!isClient) {
    return (
      <div className={`bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200 ${className}`} style={{ height: '400px', width: '100%' }}>
        <div className="text-center text-slate-500">
          <p>Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="text-xs text-gray-500 mb-1">
        Debug: Lat: {validLatitude}, Lng: {validLongitude}, MapType: {effectiveMapType}
      </div>
      <div className="h-64 w-full rounded-xl overflow-hidden border border-gray-200">
        <MapContainer
          center={[validLatitude, validLongitude]}
          zoom={latitude && longitude ? 15 : 2} // Higher zoom level for better location view
          className="h-full w-full"
          zoomControl={interactive}
          dragging={interactive}
          scrollWheelZoom={interactive}
          doubleClickZoom={interactive}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution={mapTypes[effectiveMapType].attribution}
            url={mapTypes[effectiveMapType].url}
          />
          <LocationMarker 
            onLocationSelect={onLocationSelect} 
            initialLat={validLatitude} 
            initialLng={validLongitude} 
          />
        </MapContainer>
      </div>
      
      {interactive && !mapTypeProp && (
        <MapControls onMapTypeChange={setMapType} />
      )}
    </div>
  );
}
