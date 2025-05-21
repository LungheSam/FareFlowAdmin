// import React, { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
// import CountUp from 'react-countup';
// import {
//   LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
//   PieChart, Pie, Cell, BarChart, Bar
// } from 'recharts';
// import '../styles/Dashboard.css';

// const Dashboard = () => {
//   const [usersCount, setUsersCount] = useState(0);
//   const [busesCount, setBusesCount] = useState(0);
//   const [totalEarnings, setTotalEarnings] = useState(0);
//   const [monthlyEarningsData, setMonthlyEarningsData] = useState([]);


//   // Dummy chart and table data
//   const scanData = [
//     { time: '6AM', scans: 100 },
//     { time: '9AM', scans: 400 },
//     { time: '12PM', scans: 300 },
//     { time: '3PM', scans: 500 },
//     { time: '6PM', scans: 700 },
//     { time: '9PM', scans: 200 }
//   ];

//   const userStatusData = [
//     { name: 'Active', value: 90 },
//     { name: 'Blocked', value: 10 }
//   ];

//   const recentTransactions = [
//     { name: 'John Doe', amount: 2500, date: '2025-05-14' },
//     { name: 'Jane Smith', amount: 1800, date: '2025-05-14' },
//     { name: 'Ali Musa', amount: 3000, date: '2025-05-13' },
//     { name: 'Kevin Otieno', amount: 2100, date: '2025-05-13' }
//   ];





//   const COLORS = ['#00C49F', '#FF8042'];

//   useEffect(() => {
//     // Simulated totals
//     setUsersCount(350);
//     setBusesCount(45);
//     setTotalEarnings(2540000);
//     const rawMonthlyData = [
//       { month: '2025-01', amount: 5000 },
//       { month: '2025-02', amount: 7500 },
//       { month: '2025-03', amount: 4000 },
//       { month: '2025-04', amount: 11000 },
//       { month: '2025-05', amount: 13700 },
//       { month: '2025-06', amount: 13700 },
//       { month: '2025-07', amount: 13700 },
//       { month: '2025-08', amount: 13700 },
//       { month: '2025-09', amount: 1300 },
//       { month: '2025-10', amount: 1700 },
//       { month: '2025-11', amount: 14700 },
//       { month: '2025-12', amount: 13700 },
//     ];

//     // Convert to "Month Name" format
//     const monthNames = [
//       'Jan', 'Feb', 'March', 'April', 'May', 'June',
//       'July', 'August', 'Sept', 'Octr', 'Nov', 'Dec'
//     ];

//     const formattedMonthlyData = rawMonthlyData.map(entry => {
//       const [year, month] = entry.month.split('-');
//       return {
//         month: monthNames[parseInt(month, 10) - 1],
//         amount: entry.amount
//       };
//     });

//     setMonthlyEarningsData(formattedMonthlyData);


//   }, []);

//   return (
//     <section className="dashboard page">
//       <h2 className="dashboard-title">Dashboard Overview</h2>

//       <div className="dashboard-cards">
//         <motion.div className="card" whileHover={{ scale: 1.03 }}>
//           <h3>Registered Users</h3>
//           <p><CountUp end={usersCount} duration={1.5} separator="," /></p>
//         </motion.div>

//         <motion.div className="card" whileHover={{ scale: 1.03 }}>
//           <h3>Buses Registered</h3>
//           <p><CountUp end={busesCount} duration={1.5} separator="," /></p>
//         </motion.div>
//         <motion.div className="card" whileHover={{ scale: 1.03 }}>
//           <h3>Registered Drivers</h3>
//           <p><CountUp end={busesCount} duration={1.5} separator="," /></p>
//         </motion.div>

//         <motion.div className="card" whileHover={{ scale: 1.03 }}>
//           <h3>Total Earnings (UGX) </h3>
//           <p><CountUp end={totalEarnings} duration={2} separator="," /></p>
//         </motion.div>
//       </div>

//       <div className="dashboard-charts">
//         <div className="chart-box">
//           <h3>Card Scans by Time</h3>
//           <ResponsiveContainer width="100%" height={250}>
//             <BarChart data={scanData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="time" />
//               <YAxis />
//               <Tooltip />
//               <Bar dataKey="scans" fill="#007bff" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         <div className="chart-box">
//           <h3>User Account Status</h3>
//           <ResponsiveContainer width="100%" height={250}>
//             <PieChart>
//               <Pie
//                 data={userStatusData}
//                 dataKey="value"
//                 nameKey="name"
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={90}
//                 label
//               >
//                 {userStatusData.map((entry, index) => (
//                   <Cell key={index} fill={COLORS[index % COLORS.length]} />
//                 ))}
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>
//         <div className="chart-box">
//           <h3>Earnings Per Month - 2025</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={monthlyEarningsData}>
//               <XAxis dataKey="month" />
//               <YAxis />
//               <Tooltip />
//               <CartesianGrid stroke="#f0f0f0" />
//               <Line type="monotone" dataKey="amount" stroke="#28a745" />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       <div className="dashboard-tables">
//         <div className="table-box">
//           <h3>Recent Transactions</h3>
//           <table>
//             <thead>
//               <tr>
//                 <th>Passenger</th>
//                 <th>Amount (UGX)</th>
//                 <th>Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {recentTransactions.map((tx, i) => (
//                 <tr key={i}>
//                   <td>{tx.name}</td>
//                   <td>{tx.amount.toLocaleString()}</td>
//                   <td>{tx.date}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         <div className="table-box notes-box">
//           <h3>System Notes</h3>
//           <ul>
//             <li>⚠️ 3 users have insufficient balance.</li>
//             <li>✅ All buses are online.</li>
//             <li>📶 Last sync: 3 minutes ago.</li>
//             <li>🆕 Admin panel update deployed.</li>
//           </ul>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Dashboard;


import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { collection, getDocs,onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase'; // adjust this path to your actual firebase config
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [usersCount, setUsersCount] = useState(0);
  const [busesCount, setBusesCount] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [monthlyEarningsData, setMonthlyEarningsData] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [scanData, setScanData] = useState([]);
  const [inactiveUsersCount, setInactiveUsersCount] = useState(0);


  const COLORS = ['#00C49F', '#FF8042'];

useEffect(() => {
  // USERS with active/inactive counts
  const unsubscribeUsers = onSnapshot(collection(db, 'users'), snapshot => {
    let activeCount = 0;
    let inactiveCount = 0;

    snapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.blocked) {
        inactiveCount++;
      } else {
        activeCount++;
      }
    });

    setUsersCount(activeCount);
    setInactiveUsersCount(inactiveCount);  // if you want to track inactive separately
  });

  // BUSES COUNT
  const unsubscribeBuses = onSnapshot(collection(db, 'buses'), snapshot => {
    setBusesCount(snapshot.size);
  });

  // TRANSACTIONS & related data
  const unsubscribeTransactions = onSnapshot(collection(db, 'transactions'), snapshot => {
    const txns = [];
    let totalEarningsLocal = 0;
    const monthlyMap = {};

    // Gather transactions with timestamps
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      let timestamp;

      if (data.timestamp?.toDate) {
        timestamp = data.timestamp.toDate();
      } else if (typeof data.timestamp === 'string' || typeof data.timestamp === 'number') {
        timestamp = new Date(data.timestamp);
      }

      if (!timestamp || isNaN(timestamp)) return;

      const amount = data.amount || 0;
      totalEarningsLocal += amount;

      const monthKey = `${timestamp.getFullYear()}-${String(timestamp.getMonth() + 1).padStart(2, '0')}`;
      monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + amount;

      txns.push({
        passengerName: data.passengerName || 'Unknown',
        amount,
        date: timestamp.toISOString().split('T')[0],
        timestamp,
      });
    });

    // Sort transactions descending by timestamp
    const sortedTxns = txns.sort((a, b) => b.timestamp - a.timestamp);

    // Calculate time window: latest transaction timestamp minus 5 hours
    const latestTimestamp = sortedTxns.length > 0 ? sortedTxns[0].timestamp : new Date();
    const windowStart = new Date(latestTimestamp.getTime() - 5 * 60 * 60 * 1000);

    // Count scans per hour within the 5-hour window (from latest transaction time backwards)
    const hourlyCounts = {};
    sortedTxns.forEach(txn => {
      if (txn.timestamp >= windowStart && txn.timestamp <= latestTimestamp) {
        const hour = txn.timestamp.getHours();
        // Format label like "6AM", "1PM", etc.
        const label = `${hour % 12 === 0 ? 12 : hour % 12}${hour < 12 ? 'AM' : 'PM'}`;
        hourlyCounts[label] = (hourlyCounts[label] || 0) + 1;
      }
    });

    // Format scan data sorted by hour in ascending order (e.g., 4PM, 5PM, 6PM ...)
    const formattedScanData = Object.entries(hourlyCounts)
      .map(([time, scans]) => ({ time, scans }))
      .sort((a, b) => {
        // convert time like "6AM" to 24-hour number for sorting
        const to24Hour = t => {
          const hour = parseInt(t);
          if (t.includes('AM') && hour === 12) return 0;
          if (t.includes('PM') && hour !== 12) return hour + 12;
          return hour;
        };
        return to24Hour(a.time) - to24Hour(b.time);
      });

    // Set state
    setTotalEarnings(totalEarningsLocal);
    setMonthlyEarningsData(
      Object.entries(monthlyMap)
        .map(([key, amount]) => {
          const [, m] = key.split('-');
          const monthNames = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'August', 'Sept', 'Octr', 'Nov', 'Dec'];
          return {
            month: monthNames[parseInt(m, 10) - 1],
            amount,
          };
        })
        .sort((a, b) => {
          const monthNames = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'August', 'Sept', 'Octr', 'Nov', 'Dec'];
          return monthNames.indexOf(a.month) - monthNames.indexOf(b.month);
        })
    );

    setRecentTransactions(sortedTxns.slice(0, 4));
    setScanData(formattedScanData);
  });

  // Cleanup subscriptions on unmount
  return () => {
    unsubscribeUsers();
    unsubscribeBuses();
    unsubscribeTransactions();
  };
}, []);






  return (
    <section className="dashboard page">
      <h2 className="dashboard-title">Dashboard Overview</h2>

      <div className="dashboard-cards">
        <motion.div className="card" whileHover={{ scale: 1.03 }}>
          <h3>Registered Users</h3>
          <p><CountUp end={usersCount+inactiveUsersCount} duration={1.5} separator="," /></p>
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
          <h3>Total Earnings (UGX)</h3>
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
                data={[
                  { name: 'Active', value: usersCount }, // optional: split based on status
                  { name: 'Blocked', value: inactiveUsersCount }
                ]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {[
                  { name: 'Active', value: usersCount },
                  { name: 'Blocked', value: inactiveUsersCount }
                ].map((entry, index) => (
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
                  <td>{tx.passengerName}</td>
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
            <li>⚠️ Users with insufficient balance may be blocked soon.</li>
            <li>✅ All buses operational.</li>
            <li>📶 Last sync: just now.</li>
            <li>🆕 Admin panel running on latest version.</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
