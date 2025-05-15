import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [usersCount, setUsersCount] = useState(0);
  const [busesCount, setBusesCount] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [monthlyEarningsData, setMonthlyEarningsData] = useState([]);


  // Dummy chart and table data
  const scanData = [
    { time: '6AM', scans: 100 },
    { time: '9AM', scans: 400 },
    { time: '12PM', scans: 300 },
    { time: '3PM', scans: 500 },
    { time: '6PM', scans: 700 },
    { time: '9PM', scans: 200 }
  ];

  const userStatusData = [
    { name: 'Active', value: 90 },
    { name: 'Blocked', value: 10 }
  ];

  const recentTransactions = [
    { name: 'John Doe', amount: 2500, date: '2025-05-14' },
    { name: 'Jane Smith', amount: 1800, date: '2025-05-14' },
    { name: 'Ali Musa', amount: 3000, date: '2025-05-13' },
    { name: 'Kevin Otieno', amount: 2100, date: '2025-05-13' }
  ];





  const COLORS = ['#00C49F', '#FF8042'];

  useEffect(() => {
    // Simulated totals
    setUsersCount(350);
    setBusesCount(45);
    setTotalEarnings(2540000);
    const rawMonthlyData = [
      { month: '2025-01', amount: 5000 },
      { month: '2025-02', amount: 7500 },
      { month: '2025-03', amount: 4000 },
      { month: '2025-04', amount: 11000 },
      { month: '2025-05', amount: 13700 },
      { month: '2025-06', amount: 13700 },
      { month: '2025-07', amount: 13700 },
      { month: '2025-08', amount: 13700 },
      { month: '2025-09', amount: 1300 },
      { month: '2025-10', amount: 1700 },
      { month: '2025-11', amount: 14700 },
      { month: '2025-12', amount: 13700 },
    ];

    // Convert to "Month Name" format
    const monthNames = [
      'Jan', 'Feb', 'March', 'April', 'May', 'June',
      'July', 'August', 'Sept', 'Octr', 'Nov', 'Dec'
    ];

    const formattedMonthlyData = rawMonthlyData.map(entry => {
      const [year, month] = entry.month.split('-');
      return {
        month: monthNames[parseInt(month, 10) - 1],
        amount: entry.amount
      };
    });

    setMonthlyEarningsData(formattedMonthlyData);


  }, []);

  return (
    <section className="dashboard page">
      <h2 className="dashboard-title">Dashboard Overview</h2>

      <div className="dashboard-cards">
        <motion.div className="card" whileHover={{ scale: 1.03 }}>
          <h3>Registered Users</h3>
          <p><CountUp end={usersCount} duration={1.5} separator="," /></p>
        </motion.div>

        <motion.div className="card" whileHover={{ scale: 1.03 }}>
          <h3>Buses Registered</h3>
          <p><CountUp end={busesCount} duration={1.5} separator="," /></p>
        </motion.div>
        <motion.div className="card" whileHover={{ scale: 1.03 }}>
          <h3>Registered Drivers</h3>
          <p><CountUp end={busesCount} duration={1.5} separator="," /></p>
        </motion.div>

        <motion.div className="card" whileHover={{ scale: 1.03 }}>
          <h3>Total Earnings (UGX) </h3>
          <p><CountUp end={totalEarnings} duration={2} separator="," /></p>
        </motion.div>
      </div>

      <div className="dashboard-charts">
        <div className="chart-box">
          <h3>Card Scans by Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={scanData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="scans" fill="#007bff" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h3>User Account Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={userStatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {userStatusData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-box">
          <h3>Earnings Per Month - 2025</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyEarningsData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <CartesianGrid stroke="#f0f0f0" />
              <Line type="monotone" dataKey="amount" stroke="#28a745" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="dashboard-tables">
        <div className="table-box">
          <h3>Recent Transactions</h3>
          <table>
            <thead>
              <tr>
                <th>Passenger</th>
                <th>Amount (UGX)</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((tx, i) => (
                <tr key={i}>
                  <td>{tx.name}</td>
                  <td>{tx.amount.toLocaleString()}</td>
                  <td>{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-box notes-box">
          <h3>System Notes</h3>
          <ul>
            <li>⚠️ 3 users have insufficient balance.</li>
            <li>✅ All buses are online.</li>
            <li>📶 Last sync: 3 minutes ago.</li>
            <li>🆕 Admin panel update deployed.</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
