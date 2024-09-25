// src/App.js
import React, { useEffect, useState } from 'react';
import Filters from './Filter';
import TransactionsTable from './TransactionsTable';
import Statistics from './Statistics';
import TransactionsChart from './TransactionsChart';
import './App.css';

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState({});
  const [month, setMonth] = useState('03');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchTransactions = async (month, search = '', page = 1) => {
    const response = await fetch(`/api/transactions?month=${month}&search=${search}&page=${page}`);
    const data = await response.json();
    setTransactions(data.transactions);
    setStats(data.stats);
    setChartData(data.chartData);
  };

  useEffect(() => {
    fetchTransactions(month, searchTerm, currentPage);
  }, [month, searchTerm, currentPage]);

  return (
    <div className="container">
      <h1>Transactions Dashboard</h1>
      <Filters month={month} setMonth={setMonth} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <TransactionsTable transactions={transactions} currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <Statistics stats={stats} />
      <TransactionsChart chartData={chartData} />
    </div>
  );
};

export default App;
