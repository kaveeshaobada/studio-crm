import { useState, useEffect } from 'react';
import { fetchQuotes, updateQuoteStatus } from '../api/quotes';

export default function QuoteDetailsModal({ project, onClose, onCreateQuoteClick }) {
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedQuoteId, setSelectedQuoteId] = useState(null);

    useEffect(() => {
        fetchQuotes(project.id)
            .then((data) => {
                setQuotes(data);
                if (data.length > 0) {
                    setSelectedQuoteId(data[0].id);
                }
            })
            .finally(() => setLoading(false));
    }, [project.id]);

    const handleStatusChange = async (quoteId, newStatus) => {
        try {
            const updated = await updateQuoteStatus(quoteId, newStatus);
            setQuotes((prev) =>
                prev.map((q) => (q.id === quoteId ? { ...q, status: updated.status } : q))
            );
        } catch {
            alert('Failed to update quote status');
        }
    };

    const formatCurrency = (cents) => {
        return (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const selectedQuote = quotes.find((q) => q.id === selectedQuoteId);

    return (
        <div className="modal-overlay">
            <div className="modal-card animate-fade-in" style={{ maxWidth: '750px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                    <div>
                        <h2>Proposals & Quotes</h2>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Project: {project.title}</span>
                    </div>
                    <button className="btn-ghost" onClick={onClose}>&times;</button>
                </div>

                {loading ? (
                    <p style={{ color: 'var(--text-muted)' }}>Loading quotes...</p>
                ) : quotes.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem 1rem', background: 'var(--bg-main)', borderRadius: '8px' }}>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No quotes created for this project yet.</p>
                        <button className="btn-primary" onClick={onCreateQuoteClick}>+ Create New Quote</button>
                    </div>
                ) : (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                {quotes.map((q) => (
                                    <button
                                        key={q.id}
                                        onClick={() => setSelectedQuoteId(q.id)}
                                        className={q.id === selectedQuoteId ? 'btn-primary' : 'btn-secondary'}
                                        style={{ fontSize: '0.85rem' }}
                                    >
                                        {q.title}
                                    </button>
                                ))}
                            </div>
                            <button className="btn-secondary" onClick={onCreateQuoteClick}>+ New Quote</button>
                        </div>

                        {selectedQuote && (
                            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '1.2rem', borderRadius: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem' }}>
                                    <h3>{selectedQuote.title}</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Status:</span>
                                        <select
                                            value={selectedQuote.status}
                                            onChange={(e) => handleStatusChange(selectedQuote.id, e.target.value)}
                                        >
                                            <option value="DRAFT">DRAFT</option>
                                            <option value="SENT">SENT</option>
                                            <option value="ACCEPTED">ACCEPTED</option>
                                            <option value="DECLINED">DECLINED</option>
                                            <option value="EXPIRED">EXPIRED</option>
                                        </select>
                                    </div>
                                </div>

                                {selectedQuote.validUntil && (
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                                        Valid until: {new Date(selectedQuote.validUntil).toLocaleDateString()}
                                    </p>
                                )}

                                <table className="custom-table">
                                    <thead>
                                        <tr>
                                            <th>Item</th>
                                            <th style={{ textAlign: 'center' }}>Qty</th>
                                            <th style={{ textAlign: 'right' }}>Unit Price</th>
                                            <th style={{ textAlign: 'right' }}>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedQuote.items.map((item) => (
                                            <tr key={item.id}>
                                                <td>{item.description}</td>
                                                <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                                                <td style={{ textAlign: 'right' }}>{formatCurrency(item.unitPrice)}</td>
                                                <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{formatCurrency(item.amount)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <div style={{ textAlign: 'right', marginTop: '1.2rem', fontSize: '1.2rem' }}>
                                    <span>Total: </span>
                                    <strong style={{ color: 'var(--accent-primary)' }}>{formatCurrency(selectedQuote.totalAmount)}</strong>
                                </div>

                                {selectedQuote.terms && (
                                    <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Terms & Agreement Notes</span>
                                        <p style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem', color: 'var(--text-main)', background: 'var(--bg-main)', padding: '0.8rem', borderRadius: '6px' }}>
                                            {selectedQuote.terms}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

