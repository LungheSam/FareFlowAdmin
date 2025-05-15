import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LineChart, Line } from 'recharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/BusTracking.css';

const BusTracking = () => {
  const [selectedBus, setSelectedBus] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [busList, setBusList] = useState([]);
  const [busLocation, setBusLocation] = useState({ lat: 0, lng: 0 });
  const [dateFilter, setDateFilter] = useState('today');
  const [earningsStats, setEarningsStats] = useState({
    today: 50000,
    lastWeek: 300000,
    lastMonth: 1200000,
  });
  const [weeklyData, setWeeklyData] = useState([
    { date: '2025-05-07', amount: 20000 },
    { date: '2025-05-08', amount: 25000 },
    { date: '2025-05-09', amount: 18000 },
    { date: '2025-05-10', amount: 30000 },
    { date: '2025-05-11', amount: 15000 },
    { date: '2025-05-12', amount: 22000 },
    { date: '2025-05-13', amount: 24000 },
  ]);
  const [monthlyData, setMonthlyData] = useState([
    { month: 'Jan', amount: 100000 },
    { month: 'Feb', amount: 120000 },
    { month: 'Mar', amount: 150000 },
    { month: 'Apr', amount: 130000 },
    { month: 'May', amount: 140000 },
  ]);

  useEffect(() => {
    // Dummy bus data
    setBusList([
      { id: 'bus1', name: 'Bus 1' },
      { id: 'bus2', name: 'Bus 2' },
      { id: 'bus3', name: 'Bus 3' },
    ]);

    // Dummy bus location (latitude and longitude for a city center)
    setBusLocation({ lat: 0.3476, lng: 32.5825 });
    
    // Dummy transactions (mock data for table)
    setTransactions([
      { cardUID: '1234', passengerName: 'John Doe', amount: 5000, timestamp: '2025-05-12T10:30:00Z' },
      { cardUID: '5678', passengerName: 'Jane Smith', amount: 3000, timestamp: '2025-05-12T11:00:00Z' },
      { cardUID: '9101', passengerName: 'Samuel N.', amount: 4500, timestamp: '2025-05-12T12:15:00Z' },
    ]);
  }, []);

  const handleBusChange = (e) => {
    setSelectedBus(e.target.value);
  };

  const handleDateFilterChange = (e) => {
    setDateFilter(e.target.value);
  };

  return (
    <section className="page bus-tracking">
      <h2>Bus Tracking</h2>

      <div className="filters">
        <label htmlFor="busSelect">Select Bus:</label>
        <select id="busSelect" value={selectedBus} onChange={handleBusChange}>
          <option value="">--Select Bus--</option>
          {busList.map((bus) => (
            <option key={bus.id} value={bus.id}>
              {bus.name}
            </option>
          ))}
        </select>

        <label htmlFor="dateFilter">Date:</label>
        <select id="dateFilter" value={dateFilter} onChange={handleDateFilterChange}>
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="last7days">Last 7 Days</option>
          <option value="last30days">Last 30 Days</option>
        </select>
      </div>

      <h3>Transactions</h3>
      <table className="transactions-table">
        <thead>
          <tr>
            <th>Card UID</th>
            <th>Passenger Name</th>
            <th>Amount (UGX)</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn, index) => (
            <tr key={index}>
              <td>{txn.cardUID}</td>
              <td>{txn.passengerName}</td>
              <td>{txn.amount}</td>
              <td>{new Date(txn.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Earnings Statistics</h3>
      <div className="earnings-stats">
        <div className="stat">
          <h4>Today</h4>
          <p>{earningsStats.today} UGX</p>
        </div>
        <div className="stat">
          <h4>Last Week</h4>
          <p>{earningsStats.lastWeek} UGX</p>
        </div>
        <div className="stat">
          <h4>Last Month</h4>
          <p>{earningsStats.lastMonth} UGX</p>
        </div>
      </div>

      <h3>Earnings Over Time</h3>
      <div className="charts">
        <div className="chart">
          <h4>Past 7 Days</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={weeklyData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#3498db" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart">
          <h4>Last 12 Months</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="amount" stroke="#9b59b6" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <h3>Current Bus Location</h3>
      <div className="map-container">
        <MapContainer center={[busLocation.lat, busLocation.lng]} zoom={13} style={{ height: '400px', width: '100%' }}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[busLocation.lat, busLocation.lng]}>
            <Popup>Bus Current Location</Popup>
          </Marker>
        </MapContainer>
      </div>
    </section>
  );
};

export default BusTracking;
