"use client";

import { useEffect, useRef } from "react";
import * as L from "leaflet";
import type { Office } from "@/lib/offices";

// Esri World Light Gray (raster, no WebGL/worker), keyless on any domain.
//
// Replaced CARTO Voyager on 2026-08-30: CARTO closed its keyless endpoint and
// now burns "API KEY REQUIRED" into the tile image server-side, so the stamp
// reached every environment including the review site. Verified by fetching a
// tile over plain HTTP with and without a site Referer — byte-identical, and
// already stamped, so no domain allowlist was going to fix it.
//
// Axis order is {z}/{y}/{x} here, inverted against CARTO's {z}/{x}/{y}. Swap
// them and you get a valid tile of the wrong place, never an error. No {s}
// subdomain and no {r} retina variant.
const TILE_URL =
  "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}";
const ATTRIBUTION =
  'Tiles &copy; <a href="https://www.esri.com">Esri</a>, Esri, HERE, Garmin, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, and the GIS user community';

// The service advertises levels up to 23, but its cache stops at 16: past that
// every request returns HTTP 200 carrying a grey "Map data not yet available"
// placeholder, which Leaflet cannot detect as a failure. Offices sit at zoom 16
// (lib/offices.ts), so this only guards future ones — above 16 Leaflet upscales
// the level-16 tile instead of asking for a level that would come back blank.
const MAX_NATIVE_ZOOM = 16;

/**
 * Imperative Leaflet wrapper (feature 003). Holds no app state — it reflects the
 * active `office`: a fully non-interactive map with a single brand pin that
 * `flyTo`s (or jumps under reduced motion) between offices. See
 * specs/003-interactive-locations-map/contracts/components.md.
 */
export default function LocationsMap({
  office,
  animate,
  onReady,
  onError,
  className = "",
}: {
  office: Office;
  animate: boolean;
  onReady?: () => void;
  onError?: (e: unknown) => void;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const firstRun = useRef(true);

  // Init once.
  useEffect(() => {
    if (!containerRef.current) return;
    let ro: ResizeObserver | undefined;
    try {
      const map = L.map(containerRef.current, {
        center: [office.coords.lat, office.coords.lng],
        zoom: office.zoom,
        // Lock out ALL user interaction — the carousel is the only way to navigate.
        zoomControl: false,
        dragging: false,
        touchZoom: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
      });
      L.tileLayer(TILE_URL, {
        attribution: ATTRIBUTION,
        maxNativeZoom: MAX_NATIVE_ZOOM,
        maxZoom: 20,
      }).addTo(map);

      markerRef.current = L.marker([office.coords.lat, office.coords.lng], {
        icon: pinIcon(),
        interactive: false,
        keyboard: false,
      }).addTo(map);

      mapRef.current = map;
      onReady?.();

      // The map mounts lazily into a flex container — keep Leaflet's size in sync
      // so tiles always fill the box (avoids a half-rendered / grey map).
      ro = new ResizeObserver(() => mapRef.current?.invalidateSize());
      ro.observe(containerRef.current);
    } catch (e) {
      onError?.(e);
    }
    return () => {
      ro?.disconnect();
      markerRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // Init only once; office changes are handled by the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Move to the active office whenever it changes, choreographed with the pin:
  // fade the pin out → fly the camera (zoom out, travel, zoom in) → drop the pin
  // back in with a bounce once the camera lands.
  useEffect(() => {
    const map = mapRef.current;
    const marker = markerRef.current;
    if (!map || !marker) return;
    const latlng: [number, number] = [office.coords.lat, office.coords.lng];
    const inner = () =>
      marker.getElement()?.querySelector<HTMLElement>(".pin-inner") ?? null;

    const dropIn = () => {
      const el = inner();
      if (!el) return;
      el.style.opacity = "1";
      el.classList.remove("pin-bounce");
      void el.offsetWidth; // reflow so the animation restarts each time
      el.classList.add("pin-bounce");
    };

    // First mount, or reduced motion: place instantly (no fly, no fade-out).
    if (firstRun.current || !animate) {
      firstRun.current = false;
      marker.setLatLng(latlng);
      map.setView(latlng, office.zoom, { animate: false });
      if (animate) dropIn();
      else {
        const el = inner();
        if (el) el.style.opacity = "1";
      }
      return;
    }

    // 1) fade the current pin out
    const el = inner();
    if (el) {
      el.classList.remove("pin-bounce");
      el.style.opacity = "0";
    }

    // 2) after the fade, move the (hidden) pin to the target and fly there
    let done = false;
    const onEnd = () => {
      if (done) return;
      done = true;
      dropIn(); // 3) pin lands with a bounce after the zoom-in finishes
    };
    const t = setTimeout(() => {
      marker.setLatLng(latlng);
      map.flyTo(latlng, office.zoom, { duration: 1.8 });
      map.once("moveend", onEnd);
    }, 220);

    return () => {
      clearTimeout(t);
      map.off("moveend", onEnd);
    };
  }, [office, animate]);

  return <div ref={containerRef} className={className} aria-hidden="true" />;
}

/** Custom map pin image (public/pin.png). The `.pin-inner` wrapper is what
 *  fades/bounces — Leaflet controls the outer element's position. */
function pinIcon(): L.DivIcon {
  return L.divIcon({
    className: "",
    iconSize: [112, 160],
    // Anchor slightly above the tip so the whole pin sits a little lower on the map.
    iconAnchor: [56, 146],
    // Size via inline CSS (not width/height attrs) so Tailwind Preflight's
    // `img { height:auto; max-width:100% }` can't override it and blow the pin
    // up to its natural size (which throws off Leaflet's anchor).
    html: `<div class="pin-inner"><img src="/pin.png" alt="" style="display:block;width:112px;height:160px" /></div>`,
  });
}
