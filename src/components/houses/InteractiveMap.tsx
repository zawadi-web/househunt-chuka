"use client";

import React, { useEffect, useRef, useState } from 'react';
import { House } from '@/lib/types';
import { Navigation, Loader2, MapPin, AlertCircle, ShieldCheck, ExternalLink, X, Locate } from 'lucide-react';

interface InteractiveMapProps {
  houses: House[];
  onSelectHouse?: (house: House) => void;
}

// Chuka University Main Campus exact GPS coordinates (Mariani, Tharaka Nithi)
const CHUKA_UNI = { lat: -0.3402, lng: 37.6495 };

export default function InteractiveMap({ houses, onSelectHouse }: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const userMarkerRef = useRef<any>(null);
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [distanceToUni, setDistanceToUni] = useState<number | null>(null);

  // Calculate distance between two lat/lng points (km)
  const calcDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;

    // Dynamically import Leaflet (client-side only)
    import('leaflet').then((L) => {
      // Fix default marker icon paths (Next.js issue)
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      // Initialize Leaflet map centered on Chuka University
      const map = L.map(mapRef.current!, {
        center: [CHUKA_UNI.lat, CHUKA_UNI.lng],
        zoom: 15,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      // OpenStreetMap tile layer (free, no API key!)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Chuka University main campus marker
      const uniIcon = L.divIcon({
        className: '',
        html: `
          <div style="
            background: linear-gradient(135deg, #10b981, #0ea5e9);
            color: white;
            font-weight: 900;
            font-size: 10px;
            text-align: center;
            border-radius: 50%;
            width: 52px;
            height: 52px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border: 3px solid white;
            box-shadow: 0 4px 15px rgba(16,185,129,0.5);
            line-height: 1.1;
          ">
            <div>🎓</div>
            <div style="font-size:8px">CHUKA UNI</div>
          </div>
        `,
        iconSize: [52, 52],
        iconAnchor: [26, 26],
      });

      L.marker([CHUKA_UNI.lat, CHUKA_UNI.lng], { icon: uniIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: system-ui; min-width: 200px;">
            <div style="font-weight: 900; font-size: 14px; color: #0f172a; margin-bottom: 4px;">🎓 Chuka University</div>
            <div style="font-size: 12px; color: #64748b;">Main Campus — Mariani, Tharaka Nithi</div>
            <div style="font-size: 11px; color: #10b981; margin-top: 6px; font-weight: 700;">Reference point for all distances</div>
          </div>
        `);

      leafletMap.current = map;

      // Add house markers
      addHouseMarkers(L, map, houses);
    });

    // Cleanup
    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, []);

  // Re-render house markers when houses list changes
  useEffect(() => {
    if (!leafletMap.current) return;
    import('leaflet').then((L) => {
      // Clear existing house markers
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];
      addHouseMarkers(L, leafletMap.current, houses);
    });
  }, [houses]);

  const addHouseMarkers = (L: any, map: any, houseList: House[]) => {
    houseList.forEach((house) => {
      if (!house.latitude || !house.longitude) return;

      const houseIcon = L.divIcon({
        className: '',
        html: `
          <div style="
            background: white;
            color: #0f172a;
            font-weight: 800;
            font-size: 11px;
            padding: 5px 10px;
            border-radius: 20px;
            border: 2px solid #10b981;
            box-shadow: 0 3px 10px rgba(0,0,0,0.2);
            white-space: nowrap;
            cursor: pointer;
          ">
            📍 KSh ${house.rentPerMonth.toLocaleString()}
          </div>
        `,
        iconAnchor: [30, 15],
      });

      const marker = L.marker([house.latitude, house.longitude], { icon: houseIcon })
        .addTo(map)
        .on('click', () => {
          setSelectedHouse(house);
          if (onSelectHouse) onSelectHouse(house);
        });

      markersRef.current.push(marker);
    });
  };

  const handleShareLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Your browser does not support geolocation.');
      return;
    }

    setLocating(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setLocating(false);

        // Calculate distance to Chuka University
        const dist = calcDistance(latitude, longitude, CHUKA_UNI.lat, CHUKA_UNI.lng);
        setDistanceToUni(Math.round(dist * 10) / 10);

        import('leaflet').then((L) => {
          if (!leafletMap.current) return;

          // Remove old user marker
          if (userMarkerRef.current) userMarkerRef.current.remove();

          const userIcon = L.divIcon({
            className: '',
            html: `
              <div style="
                background: #3b82f6;
                color: white;
                font-size: 11px;
                font-weight: 800;
                padding: 6px 12px;
                border-radius: 20px;
                border: 3px solid white;
                box-shadow: 0 0 0 4px rgba(59,130,246,0.35), 0 4px 12px rgba(0,0,0,0.3);
                white-space: nowrap;
              ">
                📍 You are here
              </div>
            `,
            iconAnchor: [45, 15],
          });

          userMarkerRef.current = L.marker([latitude, longitude], { icon: userIcon })
            .addTo(leafletMap.current)
            .bindPopup(`
              <div style="font-family: system-ui; min-width: 180px;">
                <div style="font-weight: 900; font-size: 13px; color: #0f172a; margin-bottom: 4px;">📍 Your Location</div>
                <div style="font-size: 11px; color: #64748b;">Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}</div>
                <div style="font-size: 12px; color: #3b82f6; margin-top: 6px; font-weight: 700;">
                  ${dist.toFixed(1)} km from Chuka University
                </div>
              </div>
            `)
            .openPopup();

          // Draw a line from user to Chuka University
          L.polyline(
            [[latitude, longitude], [CHUKA_UNI.lat, CHUKA_UNI.lng]],
            { color: '#3b82f6', weight: 2, dashArray: '6 6', opacity: 0.7 }
          ).addTo(leafletMap.current);

          // Pan map to fit both points
          leafletMap.current.fitBounds(
            [[latitude, longitude], [CHUKA_UNI.lat, CHUKA_UNI.lng]],
            { padding: [60, 60] }
          );
        });
      },
      (error) => {
        setLocating(false);
        setLocationError(
          error.code === 1
            ? 'Location permission denied. Please allow location access in your browser.'
            : 'Could not get your location. Please try again.'
        );
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="space-y-3">
      {/* Map Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-sm">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-slate-900">Live Map — Chuka University Area</h4>
            <p className="text-[11px] text-slate-500">Real OpenStreetMap • {houses.length} listings shown</p>
          </div>
        </div>

        {/* Share My Location Button */}
        <button
          onClick={handleShareLocation}
          disabled={locating}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl transition-all shadow-md disabled:opacity-60 shrink-0"
        >
          {locating ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Locating you...</>
          ) : (
            <><Locate className="w-4 h-4" /> Share My Location</>
          )}
        </button>
      </div>

      {/* User distance info */}
      {userLocation && distanceToUni !== null && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl px-4 py-3 text-xs font-semibold text-blue-800 flex items-center gap-2">
          <Navigation className="w-4 h-4 text-blue-600 shrink-0" />
          You are <strong>{distanceToUni} km</strong> from Chuka University Main Campus.
          {distanceToUni <= 1 ? ' 🏫 You\'re very close to campus!' : distanceToUni <= 3 ? ' 🚶 Walking distance.' : ' 🚕 You\'ll need transport.'}
        </div>
      )}

      {/* Location Error */}
      {locationError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {locationError}
        </div>
      )}

      {/* Real Leaflet Map */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl" style={{ height: '520px' }}>
        {/* Leaflet CSS */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          crossOrigin=""
        />
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

        {/* Selected House Preview Card */}
        {selectedHouse && (
          <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-[1000] bg-white rounded-2xl p-4 shadow-2xl border border-slate-200">
            <button
              onClick={() => setSelectedHouse(null)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex gap-3">
              {selectedHouse.images?.[0]?.url ? (
                <img src={selectedHouse.images[0].url} alt={selectedHouse.title} className="w-20 h-20 rounded-xl object-cover shrink-0" />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-slate-400" />
                </div>
              )}
              <div className="flex-1 min-w-0 pr-5">
                <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-bold">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{selectedHouse.landlord?.name || 'Verified Landlord'}</span>
                </div>
                <h5 className="font-bold text-slate-900 text-sm line-clamp-1 mt-0.5">{selectedHouse.title}</h5>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                  {selectedHouse.areaName} • {selectedHouse.distanceFromCampus}km from campus
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-sm">
                    KSh {selectedHouse.rentPerMonth.toLocaleString()}
                    <span className="text-xs font-normal text-slate-400">/mo</span>
                  </span>
                  <a
                    href={`/houses/${selectedHouse.id}`}
                    className="text-xs font-bold text-white bg-brand-primary hover:bg-brand-blue px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all"
                  >
                    View <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
