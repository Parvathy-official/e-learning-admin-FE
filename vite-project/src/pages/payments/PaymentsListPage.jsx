import React, { useState, useEffect, useCallback } from 'react';
import { Search, Eye, CreditCard, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { paymentsApi } from '../../api/payments';
import { PaymentDetailModal } from './PaymentDetailModal';
import { Badge } from '../../components/common/Badge';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { useToast } from '../../context/ToastContext';

export function PaymentsListPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const toast = useToast();

  const loadPayments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await paymentsApi.getPayments({ search, status: statusFilter });
      setPayments(res.results || []);
    } catch (err) {
      toast.error('Failed to load payments', err.message);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, toast]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const handleOpenDetail = (pmt) => {
    setSelectedPayment(pmt);
    setModalOpen(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-info">
          <h1>Payment Transactions</h1>
          <p className="page-subtitle">
            Razorpay payment gateway orders, verified payments, and transaction history
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="filter-group" style={{ flex: 1, minWidth: '260px' }}>
          <div className="input-icon-wrapper" style={{ width: '100%', maxWidth: '360px' }}>
            <Search size={16} className="input-icon-left" />
            <input
              type="text"
              className="input"
              placeholder="Search by student, order ID, or payment ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-group">
          <select
            className="select"
            style={{ width: 'auto' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="paid">Paid (Successful)</option>
            <option value="created">Created (Pending)</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      {loading ? (
        <TableSkeleton rows={4} cols={7} />
      ) : payments.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="No payment records found"
          description="Transactions processed via Razorpay will appear here."
        />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Course</th>
                <th>Amount (INR)</th>
                <th>Status</th>
                <th>Razorpay Order ID</th>
                <th>Date & Time</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((pmt) => (
                <tr key={pmt.id}>
                  <td>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-heading)', fontSize: '0.875rem' }}>
                        {pmt.user_name}
                      </div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                        {pmt.user_email}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                      {pmt.course_title}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        color: pmt.status === 'paid' ? '#10B981' : 'var(--text-heading)',
                      }}
                    >
                      {formatCurrency(pmt.amount)}
                    </span>
                  </td>
                  <td>
                    <Badge variant={pmt.status}>{pmt.status}</Badge>
                  </td>
                  <td>
                    <span
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                      }}
                    >
                      {pmt.razorpay_order_id}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                      {pmt.created_at}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleOpenDetail(pmt)}
                      title="View Transaction Details"
                    >
                      <Eye size={14} />
                      <span>Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Payment Detail Modal */}
      <PaymentDetailModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        payment={selectedPayment}
      />
    </div>
  );
}
