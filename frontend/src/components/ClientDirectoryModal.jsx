import { useState, useEffect } from 'react';
import { fetchClients, createClient } from '../api/clients';

export default function ClientDirectoryModal({ onClose, onClientAdded }) {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);

    const [form, setForm] = useState({ name: '', email: '', phone: '' });
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadClients();
    }, []);

    const loadClients = () => {
        setLoading(true);
        fetchClients()
            .then(setClients)
            .finally(() => setLoading(false));
    };

    const handleCreateClient = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            const newClient = await createClient(form);
            setClients((prev) => [newClient, ...prev]);
            setForm({ name: '', email: '', phone: '' });
            setShowAddForm(false);
            if (onClientAdded) onClientAdded(newClient);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create client');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredClients = clients.filter(
        (c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="modal-overlay">
            <div className="modal-card animate-fade-in" style={{ maxWidth: '700px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                    <div>
                        <h2>Client Directory</h2>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{clients.length} Registered Studio Clients</span>
                    </div>
                    <button className="btn-ghost" onClick={onClose}>&times;</button>
                </div>

                {/* Top Action & Search Bar */}
                <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
                    <input
                        placeholder="🔍 Search clients by name or email..."
                        style={{ flex: 1 }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button className="btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
                        {showAddForm ? 'Cancel' : '+ Add Client'}
                    </button>
                </div>

                {/* Inline Add Client Form */}
                {showAddForm && (
                    <form onSubmit={handleCreateClient} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '1.2rem', borderRadius: '8px', marginBottom: '1.2rem' }}>
                        <h4 style={{ marginBottom: '0.8rem' }}>Add New Studio Client</h4>
                        {error && <p style={{ color: '#f87171', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{error}</p>}

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.8rem', marginBottom: '0.8rem' }}>
                            <input
                                placeholder="Client Name *"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                            />
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                            />
                            <input
                                placeholder="Phone Number"
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                            <button type="submit" className="btn-primary" disabled={submitting}>
                                {submitting ? 'Saving...' : 'Save Client'}
                            </button>
                        </div>
                    </form>
                )}

                {/* Client List */}
                {loading ? (
                    <p style={{ color: 'var(--text-muted)' }}>Loading client directory...</p>
                ) : filteredClients.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem 1rem', background: 'var(--bg-main)', borderRadius: '8px' }}>
                        <p style={{ color: 'var(--text-muted)' }}>No clients found.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '400px', overflowY: 'auto' }}>
                        {filteredClients.map((client) => (
                            <div key={client.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '0.9rem 1.2rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <strong style={{ fontSize: '1rem', color: 'var(--text-main)', display: 'block' }}>{client.name}</strong>
                                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                                        {client.email && <span>✉️ {client.email}</span>}
                                        {client.phone && <span>📞 {client.phone}</span>}
                                    </div>
                                </div>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', background: 'var(--bg-main)', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>
                                    Active Client
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
