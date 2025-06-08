import React, { useEffect, useRef, useState } from 'react';
import { ref as dbRef, onValue } from 'firebase/database';
import { rtdb } from '../services/firebase';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const createBusIcon = () => {
  return new L.Icon({
    iconUrl: 'bus.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const BusMap = ({ busId }) => {
  const [busData, setBusData] = useState(null);
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const markerRef = useRef(null);
  const busIcon = createBusIcon();

  // Initialize map
  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    // Default center location
    const defaultPosition = [0.3296928, 32.5994707];

    mapRef.current = L.map(mapContainerRef.current).setView(defaultPosition, 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(mapRef.current);
  }, []);
  const formatRoutePath = (route) => {
          const departure = route?.departure || 'Unknown';
          const destination = route?.destination || 'Unknown';

          if (route?.type === 'dynamic' && route?.vias?.length) {
            const vias = route.vias;
            const prices = route.viaPrices || [];

            const formattedVias = vias.map((via, idx) => {
              const price = prices[idx] || 0;
              return `${via} (${price} UGX)`;
            }).join(' → ');

            return `${departure} → ${formattedVias} → ${destination}`;
          }

          return `${departure} → ${destination}`;
        };
  // Subscribe to bus data and update marker/map
  useEffect(() => {
    if (!busId) return;

    const busRef = dbRef(rtdb, `buses/${busId}`);

    const unsubscribe = onValue(busRef, (snapshot) => {
      const data = snapshot.val();

      if (data?.location?.latitude && data?.location?.longitude) {
        const newLocation = {
          lat: data.location.latitude,
          lng: data.location.longitude,
        };

        setBusData({
          id: busId,
          location: newLocation,
          routeName:formatRoutePath(data.route),
          departure: data.route?.departure || 'Unknown',
          destination: data.route?.destination || 'Unknown',
          fareAmount: data.route?.fareAmount || 'N/A',
        });
 
        // If marker doesn't exist, create it
        if (!markerRef.current) {
          markerRef.current = L.marker([newLocation.lat, newLocation.lng], { icon: busIcon })
            .addTo(mapRef.current)
            .bindPopup('Loading...'); // Temporary
        }

        // Update marker position and popup
        markerRef.current.setLatLng([newLocation.lat, newLocation.lng]);
        markerRef.current.setPopupContent(`
          <b>Bus ID:</b> ${busId}<br/>
          <b>Route Type:</b> ${data.route?.type} <br/>
          <b>Route:</b> ${formatRoutePath(data.route)}<br/>
          <b>Fare:</b> ${data.route?.fareAmount ? `${data.route.fareAmount} UGX` : 'N/A'}<br/>
          <b>From:</b> ${data.route?.departure || 'Unknown'}<br/>
          <b>To:</b> ${data.route?.destination || 'Unknown'}
        `);

        // Open popup and recenter map on bus
        markerRef.current.openPopup();
        mapRef.current.setView([newLocation.lat, newLocation.lng], mapRef.current.getZoom());
      }
    });

    return () => unsubscribe();
  }, [busId]);

  return (
    <div
      ref={mapContainerRef}
      style={{ height: '400px', width: '100%' }}
      id="bus-map"
    />
  );
};

export default BusMap;

