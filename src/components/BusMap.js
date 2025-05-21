import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { ref as dbRef, onValue } from 'firebase/database';
import { rtdb } from '../services/firebase';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Create custom bus icon
const createBusIcon = () => {
  return new L.Icon({
    iconUrl: 'bus.png', // Bus icon image
    iconSize: [32, 32], // Size of the icon
    iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location
    popupAnchor: [0, -32], // Point from which the popup should open relative to the iconAnchor
  });
};

// Alternatively, you can use a car icon:
// iconUrl: 'https://cdn-icons-png.flaticon.com/512/3079/3079026.png'

const BusMap = ({ busId }) => {
  const [busLocation, setBusLocation] = useState({ lat: 0.3296928, lng: 32.5994707 });
  const [busIcon] = useState(createBusIcon()); // Create icon once and reuse

  useEffect(() => {
    if (!busId) return;

    const locationRef = dbRef(rtdb, `buses/${busId}/location`);
    const unsubscribe = onValue(locationRef, snapshot => {
      const data = snapshot.val();
      if (data?.latitude && data?.longitude) {
        setBusLocation({ lat: data.latitude, lng: data.longitude });
      } else {
        setBusLocation({ lat: 0.3296928, lng: 32.5994707 });
      }
    });

    return () => unsubscribe();
  }, [busId]);

  return (
    <div className="map-container">
      <MapContainer
        center={[busLocation.lat, busLocation.lng]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: '400px', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[busLocation.lat, busLocation.lng]} icon={busIcon}>
          <Popup>{busId}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default BusMap;
