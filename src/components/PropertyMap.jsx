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
  city,
  locality,
}) {
  const router = useRouter();

  const [icon, setIcon] = useState(null);
  const [position, setPosition] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);

  // ==========================================
  // Leaflet Icon
  // ==========================================

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

  // ==========================================
  // Get Location
  // ==========================================

  useEffect(() => {
    const getLocation = async () => {
      setLoadingLocation(true);

      try {
        // --------------------------------------
        // 1. If latitude & longitude exist
        // --------------------------------------

        const latitude = Number(lat);
        const longitude = Number(lon);

        if (
          Number.isFinite(latitude) &&
          Number.isFinite(longitude) &&
          latitude !== 0 &&
          longitude !== 0
        ) {
          setPosition([latitude, longitude]);
          setLoadingLocation(false);
          return;
        }

        // --------------------------------------
        // 2. If coordinates don't exist
        //    Use Locality + City
        // --------------------------------------

        const searchLocation = [
          locality,
          city,
        ]
          .filter(Boolean)
          .join(", ");

        if (!searchLocation) {
          setPosition([17.6868, 83.2185]);
          setLoadingLocation(false);
          return;
        }

        console.log(
          "Geocoding location:",
          searchLocation
        );

        // --------------------------------------
        // 3. Geocode using OpenStreetMap
        // --------------------------------------

        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
            searchLocation
          )}`
        );

        if (!response.ok) {
          throw new Error("Location lookup failed");
        }

        const results = await response.json();

        if (results?.length > 0) {
          const latitude = Number(results[0].lat);
          const longitude = Number(results[0].lon);

          if (
            Number.isFinite(latitude) &&
            Number.isFinite(longitude)
          ) {
            setPosition([
              latitude,
              longitude,
            ]);
          } else {
            setPosition([17.6868, 83.2185]);
          }
        } else {
          // No locality found
          setPosition([17.6868, 83.2185]);
        }
      } catch (error) {
        console.error(
          "Geocoding error:",
          error
        );

        // Fallback Visakhapatnam
        setPosition([
          17.6868,
          83.2185,
        ]);
      } finally {
        setLoadingLocation(false);
      }
    };

    getLocation();
  }, [lat, lon, city, locality]);

  // ==========================================
  // Loading
  // ==========================================

  if (!icon || loadingLocation) {
    return (
      <div
        className="w-full h-[500px] rounded-2xl bg-gray-100 flex items-center justify-center"
      >
        <div className="text-gray-500">
          Loading map...
        </div>
      </div>
    );
  }

  // ==========================================
  // Render Map
  // ==========================================

  return (
    <MapContainer
      center={position}
      zoom={15}
      scrollWheelZoom={true}
      style={{
        width: "100%",
        height: "500px",
        borderRadius: "16px",
      }}
    >
      <TileLayer
        url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
        subdomains={[
          "0",
          "1",
          "2",
          "3",
        ]}
        maxZoom={22}
      />

      <Marker
        position={position}
        icon={icon}
      >
        <Tooltip
          permanent
          direction="bottom"
          offset={[0, 15]}
          interactive
          opacity={1}
          className="property-tooltip"
        >
          <div
            onClick={() =>
              router.push(
                `/property/${slug}`
              )
            }
            className="cursor-pointer w-[260px] bg-white rounded-xl overflow-hidden shadow-xl"
          >
            {image && (
              <img
                src={image}
                alt={title}
                className="w-full h-32 object-cover"
              />
            )}

            <div className="p-3">
              <h3 className="font-bold text-[#003366] line-clamp-2">
                {title}
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                📍 {location ||
                  [locality, city]
                    .filter(Boolean)
                    .join(", ")}
              </p>
            </div>
          </div>
        </Tooltip>
      </Marker>
    </MapContainer>
  );
}