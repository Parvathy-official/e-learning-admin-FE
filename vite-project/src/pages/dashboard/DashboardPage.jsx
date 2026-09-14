import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  BookOpen,
  BookmarkCheck,
  CheckCircle2,
  CreditCard,
  TrendingUp,
  RefreshCw,
  ExternalLink,
  DollarSign,
  ArrowUpRight,
} from 'lucide-react';
import { dashboardApi } from '../../api/dashboard';
import { StatCard } from '../../components/common/StatCard';
import { StatCardSkeleton } from '../../components/common/LoadingSkeleton';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { useToast } from '../../context/ToastContext';

export function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await dashboardApi.getStats();
      setData(res);
    } catch (err) {
      toast.error('Failed to load dashboard statistics', err.message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const stats = data?.stats || {};
  const recentEnrollments = data?.recent_enrollments || [];
  const recentPayments = data?.recent_payments || [];
  const coursePerformance = data?.course_performance || [];

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
          <h1>Platform Overview</h1>
          <p className="page-subtitle">
            Real-time analytics and student metrics from PostgreSQL database
          </p>
        </div>
        <div className="page-actions">
          <button
            className="btn btn-secondary btn-sm"
            onClick={loadDashboardData}
            disabled={loading}
          >
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      {loading && !data ? (
        <StatCardSkeleton count={6} />
      ) : (
        <div className="dashboard-stats-grid">
          <StatCard
            title="Total Students"
            value={stats.total_students ?? 0}
            subtitle="Registered platform learners"
            icon={Users}
            color="#06B6D4"
          />
          <StatCard
            title="Total Courses"
            value={stats.total_courses ?? 0}
            subtitle={`${stats.published_courses ?? 0} Published Courses`}
            icon={BookOpen}
            color="#8B5CF6"
          />
          <StatCard
            title="Total Enrollments"
            value={stats.total_enrollments ?? 0}
            subtitle={`${stats.active_enrollments ?? 0} Active Learners`}
            icon={BookmarkCheck}
            color="#14B8A6"
          />
          <StatCard
            title="Active Enrollments"
            value={stats.active_enrollments ?? 0}
            subtitle="Currently studying modules"
            icon={CheckCircle2}
            color="#10B981"
          />
          <StatCard
            title="Published Courses"
            value={stats.published_courses ?? 0}
            subtitle="Live in academy catalog"
            icon={TrendingUp}
            color="#3B82F6"
          />
          <StatCard
            title="Total Revenue"
            value={formatCurrency(stats.total_revenue)}
            subtitle="From verified paid orders"
            icon={CreditCard}
            color="#F59E0B"
          />
        </div>
      )}

      {/* Course Performance & Highlights */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3>Course Performance</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              Enrollments and revenue generated per academy masterclass
            </p>
          </div>
          <Link to="/courses" className="btn btn-outline btn-sm">
            View All Courses <ArrowUpRight size={14} />
          </Link>
        </div>

        {coursePerformance.length === 0 ? (
          <EmptyState title="No course performance data available yet" />
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Category</th>
                  <th>Selling Price</th>
                  <th>Enrollments</th>
                  <th>Revenue</th>
                  <th>Rating</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {coursePerformance.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {c.thumbnail ? (
                          <img
                            src={c.thumbnail}
                            alt=""
                            style={{ width: '44px', height: '30px', borderRadius: '4px', objectFit: 'cover' }}
                          />
                        ) : (
                          <div
                            style={{
                              width: '44px',
                              height: '30px',
                              borderRadius: '4px',
                              backgroundColor: 'var(--bg-surface-elevated)',
                            }}
                          />
                        )}
                        <span style={{ fontWeight: 600, color: 'var(--text-heading)' }}>
                          {c.title}
                        </span>
                      </div>
                    </td>
                    <td><span style={{ color: 'var(--text-secondary)' }}>{c.category}</span></td>
                    <td>₹{c.price}</td>
                    <td><strong>{c.total_enrollments}</strong></td>
                    <td style={{ color: '#10B981', fontWeight: 600 }}>{formatCurrency(c.total_revenue)}</td>
                    <td>⭐ {c.rating}</td>
                    <td>
                      <Badge variant={c.is_published ? 'published' : 'draft'}>
                        {c.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Two Column Grid: Recent Enrollments & Recent Payments */}
      <div className="dashboard-section-grid">
        {/* Recent Enrollments */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3>Recent Enrollments</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Latest student course registrations</p>
            </div>
            <Link to="/enrollments" className="btn btn-ghost btn-sm">
              View All <ArrowUpRight size={14} />
            </Link>
          </div>

          {recentEnrollments.length === 0 ? (
            <EmptyState title="No recent enrollments" />
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Course</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEnrollments.map((e) => (
                    <tr key={e.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div className="user-avatar" style={{ width: '28px', height: '28px', fontSize: '0.75rem' }}>
                            {e.user_avatar ? (
                              <img src={e.user_avatar} alt="" />
                            ) : (
                              <span>{e.user_name?.charAt(0)?.toUpperCase() || 'U'}</span>
                            )}
                          </div>
                          <div>
                            <div style={{ fontWeight: 500, color: 'var(--text-heading)', fontSize: '0.825rem' }}>
                              {e.user_name}
                            </div>
                            <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                              {e.user_email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: '0.8rem', maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {e.course_title}
                      </td>
                      <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {e.enrolled_at}
                      </td>
                      <td>
                        <Badge variant={e.status}>{e.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Payments */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3>Recent Payments</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Latest Razorpay payment orders</p>
            </div>
            <Link to="/payments" className="btn btn-ghost btn-sm">
              View All <ArrowUpRight size={14} />
            </Link>
          </div>

          {recentPayments.length === 0 ? (
            <EmptyState title="No recent payments" />
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPayments.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div style={{ fontWeight: 500, color: 'var(--text-heading)', fontSize: '0.825rem' }}>
                          {p.user_name}
                        </div>
                        <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                          {p.created_at}
                        </div>
                      </td>
                      <td style={{ fontWeight: 600, color: p.status === 'paid' ? '#10B981' : 'var(--text-primary)' }}>
                        {formatCurrency(p.amount)}
                      </td>
                      <td>
                        <Badge variant={p.status}>{p.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
