"use client";

import { useEffect } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import type { MapLocation, OfficeLocation } from "./map-client";
import { categoryMeta } from "./map-client";

function markerIcon(color: string, symbol: string, large = false) {
  return L.divIcon({
    className: "leaflet-category-marker",
    html: `<span style="background:${color};width:${large ? 48 : 36}px;height:${large ? 48 : 36}px;font-size:${large ? 22 : 16}px">${symbol}</span>`,
    iconSize: [large ? 48 : 36, large ? 48 : 36],
    iconAnchor: [large ? 24 : 18, large ? 24 : 18],
    popupAnchor: [0, large ? -22 : -18],
  });
}

function FocusController({ focusedId, locations, office }: { focusedId: string | null; locations: MapLocation[]; office: OfficeLocation | null }) {
  const map = useMap();
  useEffect(() => {
    const target = focusedId === "office" ? office : locations.find((location) => location.id === focusedId);
    if (target) map.flyTo([target.lat, target.lng], Math.max(map.getZoom(), 16), { duration: 0.7 });
  }, [focusedId, locations, office, map]);
  return null;
}

function popupContent(location: MapLocation | OfficeLocation, category?: string) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`;
  return (
    <div className="min-w-[190px] text-slate-950">
      <strong className="block text-base">{location.nama}</strong>
      {category && <span className="mt-1 block text-xs font-bold uppercase text-slate-600">{category}</span>}
      {location.alamat && <p className="mt-2 text-sm">{location.alamat}</p>}
      {location.telepon && <a className="mt-2 block text-sm font-semibold text-blue-700" href={`tel:${location.telepon}`}>{location.telepon}</a>}
      {"jam_operasional" in location && location.jam_operasional && <p className="mt-2 text-sm">{location.jam_operasional}</p>}
      <a className="mt-3 inline-block rounded-full bg-blue-700 px-3 py-2 text-xs font-bold text-white" href={mapsUrl} target="_blank" rel="noreferrer">Buka di Google Maps</a>
    </div>
  );
}

export default function LeafletMap({
  locations,
  office,
  center,
  focusedId,
  onFocus,
}: {
  locations: MapLocation[];
  office: OfficeLocation | null;
  center: number[];
  focusedId: string | null;
  onFocus: (id: string) => void;
}) {
  return (
    <MapContainer center={center as [number, number]} zoom={14} scrollWheelZoom={false} touchZoom zoomControl className="h-full w-full">
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FocusController focusedId={focusedId} locations={locations} office={office} />
      {office && (
        <Marker position={[office.lat, office.lng]} icon={markerIcon("#047857", "⌂", true)} eventHandlers={{ click: () => onFocus("office") }}>
          <Popup>{popupContent(office, "Kantor kelurahan")}</Popup>
        </Marker>
      )}
      {locations.map((location) => {
        const [label, , color] = categoryMeta[location.kategori];
        return (
          <Marker key={location.id} position={[location.lat, location.lng]} icon={markerIcon(color, "●")} eventHandlers={{ click: () => onFocus(location.id) }}>
            <Popup>{popupContent(location, label)}</Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
