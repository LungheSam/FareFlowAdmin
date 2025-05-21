import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import '../styles/BusTracking.css';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import BusMap from '../components/BusMap'; // <-- import map component

const BusTracking = () => {
  const [selectedBus, setSelectedBus] = useState('UAZ-123');
  const [transactions, setTransactions] = useState([]);
  const [busList, setBusList] = useState([]);
  const [earningsStats, setEarningsStats] = useState({ today: 0, lastWeek: 0, lastMonth: 0 });
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'buses'), snapshot => {
      const buses = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBusList(buses);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!selectedBus) {
      setTransactions([]);
      return;
    }

    const transactionsQuery = query(
      collection(db, 'transactions'),
      where('busPlateNumber', '==', selectedBus)
    );

    const unsubscribeTxns = onSnapshot(transactionsQuery, snapshot => {
      const txns = snapshot.docs.map(doc => doc.data());
      txns.sort((a, b) => b.timestamp.toDate() - a.timestamp.toDate());
      setTransactions(txns);
    });

    return () => unsubscribeTxns();
  }, [selectedBus]);

  useEffect(() => {
    if (!transactions.length) {
      setEarningsStats({ today: 0, lastWeek: 0, lastMonth: 0 });
      setWeeklyData([]);
      setMonthlyData([]);
      return;
    }

    const now = new Date();
    const todayStr = now.toDateString();
    const lastWeekDate = new Date(now);
    lastWeekDate.setDate(now.getDate() - 7);
    const lastMonthDate = new Date(now);
    lastMonthDate.setMonth(now.getMonth() - 1);

    let todayTotal = 0;
    let weekTotal = 0;
    let monthTotal = 0;

    const weekly = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      weekly[d.toISOString().split('T')[0]] = 0;
    }

    const monthly = {};

    transactions.forEach(txn => {
      const txnDate = txn.timestamp.toDate();
      const txnDateStr = txnDate.toISOString().split('T')[0];
      const monthStr = txnDate.toLocaleString('default', { month: 'short' });

      if (txnDate.toDateString() === todayStr) todayTotal += txn.amount;
      if (txnDate >= lastWeekDate) weekTotal += txn.amount;
      if (txnDate >= lastMonthDate) monthTotal += txn.amount;

      if (weekly[txnDateStr] !== undefined) weekly[txnDateStr] += txn.amount;
      monthly[monthStr] = (monthly[monthStr] || 0) + txn.amount;
    });

    setEarningsStats({
      today: todayTotal,
      lastWeek: weekTotal,
      lastMonth: monthTotal,
    });

    setWeeklyData(Object.entries(weekly).map(([date, amount]) => ({ date, amount })));
    setMonthlyData(Object.entries(monthly).map(([month, amount]) => ({ month, amount })));
  }, [transactions]);

  return (
    <section className="page bus-tracking">
      <h2>Bus Tracking</h2>

      <div className="filters">
        <label htmlFor="busSelect">Select Bus:</label>
        <select
          id="busSelect"
          value={selectedBus}
          onChange={e => setSelectedBus(e.target.value)}
        >
          <option value="">--Select Bus--</option>
          {busList.map(bus => (
            <option key={bus.id} value={bus.id}>
              {bus.name || bus.plateNumber || bus.id}
            </option>
          ))}
        </select>
      </div>

      <h3>Earnings Statistics</h3>
      <div className="earnings-stats">
        <div className="stat">
          <h4>Today</h4>
          <p>{earningsStats.today.toLocaleString()} UGX</p>
        </div>
        <div className="stat">
          <h4>Last Week</h4>
          <p>{earningsStats.lastWeek.toLocaleString()} UGX</p>
        </div>
        <div className="stat">
          <h4>Last Month</h4>
          <p>{earningsStats.lastMonth.toLocaleString()} UGX</p>
        </div>
      </div>

      <h3>Earnings Over Time</h3>
      <div className="charts">
        <div className="chart">
          <h4>Past 7 Days</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
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
      <BusMap busId={selectedBus} />
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
          {transactions.map((txn, idx) => (
            <tr key={idx}>
              <td>{txn.cardUID}</td>
              <td>{txn.passengerName}</td>
              <td>{txn.amount.toLocaleString()}</td>
              <td>{txn.timestamp.toDate().toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      
    </section>
  );
};

export default BusTracking;
