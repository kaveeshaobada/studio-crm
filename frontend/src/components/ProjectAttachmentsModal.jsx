import { useState, useEffect } from 'react';
import { fetchAttachments, createAttachment, deleteAttachment } from '../api/attachments';

export default function ProjectAttachmentsModal({ project, onClose }) {
    const [attachments, setAttachments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Form state
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [type, setType] = useState('DELIVERABLE');
    const [isClientVisible, setIsClientVisible] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const projectId = project?.id;

    useEffect(() => {
        if (!projectId) return;
        let isMounted = true;
        fetchAttachments(projectId)
            .then((data) => {
                if (isMounted) setAttachments(data);
            })
            .catch((err) => {
                if (isMounted) setError(err.response?.data?.error || err.message);
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });
        return () => {
            isMounted = false;
        };
    }, [projectId]);



    async function handleCreate(e) {
        e.preventDefault();
        if (!name.trim() || !url.trim()) return;

        setSubmitting(true);
        setError(null);
        try {
            const newAttachment = await createAttachment({
                name,
                url,
                type,
                isClientVisible,
                projectId: project.id
            });

            setAttachments([newAttachment, ...attachments]);
            setName('');
            setUrl('');
            setType('DELIVERABLE');
            setIsClientVisible(true);
        } catch (err) {
            setError(err.response?.data?.error || err.message);
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDelete(id) {
        if (!window.confirm('Are you sure you want to delete this asset link?')) return;
        try {
            await deleteAttachment(id);
            setAttachments(attachments.filter(a => a.id !== id));
        } catch (err) {
            setError(err.response?.data?.error || err.message);
        }
    }

    function getTypeBadge(type) {
        switch (type) {
            case 'DELIVERABLE':
                return { bg: 'rgba(99, 102, 241, 0.15)', text: '#a5b4fc', border: 'rgba(99, 102, 241, 0.3)', label: 'Deliverable' };
            case 'BRIEF':
                return { bg: 'rgba(14, 165, 233, 0.15)', text: '#7dd3fc', border: 'rgba(14, 165, 233, 0.3)', label: 'Shoot Brief' };
            case 'CONTRACT':
                return { bg: 'rgba(16, 185, 129, 0.15)', text: '#6ee7b7', border: 'rgba(16, 185, 129, 0.3)', label: 'Contract / Legal' };
            default:
                return { bg: 'rgba(148, 163, 184, 0.15)', text: '#cbd5e1', border: 'rgba(148, 163, 184, 0.3)', label: 'General File' };
        }
    }

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '16px'
        }}>
            <div style={{
                backgroundColor: '#13161c',
                border: '1px solid #232833',
                borderRadius: '12px',
                width: '100%',
                maxWidth: '680px',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                overflow: 'hidden'
            }}>
                {/* Header */}
                <div style={{
                    padding: '20px 24px',
                    borderBottom: '1px solid #232833',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#0d0f14'
                }}>
                    <div>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#f8fafc', margin: 0 }}>
                            Project Deliverables & Assets
                        </h2>
                        <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
                            Attach shoot briefs, moodboards, contract links, & final video/photo deliverables for <span style={{ color: '#818cf8', fontWeight: 500 }}>{project.title}</span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#94a3b8',
                            fontSize: '1.25rem',
                            cursor: 'pointer',
                            padding: '4px 8px',
                            borderRadius: '4px'
                        }}
                    >
                        ✕
                    </button>
                </div>

                <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
                    {error && (
                        <div style={{
                            padding: '10px 14px',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '6px',
                            color: '#fca5a5',
                            fontSize: '0.85rem',
                            marginBottom: '20px'
                        }}>
                            {error}
                        </div>
                    )}

                    {/* Add New Asset Form */}
                    <form onSubmit={handleCreate} style={{
                        backgroundColor: '#1a1e27',
                        border: '1px solid #282e3d',
                        borderRadius: '8px',
                        padding: '16px',
                        marginBottom: '24px'
                    }}>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#e2e8f0', marginTop: 0, marginBottom: '12px' }}>
                            + Add New Asset or Deliverable Link
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Asset Name / Title
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Final 4K Master Video (Frame.io)"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        backgroundColor: '#0d0f14',
                                        border: '1px solid #2d3446',
                                        borderRadius: '6px',
                                        color: '#f8fafc',
                                        fontSize: '0.85rem'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Asset Type
                                </label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        backgroundColor: '#0d0f14',
                                        border: '1px solid #2d3446',
                                        borderRadius: '6px',
                                        color: '#f8fafc',
                                        fontSize: '0.85rem'
                                    }}
                                >
                                    <option value="DELIVERABLE">Deliverable (Vimeo, Frame.io, Dropbox)</option>
                                    <option value="BRIEF">Shoot Brief / Moodboard</option>
                                    <option value="CONTRACT">Contract / Legal PDF</option>
                                    <option value="GENERAL">General Reference File</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ marginBottom: '12px' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Asset URL
                            </label>
                            <input
                                type="url"
                                placeholder="https://frame.io/f/sample or https://dropbox.com/s/..."
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    backgroundColor: '#0d0f14',
                                    border: '1px solid #2d3446',
                                    borderRadius: '6px',
                                    color: '#f8fafc',
                                    fontSize: '0.85rem'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#cbd5e1', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={isClientVisible}
                                    onChange={(e) => setIsClientVisible(e.target.checked)}
                                    style={{ accentColor: '#6366f1' }}
                                />
                                Show on Client Portal
                            </label>

                            <button
                                type="submit"
                                disabled={submitting}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#6366f1',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontWeight: 500,
                                    fontSize: '0.85rem',
                                    cursor: submitting ? 'not-allowed' : 'pointer',
                                    opacity: submitting ? 0.7 : 1
                                }}
                            >
                                {submitting ? 'Saving...' : 'Add Asset Link'}
                            </button>
                        </div>
                    </form>

                    {/* Existing Attachments List */}
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '12px' }}>
                        Attached Assets ({attachments.length})
                    </h3>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '30px 0', color: '#94a3b8', fontSize: '0.85rem' }}>
                            Loading project deliverables...
                        </div>
                    ) : attachments.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '36px 20px',
                            border: '1px dashed #232833',
                            borderRadius: '8px',
                            color: '#64748b',
                            fontSize: '0.85rem'
                        }}>
                            No deliverables or asset links added yet. Use the form above to link Vimeo previews, Dropbox folders, or shoot briefs.
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {attachments.map((item) => {
                                const badge = getTypeBadge(item.type);
                                return (
                                    <div key={item.id} style={{
                                        padding: '12px 16px',
                                        backgroundColor: '#161922',
                                        border: '1px solid #232833',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: '12px'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                                            <span style={{
                                                padding: '3px 8px',
                                                borderRadius: '4px',
                                                fontSize: '0.7rem',
                                                fontWeight: 600,
                                                backgroundColor: badge.bg,
                                                color: badge.text,
                                                border: `1px solid ${badge.border}`,
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.04em',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                {badge.label}
                                            </span>

                                            <div style={{ minWidth: 0 }}>
                                                <a
                                                    href={item.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                        fontSize: '0.9rem',
                                                        fontWeight: 500,
                                                        color: '#f1f5f9',
                                                        textDecoration: 'none',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '6px'
                                                    }}
                                                >
                                                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {item.name}
                                                    </span>
                                                    <span style={{ fontSize: '0.75rem', color: '#6366f1' }}>↗</span>
                                                </a>
                                                <div style={{ fontSize: '0.75rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>
                                                    {item.url}
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <span style={{
                                                fontSize: '0.75rem',
                                                color: item.isClientVisible ? '#34d399' : '#64748b',
                                                backgroundColor: item.isClientVisible ? 'rgba(52, 211, 153, 0.1)' : 'transparent',
                                                padding: '2px 6px',
                                                borderRadius: '4px'
                                            }}>
                                                {item.isClientVisible ? 'Client Visible' : 'Internal Only'}
                                            </span>

                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: '#ef4444',
                                                    fontSize: '0.8rem',
                                                    cursor: 'pointer',
                                                    padding: '4px'
                                                }}
                                                title="Delete Asset Link"
                                            >
                                                🗑
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
