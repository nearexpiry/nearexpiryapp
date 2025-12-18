import React from 'react';
import './OrderStatusBadge.css';

const OrderStatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        color: '#f59e0b',
        backgroundColor: '#fef3c7',
        label: 'Pending',
      },
      preparing: {
        color: '#3b82f6',
        backgroundColor: '#dbeafe',
        label: 'Preparing',
      },
      ready: {
        color: '#10b981',
        backgroundColor: '#d1fae5',
        label: 'Ready',
      },
      completed: {
        color: '#6b7280',
        backgroundColor: '#f3f4f6',
        label: 'Completed',
      },
      cancelled: {
        color: '#ef4444',
        backgroundColor: '#fee2e2',
        label: 'Cancelled',
      },
    };
    return configs[status] || configs.pending;
  };

  const config = getStatusConfig(status);

  return (
    <span
      className="order-status-badge"
      style={{
        color: config.color,
        backgroundColor: config.backgroundColor,
      }}
    >
      {config.label}
    </span>
  );
};

export default OrderStatusBadge;
