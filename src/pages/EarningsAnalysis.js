// import React, { useState, useEffect } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { LineChart, Line } from 'recharts';
// import '../styles/EarningsAnalysis.css';

// const EarningsAnalysis = () => {
//   const [totalExpenses, setTotalExpenses] = useState(0);
//   const [avgExpensesPerMonth, setAvgExpensesPerMonth] = useState(0);
//   const [avgExpensesPerWeek, setAvgExpensesPerWeek] = useState(0);
//   const [monthlyData, setMonthlyData] = useState([]);
//   const [weeklyData, setWeeklyData] = useState([]);
//   const [recentTransactions, setRecentTransactions] = useState([]);

//   // Dummy data for now
//   useEffect(() => {
//     setTotalExpenses(1000000); // Total Expenses (UGX)
//     setAvgExpensesPerMonth(85000); // Avg Expenses per Month (UGX)
//     setAvgExpensesPerWeek(20000); // Avg Expenses per Week (UGX)

//     // Dummy data for charts
//     setMonthlyData([
//       { month: 'Jan', amount: 80000 },
//       { month: 'Feb', amount: 90000 },
//       { month: 'Mar', amount: 85000 },
//       { month: 'Apr', amount: 95000 },
//       { month: 'May', amount: 100000 },
//     ]);

//     setWeeklyData([
//       { day: 'Mon', amount: 15000 },
//       { day: 'Tue', amount: 20000 },
//       { day: 'Wed', amount: 18000 },
//       { day: 'Thu', amount: 25000 },
//       { day: 'Fri', amount: 30000 },
//       { day: 'Sat', amount: 22000 },
//       { day: 'Sun', amount: 25000 },
//     ]);

//     // Dummy transactions data
//     setRecentTransactions([
//       { cardUID: '123456', name: 'John Doe', amount: 5000, timestamp: '2025-05-12T10:30:00', busPlate: 'XYZ 1234' },
//       { cardUID: '654321', name: 'Jane Smith', amount: 7000, timestamp: '2025-05-12T11:00:00', busPlate: 'XYZ 1234' },
//       { cardUID: '789123', name: 'Samuel Green', amount: 6000, timestamp: '2025-05-13T14:00:00', busPlate: 'ABC 5678' },
//     ]);
//   }, []);

//   return (
//     <section className="page expenses-analysis">
//       <h2>Earnings Analysis</h2>
//       <div className="cards">
//         <div className="card">
//           <h4>Total Earnings</h4>
//           <p>{totalExpenses} UGX</p>
//         </div>
//         <div className="card">
//           <h4>Average Earnings Per Month</h4>
//           <p>{avgExpensesPerMonth} UGX</p>
//         </div>
//         <div className="card">
//           <h4>Average Earnings Per Week</h4>
//           <p>{avgExpensesPerWeek} UGX</p>
//         </div>
//       </div>

//       <h3>Earnings Over Time</h3>
//       <div className="charts">
//         <div className="chart">
//           <h4>Last 7 Days Expenses</h4>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart
//               data={weeklyData}
//               margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//             >
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="day" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="amount" fill="#3498db" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Line Chart for Monthly Expenses */}
//         <div className="chart">
//           <h4>Last 12 Months Expenses</h4>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={monthlyData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="month" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Line type="monotone" dataKey="amount" stroke="#9b59b6" />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       <h3>Recent Transactions</h3>
//       <table className="transactions-table">
//         <thead>
//           <tr>
//             <th>Card UID</th>
//             <th>Passenger Name</th>
//             <th>Amount (UGX)</th>
//             <th>Timestamp</th>
//             <th>Bus Plate Number</th>
//           </tr>
//         </thead>
//         <tbody>
//           {recentTransactions.map((txn, index) => (
//             <tr key={index}>
//               <td>{txn.cardUID}</td>
//               <td>{txn.name}</td>
//               <td>{txn.amount}</td>
//               <td>{new Date(txn.timestamp).toLocaleString()}</td>
//               <td>{txn.busPlate}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </section>
//   );
// };

// export default EarningsAnalysis;

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

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'buses'), snapshot => {
      let total = 0;
      let allMonthly = {};
      let allWeekly = {};
      let allTransactions = [];

      snapshot.forEach(doc => {
        const bus = doc.data();

        if (bus.totalEarnings) total += bus.totalEarnings;

        if (Array.isArray(bus.monthlyEarnings)) {
          bus.monthlyEarnings.forEach(entry => {
            if (allMonthly[entry.month]) {
              allMonthly[entry.month] += entry.amount;
            } else {
              allMonthly[entry.month] = entry.amount;
            }
          });
        }

        if (Array.isArray(bus.weeklyEarnings)) {
          bus.weeklyEarnings.forEach(entry => {
            if (allWeekly[entry.day]) {
              allWeekly[entry.day] += entry.amount;
            } else {
              allWeekly[entry.day] = entry.amount;
            }
          });
        }

        if (Array.isArray(bus.transactions)) {
          const plate = bus.plateNumber || 'N/A';
          const formattedTxns = bus.transactions.map(txn => ({
            ...txn,
            busPlateNumber: plate,
          }));
          allTransactions.push(...formattedTxns);
        }
      });

      // Convert data to chart format
      const monthlyChartData = Object.entries(allMonthly).map(([month, amount]) => ({
        month,
        amount,
      }));

      const weeklyChartData = Object.entries(allWeekly).map(([day, amount]) => ({
        day,
        amount,
      }));

      allTransactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      setTotalEarnings(total);
      setAveragePerMonth(total / 12);
      setAveragePerWeek(total / 52);
      setMonthlyData(monthlyChartData);
      setWeeklyData(weeklyChartData);
      setRecentTransactions(allTransactions.slice(0, 7));
      setLoading(false);
    });

    // Cleanup the listener on component unmount
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
                  <td>{txn.cardUID}</td>
                  <td>{txn.passengerName}</td>
                  <td>{txn.amount.toLocaleString()}</td>
                  <td>{new Date(txn.timestamp).toLocaleString()}</td>
                  <td>{txn.busPlateNumber}</td>
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
