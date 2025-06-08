import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import '../styles/EarningsAnalysis.css';

const EarningsAnalysis = () => {
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [averagePerMonth, setAveragePerMonth] = useState(0);
  const [averagePerWeek, setAveragePerWeek] = useState(0);
  const [monthlyData, setMonthlyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Earnings data from 'buses' collection
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'buses'), snapshot => {
      let total = 0;
      let allMonthly = {};
      let allWeekly = {};

      snapshot.forEach(doc => {
        const bus = doc.data();

        if (bus.totalEarnings) total += bus.totalEarnings;

        if (Array.isArray(bus.monthlyEarnings)) {
          bus.monthlyEarnings.forEach(entry => {
            allMonthly[entry.month] = (allMonthly[entry.month] || 0) + entry.amount;
          });
        }

        if (Array.isArray(bus.weeklyEarnings)) {
          bus.weeklyEarnings.forEach(entry => {
            allWeekly[entry.day] = (allWeekly[entry.day] || 0) + entry.amount;
          });
        }
      });

      const monthlyChartData = Object.entries(allMonthly).map(([month, amount]) => ({
        month,
        amount,
      }));

      const weeklyChartData = Object.entries(allWeekly).map(([day, amount]) => ({
        day,
        amount,
      }));

      setTotalEarnings(total);
      setAveragePerMonth(total / 12);
      setAveragePerWeek(total / 52);
      setMonthlyData(monthlyChartData);
      setWeeklyData(weeklyChartData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Recent transactions from top-level 'transactions' collection
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'transactions'), snapshot => {
      const txns = snapshot.docs
        .map(doc => doc.data())
        .map(txn => {
          let timestamp;

          if (txn.timestamp?.toDate) {
            timestamp = txn.timestamp.toDate();
          } else if (typeof txn.timestamp === 'string' || typeof txn.timestamp === 'number') {
            timestamp = new Date(txn.timestamp);
          }

          return {
            ...txn,
            timestamp,
          };
        })
        .filter(txn => txn.timestamp && !isNaN(txn.timestamp))
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 7); // Limit to 7 most recent

      setRecentTransactions(txns);
    });

    return () => unsubscribe();
  }, []);

  return (
    <section className="page earnings-analysis">
      <h2>Earnings Analysis</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="earnings-stats">
            <div className="stat">
              <h4>Total Earnings</h4>
              <p>{totalEarnings.toLocaleString()} UGX</p>
            </div>
            <div className="stat">
              <h4>Average per Month</h4>
              <p>{averagePerMonth.toLocaleString()} UGX</p>
            </div>
            <div className="stat">
              <h4>Average per Week</h4>
              <p>{averagePerWeek.toLocaleString()} UGX</p>
            </div>
          </div>

          <h3>Earnings Over Time</h3>
          <div className="charts">
            <div className="chart">
              <h4>Past 7 Days</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="amount" fill="#3498db" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="chart">
              <h4>Monthly Earnings</h4>
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

          <h3>Recent Transactions</h3>
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Card UID</th>
                <th>Passenger Name</th>
                <th>Amount (UGX)</th>
                <th>Timestamp</th>
                <th>Bus Plate Number</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((txn, index) => (
                <tr key={index}>
                  <td>{txn.cardUID || 'N/A'}</td>
                  <td>{txn.passengerName || 'N/A'}</td>
                  <td>{txn.amount?.toLocaleString() || 0}</td>
                  <td>{new Date(txn.timestamp).toLocaleString()}</td>
                  <td>{txn.busPlateNumber || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </section>
  );
};

export default EarningsAnalysis;

