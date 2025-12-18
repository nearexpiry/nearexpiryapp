import React, { useState, useEffect } from 'react';
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
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import './Analytics.css';

const Analytics = () => {
  const { axiosInstance } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('all');
  const [restaurantId, setRestaurantId] = useState('');
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    loadRestaurants();
  }, []);

  useEffect(() => {
    loadAnalytics();
  }, [period, restaurantId]);

  const loadRestaurants = async () => {
    try {
      const response = await axiosInstance.get('/admin/restaurants');
      setRestaurants(response.data.data.restaurants || []);
    } catch (err) {
      console.error('Failed to load restaurants:', err);
    }
  };

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const params = { period };
      if (restaurantId) params.restaurantId = restaurantId;

      const response = await axiosInstance.get('/admin/analytics', { params });
      setAnalytics(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Failed to load analytics:', err);
      setError('Failed to load analytics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = (data, filename) => {
    const csvContent = convertToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const convertToCSV = (data) => {
    if (!data || data.length === 0) return '';
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map((row) =>
      Object.values(row)
        .map((val) => (typeof val === 'string' ? `"${val}"` : val))
        .join(',')
    );
    return [headers, ...rows].join('\n');
  };

  const handleExportTopProducts = () => {
    if (analytics?.topProducts) {
      exportToCSV(analytics.topProducts, 'top_products.csv');
    }
  };

  const handleExportTopRestaurants = () => {
    if (analytics?.topRestaurants) {
      exportToCSV(analytics.topRestaurants, 'top_restaurants.csv');
    }
  };

  const handleExportMonthlyTrend = () => {
    if (analytics?.monthlyTrend) {
      const formattedData = analytics.monthlyTrend.map((item) => ({
        month: new Date(item.month).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
        }),
        revenue: item.revenue,
        commission: item.commission,
        orders: item.orders,
      }));
      exportToCSV(formattedData, 'monthly_trend.csv');
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={loadAnalytics} className="btn btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Prepare data for charts
  const orderStatusData = analytics?.ordersByStatus
    ? Object.entries(analytics.ordersByStatus).map(([status, data]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: data.count,
        revenue: data.revenue,
      }))
    : [];

  const COLORS = ['#8b5cf6', '#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  const monthlyTrendData = analytics?.monthlyTrend?.map((item) => ({
    month: new Date(item.month).toLocaleDateString('en-US', {
      month: 'short',
      year: '2-digit',
    }),
    revenue: item.revenue,
    commission: item.commission,
    netRevenue: item.revenue - item.commission,
  })) || [];

  const categoryData = analytics?.revenueByCategory?.slice(0, 10) || [];

  return (
    <div className="admin-page analytics-page">
      <div className="page-header">
        <h1>Sales Analytics</h1>
        <p className="page-description">
          Comprehensive sales analytics and performance metrics
        </p>
      </div>

      {/* Filters */}
      <div className="analytics-filters">
        <div className="filter-group">
          <label htmlFor="period">Period:</label>
          <select
            id="period"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="filter-select"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="3months">Last 3 Months</option>
            <option value="1year">Last Year</option>
            <option value="all">All Time</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="restaurant">Restaurant:</label>
          <select
            id="restaurant"
            value={restaurantId}
            onChange={(e) => setRestaurantId(e.target.value)}
            className="filter-select"
          >
            <option value="">All Restaurants</option>
            {restaurants.map((restaurant) => (
              <option key={restaurant.id} value={restaurant.id}>
                {restaurant.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card highlight">
          <div className="stat-header">
            <h3>Platform Revenue</h3>
            <span className="stat-icon">💰</span>
          </div>
          <div className="stat-value">
            ${(analytics?.summary?.totalRevenue || 0).toFixed(2)}
          </div>
          <div className="stat-meta">Total revenue across platform</div>
        </div>

        <div className="stat-card highlight">
          <div className="stat-header">
            <h3>Commission Collected</h3>
            <span className="stat-icon">💵</span>
          </div>
          <div className="stat-value">
            ${(analytics?.summary?.totalCommission || 0).toFixed(2)}
          </div>
          <div className="stat-meta">Platform earnings</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3>Active Restaurants</h3>
            <span className="stat-icon">🏪</span>
          </div>
          <div className="stat-value">{analytics?.summary?.activeRestaurants || 0}</div>
          <div className="stat-breakdown">
            <div className="stat-item">
              <span className="stat-label">Net Revenue:</span>
              <span className="stat-number">
                ${(analytics?.summary?.netRevenue || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3>Total Orders</h3>
            <span className="stat-icon">📦</span>
          </div>
          <div className="stat-value">{analytics?.summary?.totalOrders || 0}</div>
          <div className="stat-breakdown">
            <div className="stat-item">
              <span className="stat-label">Avg Order Value:</span>
              <span className="stat-number">
                $
                {analytics?.summary?.totalOrders > 0
                  ? (
                      analytics.summary.totalRevenue / analytics.summary.totalOrders
                    ).toFixed(2)
                  : '0.00'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Growth Metrics */}
      <div className="growth-metrics">
        <h2>Growth Metrics</h2>
        <div className="metrics-grid">
          <div className="metric-card">
            <h4>Month over Month</h4>
            <div
              className={`metric-value ${
                analytics?.growthMetrics?.monthOverMonth?.revenueGrowth >= 0
                  ? 'positive'
                  : 'negative'
              }`}
            >
              {analytics?.growthMetrics?.monthOverMonth?.revenueGrowth >= 0 ? '↑' : '↓'}{' '}
              {Math.abs(
                analytics?.growthMetrics?.monthOverMonth?.revenueGrowth || 0
              ).toFixed(2)}
              %
            </div>
            <div className="metric-details">
              <p>
                Current: ${(analytics?.growthMetrics?.monthOverMonth?.currentMonth?.revenue || 0).toFixed(2)}
              </p>
              <p>
                Previous: ${(analytics?.growthMetrics?.monthOverMonth?.previousMonth?.revenue || 0).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="metric-card">
            <h4>Year over Year</h4>
            <div
              className={`metric-value ${
                analytics?.growthMetrics?.yearOverYear?.revenueGrowth >= 0
                  ? 'positive'
                  : 'negative'
              }`}
            >
              {analytics?.growthMetrics?.yearOverYear?.revenueGrowth >= 0 ? '↑' : '↓'}{' '}
              {Math.abs(
                analytics?.growthMetrics?.yearOverYear?.revenueGrowth || 0
              ).toFixed(2)}
              %
            </div>
            <div className="metric-details">
              <p>
                Current Year: ${(analytics?.growthMetrics?.yearOverYear?.currentYear?.revenue || 0).toFixed(2)}
              </p>
              <p>
                Previous Year: ${(analytics?.growthMetrics?.yearOverYear?.previousYear?.revenue || 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Trend Chart */}
      <div className="chart-section">
        <div className="chart-header">
          <h2>Revenue Trend (Last 12 Months)</h2>
          <button onClick={handleExportMonthlyTrend} className="btn-export">
            Export CSV
          </button>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyTrendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" name="Revenue" />
            <Line
              type="monotone"
              dataKey="commission"
              stroke="#6366f1"
              name="Commission"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Commission vs Net Revenue */}
      <div className="chart-section">
        <h2>Commission vs Net Revenue</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyTrendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="commission" fill="#8b5cf6" name="Commission" />
            <Bar dataKey="netRevenue" fill="#10b981" name="Net Revenue" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Orders by Status */}
        <div className="chart-section">
          <h2>Orders by Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {orderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by Category */}
        <div className="chart-section">
          <h2>Revenue by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="categoryName" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="totalRevenue" fill="#8b5cf6" name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Restaurants Table */}
      <div className="table-section">
        <div className="table-header">
          <h2>Top Performing Restaurants</h2>
          <button onClick={handleExportTopRestaurants} className="btn-export">
            Export CSV
          </button>
        </div>
        <div className="table-responsive">
          <table className="analytics-table">
            <thead>
              <tr>
                <th>Restaurant</th>
                <th>Address</th>
                <th>Total Orders</th>
                <th>Total Revenue</th>
                <th>Commission</th>
                <th>Avg Order Value</th>
              </tr>
            </thead>
            <tbody>
              {analytics?.topRestaurants?.map((restaurant) => (
                <tr key={restaurant.id}>
                  <td>{restaurant.name}</td>
                  <td>{restaurant.address}</td>
                  <td>{restaurant.totalOrders}</td>
                  <td>${restaurant.totalRevenue.toFixed(2)}</td>
                  <td>${restaurant.totalCommission.toFixed(2)}</td>
                  <td>${restaurant.avgOrderValue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="table-section">
        <div className="table-header">
          <h2>Top Selling Products</h2>
          <button onClick={handleExportTopProducts} className="btn-export">
            Export CSV
          </button>
        </div>
        <div className="table-responsive">
          <table className="analytics-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Restaurant</th>
                <th>Category</th>
                <th>Times Ordered</th>
                <th>Total Quantity</th>
                <th>Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {analytics?.topProducts?.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.restaurantName}</td>
                  <td>{product.categoryName}</td>
                  <td>{product.timesOrdered}</td>
                  <td>{product.totalQuantitySold}</td>
                  <td>${product.totalRevenue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
