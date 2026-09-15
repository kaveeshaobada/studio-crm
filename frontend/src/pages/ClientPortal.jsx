import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPortalData, respondToQuote } from '../api/portal';

export default function ClientPortal() {
    const { portalToken } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [responding, setResponding] = useState(false);
    const [actionMessage, setActionMessage] = useState('');

    useEffect(() => {
        fetchPortalData(portalToken)
            .then(setData)
            .catch((err) => setError(err.response?.data?.error || 'Portal unavailable'))
            .finally(() => setLoading(false));
    }, [portalToken]);

    const handleAction = async (quoteId, action) => {
        setResponding(true);
        setActionMessage('');
        try {
            const res = await respondToQuote(portalToken, quoteId, action);
            setData((prev) => ({
                ...prev,
                stage: res.projectStage,
                quotes: prev.quotes.map((q) => (q.id === quoteId ? res.quote : q)),
            }));
            if (action === 'ACCEPT') {
                setActionMessage('Thank you! Proposal & Agreement accepted. Your project booking and invoice are confirmed.');
            } else {
                setActionMessage('Proposal declined. The studio has been notified.');
            }
        } catch (err) {
            alert(err.response?.data?.error || 'Action failed');
        } finally {
            setResponding(false);
        }
    };

    const formatCurrency = (cents) => {
        return (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    if (loading) return <div style={containerStyle}><p style={{ color: 'var(--text-muted)' }}>Loading client portal...</p></div>;
    if (error) return <div style={containerStyle}><h2 style={{ color: '#f87171' }}>{error}</h2></div>;
    if (!data) return null;

    const activeQuote = data.quotes && data.quotes.length > 0 ? data.quotes[0] : null;
    const activeInvoices = data.invoices || [];

    return (
        <div style={containerStyle}>
            <header style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.2rem', marginBottom: '1.8rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: '600' }}>
                    {data.organization?.name} • Client Portal
                </span>
                <h1 style={{ margin: '0.4rem 0 0.2rem 0', fontSize: '1.8rem' }}>{data.title}</h1>
                {data.client && <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Prepared for: {data.client.name}</p>}
            </header>

            {actionMessage && (
                <div style={{ backgroundColor: 'rgba(52, 211, 153, 0.15)', border: '1px solid rgba(52, 211, 153, 0.4)', color: '#34d399', padding: '1rem', borderRadius: '8px', marginBottom: '1.8rem' }}>
                    <strong>{actionMessage}</strong>
                </div>
            )}

            {!activeQuote ? (
                <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <h3>Project Overview</h3>
                    <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>Stage: <strong className={`badge badge-${data.stage.toLowerCase()}`}>{data.stage}</strong></p>
                    <p style={{ marginTop: '0.5rem', color: 'var(--text-dim)' }}>No proposal quotes have been published for this project yet.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
                    {/* Proposal Block */}
                    <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '1.5rem', background: 'var(--bg-surface)', boxShadow: 'var(--shadow-card)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <div>
                                <h2 style={{ margin: 0, fontSize: '1.3rem' }}>{activeQuote.title}</h2>
                                {activeQuote.validUntil && (
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                        Valid until: {new Date(activeQuote.validUntil).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                            <span className={`badge badge-${activeQuote.status.toLowerCase()}`}>
                                STATUS: {activeQuote.status}
                            </span>
                        </div>

                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>Service / Item</th>
                                    <th style={{ textAlign: 'center' }}>Qty</th>
                                    <th style={{ textAlign: 'right' }}>Unit Price</th>
                                    <th style={{ textAlign: 'right' }}>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activeQuote.items.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.description}</td>
                                        <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                                        <td style={{ textAlign: 'right' }}>{formatCurrency(item.unitPrice)}</td>
                                        <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{formatCurrency(item.amount)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div style={{ textAlign: 'right', marginTop: '1.5rem', fontSize: '1.25rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Total Investment: </span>
                            <strong style={{ color: 'var(--accent-primary)' }}>{formatCurrency(activeQuote.totalAmount)}</strong>
                        </div>

                        {activeQuote.terms && (
                            <div style={{ marginTop: '1.5rem', paddingTop: '1.2rem', borderTop: '1px solid var(--border-subtle)' }}>
                                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)' }}>Contract & Agreement Terms</h4>
                                <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: '6px', whiteSpace: 'pre-wrap', fontSize: '0.9rem', color: 'var(--text-main)', border: '1px solid var(--border-subtle)' }}>
                                    {activeQuote.terms}
                                </div>
                            </div>
                        )}

                        {activeQuote.status === 'DRAFT' || activeQuote.status === 'SENT' ? (
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.8rem' }}>
                                <button
                                    disabled={responding}
                                    className="btn-danger"
                                    onClick={() => handleAction(activeQuote.id, 'DECLINE')}
                                >
                                    Decline Proposal
                                </button>
                                <button
                                    disabled={responding}
                                    className="btn-primary"
                                    onClick={() => handleAction(activeQuote.id, 'ACCEPT')}
                                >
                                    {responding ? 'Processing...' : 'Accept Proposal & Agreement'}
                                </button>
                            </div>
                        ) : (
                            <div style={{ marginTop: '1.2rem', textAlign: 'right', fontStyle: 'italic', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                                Proposal status: {activeQuote.status}
                            </div>
                        )}
                    </div>

                    {/* Deliverables & Assets Block */}
                    {data.attachments && data.attachments.length > 0 && (
                        <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '1.5rem', background: 'var(--bg-surface)' }}>
                            <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1.15rem' }}>📁 Deliverables & Project Assets</h3>
                            <p style={{ margin: '0 0 1.2rem 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                Access shoot briefs, contract PDFs, and final high-resolution video/photo deliverables linked to this project.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                {data.attachments.map((item) => {
                                    let badgeColor = 'rgba(99, 102, 241, 0.15)';
                                    let textColor = '#a5b4fc';
                                    let label = 'Deliverable';

                                    if (item.type === 'BRIEF') {
                                        badgeColor = 'rgba(14, 165, 233, 0.15)';
                                        textColor = '#7dd3fc';
                                        label = 'Shoot Brief';
                                    } else if (item.type === 'CONTRACT') {
                                        badgeColor = 'rgba(16, 185, 129, 0.15)';
                                        textColor = '#6ee7b7';
                                        label = 'Contract / Legal';
                                    } else if (item.type === 'GENERAL') {
                                        badgeColor = 'rgba(148, 163, 184, 0.15)';
                                        textColor = '#cbd5e1';
                                        label = 'Asset';
                                    }

                                    return (
                                        <div key={item.id} style={{
                                            background: 'var(--bg-card)',
                                            border: '1px solid var(--border-subtle)',
                                            borderRadius: '8px',
                                            padding: '0.9rem 1.2rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            gap: '1rem',
                                            flexWrap: 'wrap'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', minWidth: 0 }}>
                                                <span style={{
                                                    padding: '3px 8px',
                                                    borderRadius: '4px',
                                                    fontSize: '0.7rem',
                                                    fontWeight: 600,
                                                    backgroundColor: badgeColor,
                                                    color: textColor,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.04em',
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    {label}
                                                </span>
                                                <div style={{ minWidth: 0 }}>
                                                    <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {item.name}
                                                    </strong>
                                                </div>
                                            </div>

                                            <a
                                                href={item.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn-primary"
                                                style={{
                                                    fontSize: '0.8rem',
                                                    padding: '0.4rem 0.9rem',
                                                    textDecoration: 'none',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '4px'
                                                }}
                                            >
                                                Open Asset ↗
                                            </a>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Invoice Block */}
                    {activeInvoices.length > 0 && (
                        <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '1.5rem', background: 'var(--bg-surface)' }}>
                            <h3 style={{ marginBottom: '1rem' }}>Project Invoices & Payment Schedule</h3>
                            {activeInvoices.map((inv) => {
                                const percent = Math.min(100, Math.round((inv.amountPaid / inv.totalAmount) * 100) || 0);

                                return (
                                    <div key={inv.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '1.2rem', marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                                            <strong>{inv.invoiceNumber}</strong>
                                            <span className={`badge badge-${inv.status.toLowerCase()}`}>{inv.status.replace('_', ' ')}</span>
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                                            <span>Paid: {formatCurrency(inv.amountPaid)}</span>
                                            <span>Total: {formatCurrency(inv.totalAmount)}</span>
                                        </div>

                                        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div style={{ width: `${percent}%`, height: '100%', background: 'var(--badge-paid)', transition: 'width 0.3s ease' }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

const containerStyle = {
    maxWidth: '850px',
    margin: '2rem auto',
    padding: '0 1.5rem',
};
