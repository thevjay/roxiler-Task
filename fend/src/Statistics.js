// src/Statistics.js
import React from 'react';

const Statistics = ({ stats }) => {
  return (
    <div id="stats">
      <h2>Transaction Statistics</h2>
      <p>Total Amount of Sale: <span>{stats.totalSales}</span></p>
      <p>Total Sold Items: <span>{stats.totalSold}</span></p>
      <p>Total Not Sold Items: <span>{stats.totalNotSold}</span></p>
    </div>
  );
};

export default Statistics;
