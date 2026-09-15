import { useState, useEffect } from 'react';
import { fetchAnalyticsStats, fetchActivityLogs } from '../api/analytics';

export default function AnalyticsPanel() {
    const [stats, setStats] = useState(null);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([fetchAnalyticsStats(), fetchActivityLogs()])
            .then(([statsData, logsData]) => {
                setStats(statsData);
                setLogs(logsData);
            })
            .finally(() => setLoading(false));
    }, []);

    const formatCurrency = (cents) => {
        return (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    if (loading) {
        return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading Studio Intelligence...</div>;
    }

    if (!stats) return null;

    const STAGES = ['LEAD', 'QUOTED', 'BOOKED', 'IN_PROGRESS', 'DELIVERED', 'PAID'];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="animate-fade-in">
            {/* Top Key Performance Metric Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem' }}>
                <div style={metricCardStyle}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Revenue Collected</span>
                    <strong style={{ fontSize: '1.6rem', color: 'var(--badge-paid)', marginTop: '0.4rem', display: 'block' }}>
                        {formatCurrency(stats.totalRevenue)}
                    </strong>
                </div>

                <div style={metricCardStyle}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Pending Receivables</span>
                    <strong style={{ fontSize: '1.6rem', color: 'var(--badge-progress)', marginTop: '0.4rem', display: 'block' }}>
                        {formatCurrency(stats.pendingReceivables)}
                    </strong>
                </div>

                <div style={metricCardStyle}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Active Projects</span>
                    <strong style={{ fontSize: '1.6rem', color: 'var(--text-main)', marginTop: '0.4rem', display: 'block' }}>
                        {stats.totalProjects}
                    </strong>
                </div>

                <div style={metricCardStyle}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Booking Conversion Rate</span>
                    <strong style={{ fontSize: '1.6rem', color: 'var(--accent-primary)', marginTop: '0.4rem', display: 'block' }}>
                        {stats.conversionRate}%
                    </strong>
                </div>
            </div>

            {/* Bottom Split Layout: Pipeline Distribution + Live Activity Feed */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
                {/* Pipeline Breakdown */}
                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1.2rem', fontSize: '1.1rem' }}>Pipeline Breakdown</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {STAGES.map((stage) => {
                            const count = stats.stageCounts[stage] || 0;
                            const percent = stats.totalProjects > 0 ? Math.round((count / stats.totalProjects) * 100) : 0;

                            return (
                                <div key={stage}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                                        <span className={`badge badge-${stage.toLowerCase()}`}>{stage.replace('_', ' ')}</span>
                                        <span style={{ color: 'var(--text-muted)' }}>{count} projects ({percent}%)</span>
                                    </div>
                                    <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                                        <div style={{ width: `${percent}%`, height: '100%', background: `var(--badge-${stage.toLowerCase()})`, transition: 'width 0.4s ease' }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Live Activity Stream */}
                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1.2rem', fontSize: '1.1rem' }}>Live Activity Audit Stream</h3>
                    {logs.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No activity logged yet.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', maxHeight: '350px', overflowY: 'auto', paddingRight: '0.3rem' }}>
                            {logs.map((log) => (
                                <div key={log.id} style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start', paddingBottom: '0.8rem', borderBottom: '1px solid var(--border-subtle)' }}>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', minWidth: '70px' }}>
                                        {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <div>
                                        <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', margin: 0 }}>
                                            {log.description}
                                        </p>
                                        {log.project && (
                                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Project: {log.project.title}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const metricCardStyle = {
    background: 'var(--bg-surface)',
    border: '1px solid var(--border-subtle)',
    borderRadius: '10px',
    padding: '1.2rem',
    boxShadow: 'var(--shadow-card)',
};
