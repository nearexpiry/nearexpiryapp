import React, { useState } from 'react';
import './OrderCard.css';

const OrderCard = ({ order, onStatusUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      preparing: '#3b82f6',
      ready: '#10b981',
      completed: '#6b7280',
      cancelled: '#ef4444',
    };
    return colors[status] || '#6b7280';
  };

  const getNextStatus = (currentStatus) => {
    const transitions = {
      pending: 'preparing',
      preparing: 'ready',
      ready: 'completed',
    };
    return transitions[currentStatus];
  };

  const getStatusButtonText = (currentStatus) => {
    const texts = {
      pending: 'Start Preparing',
      preparing: 'Mark Ready',
      ready: 'Mark Completed',
    };
    return texts[currentStatus];
  };

  const handleStatusUpdate = async (newStatus) => {
    setIsUpdating(true);
    try {
      await onStatusUpdate(order.id, newStatus);
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelOrder = () => {
    setShowCancelDialog(true);
  };

  const confirmCancel = async () => {
    setShowCancelDialog(false);
    await handleStatusUpdate('cancelled');
  };

  const canUpdateStatus = !['completed', 'cancelled'].includes(order.status);
  const nextStatus = getNextStatus(order.status);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <div className="order-card">
        <div className="order-card-header">
          <div className="order-id">
            <span className="order-label">Order ID:</span>
            <span className="order-value">{order.id.substring(0, 8)}</span>
          </div>
          <div
            className="order-status-badge"
            style={{ backgroundColor: getStatusColor(order.status) }}
          >
            {order.status.toUpperCase()}
          </div>
        </div>

        <div className="order-card-body">
          <div className="order-info-row">
            <div className="order-info-item">
              <span className="info-label">Customer:</span>
              <span className="info-value">{order.clientName}</span>
            </div>
            <div className="order-info-item">
              <span className="info-label">Type:</span>
              <span className="info-value order-type">{order.orderType}</span>
            </div>
          </div>

          {order.orderType === 'delivery' && order.deliveryAddress && (
            <div className="order-delivery-info">
              <div className="delivery-item">
                <span className="info-label">Address:</span>
                <span className="info-value">{order.deliveryAddress}</span>
              </div>
              {order.deliveryPhone && (
                <div className="delivery-item">
                  <span className="info-label">Phone:</span>
                  <span className="info-value">{order.deliveryPhone}</span>
                </div>
              )}
            </div>
          )}

          <div className="order-items">
            <h4>Items:</h4>
            <ul className="items-list">
              {order.items.map((item) => (
                <li key={item.id} className="order-item">
                  <div className="item-info">
                    <span className="item-name">{item.productName}</span>
                    <span className="item-quantity">x{item.quantity}</span>
                  </div>
                  <span className="item-price">
                    ${(item.priceAtOrder * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="order-total">
            <span className="total-label">Total Amount:</span>
            <span className="total-value">${order.totalAmount.toFixed(2)}</span>
          </div>

          {order.status === 'completed' && order.commissionAmount > 0 && (
            <div className="order-commission">
              <span className="commission-label">Commission:</span>
              <span className="commission-value">
                ${order.commissionAmount.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        <div className="order-card-footer">
          <div className="order-timestamp">
            <span className="timestamp-label">Created:</span>
            <span className="timestamp-value">{formatDate(order.createdAt)}</span>
          </div>

          {canUpdateStatus && (
            <div className="order-actions">
              {nextStatus && (
                <button
                  className="btn-status-update"
                  onClick={() => handleStatusUpdate(nextStatus)}
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Updating...' : getStatusButtonText(order.status)}
                </button>
              )}
              <button
                className="btn-cancel"
                onClick={handleCancelOrder}
                disabled={isUpdating}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {showCancelDialog && (
        <div className="cancel-dialog-overlay" onClick={() => setShowCancelDialog(false)}>
          <div className="cancel-dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Cancel Order</h3>
            <p>Are you sure you want to cancel this order?</p>
            <p className="cancel-warning">This action cannot be undone.</p>
            <div className="dialog-actions">
              <button
                className="btn-dialog-cancel"
                onClick={() => setShowCancelDialog(false)}
              >
                No, Keep Order
              </button>
              <button className="btn-dialog-confirm" onClick={confirmCancel}>
                Yes, Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderCard;
