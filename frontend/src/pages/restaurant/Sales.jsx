import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import './Sales.css';

const Sales = () => {
  const { axiosInstance } = useAuth();
  const [salesData, setSalesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  const periods = [
    { key: 'today', label: 'Today' },
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
    { key: 'all', label: 'All Time' },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c'];

  const fetchSalesData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response = await axiosInstance.get(`/sales/restaurant?period=${selectedPeriod}`);
      setSalesData(response.data.data);
    } catch (err) {
      console.error('Failed to fetch sales data:', err);
      setError('Failed to load sales data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [axiosInstance, selectedPeriod]);

  useEffect(() => {
    fetchSalesData();
  }, [fetchSalesData]);

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (selectedPeriod === 'today') {
      // Format hour
      return date.getHours() + ':00';
    } else if (selectedPeriod === 'all') {
      // Format month
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } else {
      // Format date
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const exportToCSV = () => {
    if (!salesData) return;

    const { summary, topProducts, salesByCategory, salesBreakdown } = salesData;

    // Create CSV content
    let csv = 'Near Expiry Sales Report\n';
    csv += `Period: ${selectedPeriod}\n`;
    csv += `Generated: ${new Date().toLocaleString()}\n\n`;

    // Summary
    csv += 'Summary\n';
    csv += `Total Sales,${summary.totalSales}\n`;
    csv += `Total Commission,${summary.totalCommission}\n`;
    csv += `Net Revenue,${summary.netRevenue}\n`;
    csv += `Total Orders,${summary.totalOrders}\n`;
    csv += `Items Sold,${summary.totalItemsSold}\n`;
    csv += `Average Order Value,${summary.averageOrderValue}\n\n`;

    // Top Products
    csv += 'Top Products\n';
    csv += 'Product Name,Quantity Sold,Revenue\n';
    topProducts.forEach(product => {
      csv += `"${product.name}",${product.quantitySold},${product.revenue}\n`;
    });
    csv += '\n';

    // Sales by Category
    csv += 'Sales by Category\n';
    csv += 'Category,Orders,Items Sold,Revenue\n';
    salesByCategory.forEach(cat => {
      csv += `"${cat.categoryName}",${cat.orderCount},${cat.itemsSold},${cat.revenue}\n`;
    });
    csv += '\n';

    // Sales Breakdown
    csv += 'Sales Breakdown\n';
    csv += 'Period,Orders,Sales,Commission\n';
    salesBreakdown.forEach(item => {
      const periodLabel = formatDate(item.period);
      csv += `"${periodLabel}",${item.orderCount},${item.sales},${item.commission}\n`;
    });

    // Create download link
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-report-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="sales-container">
        <div className="loading">Loading sales data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sales-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!salesData) {
    return (
      <div className="sales-container">
        <div className="error">No sales data available</div>
      </div>
    );
  }

  const { summary, comparison, topProducts, salesByCategory, salesBreakdown, orderTypeBreakdown } = salesData;

  return (
    <div className="sales-container">
      <div className="sales-header">
        <h1>Sales Analytics</h1>
        <button onClick={exportToCSV} className="export-btn">
          📊 Export to CSV
        </button>
      </div>

      {/* Period Selector */}
      <div className="period-selector">
        {periods.map(period => (
          <button
            key={period.key}
            className={`period-btn ${selectedPeriod === period.key ? 'active' : ''}`}
            onClick={() => handlePeriodChange(period.key)}
          >
            {period.label}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <h3>Total Revenue</h3>
            <p className="card-value">{formatCurrency(summary.totalSales)}</p>
            {comparison && (
              <span className={`trend ${comparison.trend}`}>
                {comparison.trend === 'up' ? '↑' : '↓'} {Math.abs(comparison.percentageChange)}%
              </span>
            )}
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">💸</div>
          <div className="card-content">
            <h3>Commission Paid</h3>
            <p className="card-value">{formatCurrency(summary.totalCommission)}</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">💵</div>
          <div className="card-content">
            <h3>Net Revenue</h3>
            <p className="card-value net-revenue">{formatCurrency(summary.netRevenue)}</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">📦</div>
          <div className="card-content">
            <h3>Total Orders</h3>
            <p className="card-value">{summary.totalOrders}</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">🛒</div>
          <div className="card-content">
            <h3>Items Sold</h3>
            <p className="card-value">{summary.totalItemsSold}</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">📊</div>
          <div className="card-content">
            <h3>Avg Order Value</h3>
            <p className="card-value">{formatCurrency(summary.averageOrderValue)}</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Sales Trend Chart */}
        <div className="chart-card full-width">
          <h2>Sales Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesBreakdown.map(item => ({
              ...item,
              period: formatDate(item.period)
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#0088FE" strokeWidth={2} name="Sales" />
              <Line type="monotone" dataKey="commission" stroke="#FF8042" strokeWidth={2} name="Commission" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="chart-card">
          <h2>Top Products</h2>
          {topProducts.length > 0 ? (
            <div className="products-list">
              {topProducts.slice(0, 5).map((product, index) => (
                <div key={product.id} className="product-item">
                  <div className="product-rank">#{index + 1}</div>
                  <div className="product-info">
                    <div className="product-name">{product.name}</div>
                    <div className="product-stats">
                      <span>{product.quantitySold} sold</span>
                      <span className="revenue">{formatCurrency(product.revenue)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data">No sales data available</div>
          )}
        </div>

        {/* Sales by Category */}
        <div className="chart-card">
          <h2>Sales by Category</h2>
          {salesByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={salesByCategory}
                  dataKey="revenue"
                  nameKey="categoryName"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.categoryName}: ${formatCurrency(entry.revenue)}`}
                >
                  {salesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="no-data">No category data available</div>
          )}
        </div>

        {/* Order Type Breakdown */}
        {orderTypeBreakdown.length > 0 && (
          <div className="chart-card">
            <h2>Order Type Breakdown</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={orderTypeBreakdown}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="orderType" />
                <YAxis />
                <Tooltip formatter={(value, name) => {
                  if (name === 'revenue') return formatCurrency(value);
                  return value;
                }} />
                <Legend />
                <Bar dataKey="orderCount" fill="#0088FE" name="Orders" />
                <Bar dataKey="revenue" fill="#00C49F" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Category Revenue Bar Chart */}
        {salesByCategory.length > 0 && (
          <div className="chart-card full-width">
            <h2>Revenue by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesByCategory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="categoryName" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="revenue" fill="#0088FE" name="Revenue" />
                <Bar dataKey="itemsSold" fill="#00C49F" name="Items Sold" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sales;
