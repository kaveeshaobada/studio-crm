import { useState } from 'react';
import { createQuote } from '../api/quotes';

export default function CreateQuoteModal({ project, onClose, onQuoteCreated }) {
    const [title, setTitle] = useState(`${project.title} - Quote`);
    const [terms, setTerms] = useState('Standard 50% deposit required upon acceptance.');
    const [validUntil, setValidUntil] = useState('');
    const [items, setItems] = useState([
        { description: 'Production / Creative Services', quantity: 1, unitPriceDollar: '500' },
    ]);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleItemChange = (index, field, value) => {
        setItems((prev) => {
            const next = [...prev];
            next[index] = { ...next[index], [field]: value };
            return next;
        });
    };

    const addItem = () => {
        setItems((prev) => [
            ...prev,
            { description: '', quantity: 1, unitPriceDollar: '0' },
        ]);
    };

    const removeItem = (index) => {
        if (items.length === 1) return;
        setItems((prev) => prev.filter((_, i) => i !== index));
    };

    const totalDollars = items.reduce((sum, item) => {
        const qty = parseInt(item.quantity, 10) || 0;
        const price = parseFloat(item.unitPriceDollar) || 0;
        return sum + qty * price;
    }, 0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            const formattedItems = items.map((item) => ({
                description: item.description,
                quantity: parseInt(item.quantity, 10) || 1,
                unitPrice: Math.round((parseFloat(item.unitPriceDollar) || 0) * 100),
            }));

            const payload = {
                title,
                projectId: project.id,
                terms: terms.trim() || undefined,
                validUntil: validUntil || undefined,
                items: formattedItems,
            };

            const created = await createQuote(payload);
            onQuoteCreated(created);
            onClose();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create quote');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-card animate-fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                    <div>
                        <h2>Create Quote</h2>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Project: {project.title}</span>
                    </div>
                    <button className="btn-ghost" onClick={onClose}>&times;</button>
                </div>

                {error && <p style={{ color: '#f87171', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Quote Title</label>
                        <input
                            style={{ width: '100%' }}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Valid Until (Optional)</label>
                        <input
                            type="date"
                            style={{ width: '100%' }}
                            value={validUntil}
                            onChange={(e) => setValidUntil(e.target.value)}
                        />
                    </div>

                    <h4 style={{ marginBottom: '0.6rem', color: 'var(--text-muted)' }}>Line Items</h4>
                    {items.map((item, index) => (
                        <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                            <input
                                placeholder="Service description"
                                style={{ flex: 2 }}
                                value={item.description}
                                onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                required
                            />
                            <input
                                type="number"
                                min="1"
                                placeholder="Qty"
                                style={{ width: '60px' }}
                                value={item.quantity}
                                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                required
                            />
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="Unit ($)"
                                style={{ width: '100px' }}
                                value={item.unitPriceDollar}
                                onChange={(e) => handleItemChange(index, 'unitPriceDollar', e.target.value)}
                                required
                            />
                            <span style={{ width: '80px', fontWeight: '600', textAlign: 'right', fontSize: '0.9rem', color: 'var(--accent-primary)' }}>
                                ${((parseInt(item.quantity, 10) || 0) * (parseFloat(item.unitPriceDollar) || 0)).toFixed(2)}
                            </span>
                            {items.length > 1 && (
                                <button type="button" className="btn-danger" style={{ padding: '0.4rem 0.6rem' }} onClick={() => removeItem(index)}>
                                    &times;
                                </button>
                            )}
                        </div>
                    ))}

                    <button type="button" className="btn-secondary" onClick={addItem} style={{ marginBottom: '1.2rem', marginTop: '0.3rem' }}>
                        + Add Line Item
                    </button>

                    <div style={{ marginBottom: '1.2rem', textAlign: 'right', fontSize: '1.1rem' }}>
                        <span>Total: </span>
                        <strong style={{ color: 'var(--accent-primary)' }}>${totalDollars.toFixed(2)}</strong>
                    </div>

                    <div style={{ marginBottom: '1.2rem' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Terms & Contract Notes</label>
                        <textarea
                            rows="3"
                            style={{ width: '100%' }}
                            value={terms}
                            onChange={(e) => setTerms(e.target.value)}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button type="button" className="btn-secondary" onClick={onClose} disabled={submitting}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={submitting}>
                            {submitting ? 'Creating...' : 'Create Quote'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
};

const modalContentStyle = {
    background: '#fff',
    color: '#000',
    padding: '1.5rem',
    borderRadius: '6px',
    maxWidth: '650px',
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto',
};
