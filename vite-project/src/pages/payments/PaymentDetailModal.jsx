import React from 'react';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';
import { CreditCard, CheckCircle2, User, BookOpen, Key, Hash } from 'lucide-react';

export function PaymentDetailModal({ isOpen, onClose, payment = null }) {
  if (!payment) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Payment Transaction Details"
      footer={
        <button className="btn btn-secondary" onClick={onClose}>
          Close
        </button>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Amount & Status Banner */}
        <div
          style={{
            padding: '20px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              TRANSACTION AMOUNT
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: payment.status === 'paid' ? '#10B981' : 'var(--text-heading)', marginTop: '2px' }}>
              {formatCurrency(payment.amount)}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              ({payment.amount_paise} {payment.currency} paise)
            </div>
          </div>
          <div>
            <Badge variant={payment.status}>{payment.status}</Badge>
          </div>
        </div>

        {/* Student & Course Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div
            style={{
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              <User size={13} /> CUSTOMER
            </div>
            <div style={{ fontWeight: 600, color: 'var(--text-heading)', fontSize: '0.9rem' }}>
              {payment.user_name}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {payment.user_email}
            </div>
          </div>

          <div
            style={{
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              <BookOpen size={13} /> COURSE PURCHASED
            </div>
            <div style={{ fontWeight: 600, color: 'var(--text-heading)', fontSize: '0.9rem' }}>
              {payment.course_title}
            </div>
          </div>
        </div>

        {/* Gateway Technical Details */}
        <div
          style={{
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Razorpay Gateway Identifiers
          </div>

          <div>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>RAZORPAY ORDER ID</div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--text-heading)', marginTop: '2px' }}>
              {payment.razorpay_order_id}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>RAZORPAY PAYMENT ID</div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--primary-light)', marginTop: '2px' }}>
              {payment.razorpay_payment_id || 'Pending / Incomplete transaction'}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>CREATED AT</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {payment.created_at}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>LAST UPDATED</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {payment.updated_at || payment.created_at}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
