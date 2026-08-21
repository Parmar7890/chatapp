import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { connectLiveLocations, disconnectLiveLocations } from '../services/liveLocationService';

// Fix Leaflet's default marker icon issue with bundlers like Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function MapScreen({ currentUser, currentGeohash }) {
  const [userPositions, setUserPositions] = useState({}); // { userId: {username, latitude, longitude} }
  const [mapCenter, setMapCenter] = useState(null);

  useEffect(() => {

    if (!currentGeohash) return;

    connectLiveLocations(currentGeohash, (update) => {
        console.log('Received location update:', update);
      setUserPositions((prev) => ({
        ...prev,
        [update.userId]: update,
      }));

      // center map on first update we ever receive (usually our own)
      setMapCenter((prevCenter) =>
        prevCenter || [update.latitude, update.longitude]
      );
    });

    return () => disconnectLiveLocations();
  }, [currentGeohash]);

  if (!currentGeohash) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">
        Waiting for your location...
      </div>
    );
  }

  if (!mapCenter) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">
        Loading map...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col" style={{ width: '100vw', height: '100vh' }}>
      <div className="flex items-center justify-between py-3.5 px-5 border-b border-gray-800">
        <span className="text-sm text-gray-300">Live Map — Zone: {currentGeohash}</span>
        <Link to="/" className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-white">
          Back
        </Link>
      </div>

      <div className="flex-1">
        <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {Object.values(userPositions).map((user) => (
            <Marker key={user.userId} position={[user.latitude, user.longitude]}>
              <Popup>
                {user.userId === currentUser.id ? 'You' : user.username}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}