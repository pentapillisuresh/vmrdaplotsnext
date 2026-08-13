"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
} from "react-leaflet";
import { useRouter } from "next/navigation";
import "leaflet/dist/leaflet.css";

export default function PropertyMap({
  lat,
  lon,
  slug,
  title,
  image,
  location,
}) {
  const router = useRouter();

  const [icon, setIcon] = useState(null);

  useEffect(() => {
    import("leaflet").then((L) => {
      const leafletIcon = new L.Icon({
        iconUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [30, 45],
        iconAnchor: [15, 45],
      });

      setIcon(leafletIcon);
    });
  }, []);

  if (!icon) return null;

  const position = [
    Number(lat) || 17.6868,
    Number(lon) || 83.2185,
  ];

  return (
    <MapContainer
      center={position}
      zoom={15}
      scrollWheelZoom
      style={{
        width: "100%",
        height: "500px",
        borderRadius: "16px",
      }}
    >
      <TileLayer
        url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
        subdomains={["0", "1", "2", "3"]}
        maxZoom={22}
      />

      <Marker position={position} icon={icon}>
        <Tooltip
          permanent
          direction="bottom"
          offset={[0, 15]}
          interactive
          opacity={1}
          className="property-tooltip"
        >
          <div
            onClick={() => router.push(`/property/${slug}`)}
            className="cursor-pointer w-[260px] bg-white rounded-xl overflow-hidden shadow-xl"
          >
            <img
              src={image}
              alt={title}
              className="w-full h-32 object-cover"
            />

            <div className="p-3">
              <h3 className="font-bold text-[#003366] line-clamp-2">
                {title}
              </h3>



              <p className="text-sm text-gray-500 mt-2">
                📍 {location}
              </p>
            </div>
          </div>
        </Tooltip>
      </Marker>
    </MapContainer>
  );
}