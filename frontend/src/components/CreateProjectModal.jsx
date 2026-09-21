import { useState, useEffect } from 'react';
import { fetchClients, createClient } from '../api/clients';
import { createProject } from '../api/projects';

export default function CreateProjectModal({ onClose, onProjectCreated }) {
    const [clients, setClients] = useState([]);
    const [title, setTitle] = useState('');
    const [clientId, setClientId] = useState('');
    const [projectType, setProjectType] = useState('Wedding');
    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endDate, setEndDate] = useState('');
    const [endTime, setEndTime] = useState('');
    const [allDay, setAllDay] = useState(false);
    const [timezone, setTimezone] = useState('(GMT-05:00) Eastern Time');

    // Accordion state
    const [showMoreDetails, setShowMoreDetails] = useState(false);
    const [leadSource, setLeadSource] = useState('Lead form');
    const [estimatedValue, setEstimatedValue] = useState('');

    // Inline client creation fields
    const [showNewClientInput, setShowNewClientInput] = useState(false);
    const [newClientName, setNewClientName] = useState('');

    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchClients().then((data) => {
            setClients(data);
            if (data.length > 0) {
                setClientId(data[0].id);
            }
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            let finalClientId = clientId;

            if (showNewClientInput && newClientName.trim()) {
                const createdClient = await createClient({ name: newClientName.trim() });
                finalClientId = createdClient.id;
            }

            const newProject = await createProject({
                title,
                clientId: finalClientId || undefined,
                stage: 'LEAD',
                projectType,
                leadSource,
            });

            onProjectCreated(newProject);
            onClose();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create project');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-card animate-fade-in" style={{ maxWidth: '520px', padding: '1.8rem 2rem', borderRadius: '16px' }}>
                {/* Header */}
                <div style={{ position: 'relative', textAlign: 'center', marginBottom: '1.8rem' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a' }}>
                        Create new project
                    </h3>
                    <button
                        className="btn-ghost"
                        onClick={onClose}
                        style={{ position: 'absolute', right: 0, top: '-4px', fontSize: '1.2rem', padding: '0.2rem 0.5rem', color: '#64748b' }}
                    >
                        &times;
                    </button>
                </div>

                {error && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    {/* Name * */}
                    <div style={{ marginBottom: '1.2rem' }}>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#334155', marginBottom: '0.4rem' }}>
                            Name *
                        </label>
                        <input
                            placeholder="Type project title"
                            style={{
                                width: '100%',
                                background: '#f8fafc',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                padding: '0.65rem 0.9rem',
                                fontSize: '0.88rem'
                            }}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                        <div style={{ marginTop: '0.3rem', fontSize: '0.76rem', color: '#64748b' }}>
                            Adding existing project? <a href="#import" onClick={(e) => e.preventDefault()} style={{ color: '#4f46e5', fontWeight: '500', textDecoration: 'none' }}>Try to import your projects</a>
                        </div>
                    </div>

                    {/* Assign contacts */}
                    <div style={{ marginBottom: '1.2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                            <label style={{ fontSize: '0.82rem', fontWeight: '600', color: '#334155' }}>
                                Assign contacts
                            </label>
                            <button
                                type="button"
                                className="btn-ghost"
                                style={{ fontSize: '0.75rem', padding: '0.1rem 0.4rem', color: '#6366f1' }}
                                onClick={() => setShowNewClientInput(!showNewClientInput)}
                            >
                                {showNewClientInput ? 'Select Existing Contact' : '+ Add New Contact'}
                            </button>
                        </div>

                        {showNewClientInput ? (
                            <input
                                placeholder="Enter new contact name"
                                style={{ width: '100%', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.65rem 0.9rem' }}
                                value={newClientName}
                                onChange={(e) => setNewClientName(e.target.value)}
                                required
                            />
                        ) : (
                            <select
                                style={{ width: '100%', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.65rem 0.9rem', color: '#334155' }}
                                value={clientId}
                                onChange={(e) => setClientId(e.target.value)}
                            >
                                <option value="">Search</option>
                                {clients.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name} {c.email ? `(${c.email})` : ''}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Project type * */}
                    <div style={{ marginBottom: '1.2rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', fontWeight: '600', color: '#334155', marginBottom: '0.4rem' }}>
                            Project type * <span style={{ color: '#94a3b8', fontSize: '0.8rem', cursor: 'pointer' }} title="Category of your project">ⓘ</span>
                        </label>
                        <select
                            style={{ width: '100%', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.65rem 0.9rem', color: '#334155' }}
                            value={projectType}
                            onChange={(e) => setProjectType(e.target.value)}
                        >
                            <option value="Wedding">Wedding</option>
                            <option value="Corporate">Corporate</option>
                            <option value="Commercial">Commercial</option>
                            <option value="Consulting">Consulting</option>
                            <option value="Development">Development</option>
                            <option value="Photography">Photography</option>
                            <option value="Videography">Videography</option>
                        </select>
                    </div>

                    {/* Date & Time Grid */}
                    <div style={{ marginBottom: '1.2rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 20px 1fr 1fr', alignItems: 'center', gap: '0.4rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.2rem' }}>Start date</label>
                                <input
                                    type="date"
                                    style={{ width: '100%', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.5rem', fontSize: '0.8rem' }}
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.2rem' }}>Start time</label>
                                <select
                                    style={{ width: '100%', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.5rem', fontSize: '0.8rem' }}
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                >
                                    <option value="">Select</option>
                                    <option value="09:00 AM">09:00 AM</option>
                                    <option value="10:00 AM">10:00 AM</option>
                                    <option value="11:00 AM">11:00 AM</option>
                                    <option value="12:00 PM">12:00 PM</option>
                                    <option value="01:00 PM">01:00 PM</option>
                                    <option value="02:00 PM">02:00 PM</option>
                                    <option value="03:00 PM">03:00 PM</option>
                                    <option value="04:00 PM">04:00 PM</option>
                                    <option value="05:00 PM">05:00 PM</option>
                                </select>
                            </div>

                            <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem', marginTop: '1.2rem' }}>To</div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.2rem' }}>End date</label>
                                <input
                                    type="date"
                                    style={{ width: '100%', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.5rem', fontSize: '0.8rem' }}
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.2rem' }}>End time</label>
                                <select
                                    style={{ width: '100%', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.5rem', fontSize: '0.8rem' }}
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                >
                                    <option value="">Select</option>
                                    <option value="05:00 PM">05:00 PM</option>
                                    <option value="06:00 PM">06:00 PM</option>
                                    <option value="07:00 PM">07:00 PM</option>
                                    <option value="08:00 PM">08:00 PM</option>
                                </select>
                            </div>
                        </div>

                        {/* All day checkbox */}
                        <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <input
                                type="checkbox"
                                id="allDayCheck"
                                checked={allDay}
                                onChange={(e) => setAllDay(e.target.checked)}
                                style={{ width: '14px', height: '14px' }}
                            />
                            <label htmlFor="allDayCheck" style={{ fontSize: '0.8rem', color: '#64748b', cursor: 'pointer' }}>All day</label>
                        </div>
                    </div>

                    {/* Timezone */}
                    <div style={{ marginBottom: '1.2rem' }}>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#334155', marginBottom: '0.4rem' }}>
                            Timezone
                        </label>
                        <select
                            style={{ width: '100%', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.65rem 0.9rem', color: '#334155' }}
                            value={timezone}
                            onChange={(e) => setTimezone(e.target.value)}
                        >
                            <option value="(GMT-05:00) Eastern Time">Eastern Time (US & Canada)</option>
                            <option value="(GMT-08:00) Pacific Time">Pacific Time (US & Canada)</option>
                            <option value="(GMT+00:00) UTC">UTC</option>
                            <option value="(GMT+05:30) India Standard Time">India Standard Time</option>
                        </select>
                    </div>

                    {/* More details accordion */}
                    <div style={{ marginBottom: '1.8rem' }}>
                        <button
                            type="button"
                            style={{ background: 'transparent', border: 'none', padding: 0, color: '#0f172a', fontWeight: '600', fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                            onClick={() => setShowMoreDetails(!showMoreDetails)}
                        >
                            More details {showMoreDetails ? '▲' : '▼'}
                        </button>

                        {showMoreDetails && (
                            <div style={{ marginTop: '0.8rem', padding: '0.8rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#64748b', marginBottom: '0.2rem' }}>Lead Source</label>
                                    <select
                                        style={{ width: '100%', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0.4rem' }}
                                        value={leadSource}
                                        onChange={(e) => setLeadSource(e.target.value)}
                                    >
                                        <option value="Lead form">Lead form</option>
                                        <option value="Google">Google</option>
                                        <option value="Website">Website</option>
                                        <option value="Instagram">Instagram</option>
                                        <option value="Client referral">Client referral</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#64748b', marginBottom: '0.2rem' }}>Estimated Value ($)</label>
                                    <input
                                        type="number"
                                        placeholder="e.g. 5000"
                                        style={{ width: '100%', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0.4rem' }}
                                        value={estimatedValue}
                                        onChange={(e) => setEstimatedValue(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bottom Right Submit Button */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                            type="submit"
                            disabled={submitting}
                            style={{
                                background: '#000000',
                                color: '#ffffff',
                                fontWeight: '700',
                                padding: '0.65rem 1.6rem',
                                borderRadius: '6px',
                                fontSize: '0.88rem',
                                border: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            {submitting ? 'Creating...' : 'Create project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

{/* Submit button aligned to right matching Image 1 */ }
<div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.6rem' }}>
    <button
        type="submit"
        disabled={submitting}
        style={{
            background: '#000000',
            color: '#ffffff',
            fontWeight: '700',
            padding: '0.7rem 1.8rem',
            borderRadius: '8px',
            fontSize: '0.88rem',
            border: 'none',
            cursor: submitting ? 'not-allowed' : 'pointer',
        }}
    >
        {submitting ? 'Creating...' : 'Create project'}
    </button>
</div>
                </form >
            </div >
        </div >
    );
}
