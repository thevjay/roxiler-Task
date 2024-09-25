// src/TransactionsChart.js
import React from 'react';
import { Bar } from 'react-chartjs-2';

const TransactionsChart = ({ chartData }) => {
  return (
    <div>
      <h2>Transactions Bar Chart</h2>
      <Bar data={chartData} options={{ scales: { y: { beginAtZero: true } } }} />
    </div>
  );
};

export default TransactionsChart;
