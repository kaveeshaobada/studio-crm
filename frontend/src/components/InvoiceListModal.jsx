import { useState, useEffect } from 'react';
import { fetchInvoices, recordPayment } from '../api/invoices';

export default function InvoiceListModal({ project, onClose }) {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [paymentInput, setPaymentInput] = useState({});
    const [submittingId, setSubmittingId] = useState(null);

    useEffect(() => {
        fetchInvoices(project.id)
            .then(setInvoices)
            .finally(() => setLoading(false));
    }, [project.id]);

    const formatCurrency = (cents) => {
        return (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const handleRecordPayment = async (invoiceId) => {
        const dollars = parseFloat(paymentInput[invoiceId]) || 0;
        if (dollars <= 0) return;

        const cents = Math.round(dollars * 100);
        setSubmittingId(invoiceId);

        try {
            const updated = await recordPayment(invoiceId, cents);
            setInvoices((prev) =>
                prev.map((inv) => (inv.id === invoiceId ? updated : inv))
            );
            setPaymentInput((prev) => ({ ...prev, [invoiceId]: '' }));
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to record payment');
        } finally {
            setSubmittingId(null);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-card animate-fade-in" style={{ maxWidth: '750px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div>
                        <h2>Invoices & Payments</h2>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Project: {project.title}</span>
                    </div>
                    <button className="btn-ghost" onClick={onClose}>&times;</button>
                </div>

                {loading ? (
                    <p style={{ color: 'var(--text-muted)' }}>Loading invoices...</p>
                ) : invoices.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem 1rem', background: 'var(--bg-main)', borderRadius: '8px' }}>
                        <p style={{ color: 'var(--text-muted)' }}>No invoices generated yet.</p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '0.4rem' }}>
                            Accepting a quote automatically creates an invoice for this project.
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                        {invoices.map((inv) => {
                            const percentPaid = Math.min(100, Math.round((inv.amountPaid / inv.totalAmount) * 100) || 0);

                            return (
                                <div key={inv.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '1.2rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                                        <div>
                                            <strong style={{ fontSize: '1.1rem' }}>{inv.invoiceNumber}</strong>
                                            <span style={{ marginLeft: '0.8rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                {inv.dueDate ? `Due: ${new Date(inv.dueDate).toLocaleDateString()}` : 'No due date'}
                                            </span>
                                        </div>
                                        <span className={`badge badge-${inv.status.toLowerCase()}`}>
                                            {inv.status.replace('_', ' ')}
                                        </span>
                                    </div>

                                    {/* Progress Bar */}
                                    <div style={{ marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                                            <span>Paid: {formatCurrency(inv.amountPaid)}</span>
                                            <span>Total: {formatCurrency(inv.totalAmount)} ({percentPaid}%)</span>
                                        </div>
                                        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div style={{ width: `${percentPaid}%`, height: '100%', background: 'var(--badge-paid)', transition: 'width 0.3s ease' }} />
                                        </div>
                                    </div>

                                    {/* Items Table */}
                                    <table className="custom-table" style={{ marginTop: '0.5rem' }}>
                                        <thead>
                                            <tr>
                                                <th>Description</th>
                                                <th style={{ textAlign: 'center' }}>Qty</th>
                                                <th style={{ textAlign: 'right' }}>Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {inv.items.map((item) => (
                                                <tr key={item.id}>
                                                    <td>{item.description}</td>
                                                    <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                                                    <td style={{ textAlign: 'right' }}>{formatCurrency(item.amount)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {/* Record Payment Action */}
                                    {inv.status !== 'PAID' && (
                                        <div style={{ marginTop: '1rem', paddingTop: '0.8rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'flex-end' }}>
                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Record Payment ($):</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                placeholder="Amount"
                                                style={{ width: '120px' }}
                                                value={paymentInput[inv.id] || ''}
                                                onChange={(e) => setPaymentInput({ ...paymentInput, [inv.id]: e.target.value })}
                                            />
                                            <button
                                                className="btn-primary"
                                                disabled={submittingId === inv.id}
                                                onClick={() => handleRecordPayment(inv.id)}
                                            >
                                                {submittingId === inv.id ? 'Recording...' : 'Record Payment'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
