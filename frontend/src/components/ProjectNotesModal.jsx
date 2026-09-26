import { useState, useEffect, useCallback } from 'react';
import { fetchNotes, createNote, togglePinNote, deleteNote } from '../api/notes';

export default function ProjectNotesModal({ project, onClose }) {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Form state
    const [content, setContent] = useState('');
    const [isPinned, setIsPinned] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const projectId = project?.id;

    const loadNotes = useCallback(async () => {
        if (!projectId) return;
        try {
            const data = await fetchNotes(projectId);
            setNotes(data);
        } catch (err) {
            setError(err.response?.data?.error || err.message);
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        if (!projectId) return;
        let isMounted = true;
        fetchNotes(projectId)
            .then((data) => {
                if (isMounted) setNotes(data);
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
        if (!content.trim()) return;

        setSubmitting(true);
        setError(null);
        try {
            await createNote({
                content,
                isPinned,
                projectId: project.id
            });

            // Re-fetch to preserve pin order
            await loadNotes();
            setContent('');
            setIsPinned(false);

        } catch (err) {
            setError(err.response?.data?.error || err.message);
        } finally {
            setSubmitting(false);
        }
    }

    async function handleTogglePin(id) {
        try {
            await togglePinNote(id);
            await loadNotes();
        } catch (err) {
            setError(err.response?.data?.error || err.message);
        }
    }

    async function handleDelete(id) {
        if (!window.confirm('Delete this team note?')) return;
        try {
            await deleteNote(id);
            setNotes(notes.filter(n => n.id !== id));
        } catch (err) {
            setError(err.response?.data?.error || err.message);
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
                            Project Notes & Team Log
                        </h2>
                        <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
                            Internal shoot schedules, call logs, & equipment lists for <span style={{ color: '#818cf8', fontWeight: 500 }}>{project.title}</span>
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

                    {/* Add Note Form */}
                    <form onSubmit={handleCreate} style={{
                        backgroundColor: '#1a1e27',
                        border: '1px solid #282e3d',
                        borderRadius: '8px',
                        padding: '16px',
                        marginBottom: '24px'
                    }}>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#e2e8f0', marginTop: 0, marginBottom: '10px' }}>
                            + Add Studio Note / Log Entry
                        </h3>

                        <textarea
                            rows={3}
                            placeholder="e.g. Call summary with client: Shoot confirmed for Saturday 9 AM at Studio B. Gear needed: RED Komodo 6K, Aputure 600d, Wireless Lavalier kit."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                backgroundColor: '#0d0f14',
                                border: '1px solid #2d3446',
                                borderRadius: '6px',
                                color: '#f8fafc',
                                fontSize: '0.85rem',
                                resize: 'vertical',
                                fontFamily: 'inherit',
                                marginBottom: '12px'
                            }}
                        />

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#cbd5e1', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={isPinned}
                                    onChange={(e) => setIsPinned(e.target.checked)}
                                    style={{ accentColor: '#f59e0b' }}
                                />
                                📌 Pin note to top of project
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
                                {submitting ? 'Saving...' : 'Add Note'}
                            </button>
                        </div>
                    </form>

                    {/* Notes List */}
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '12px' }}>
                        Studio Stream ({notes.length})
                    </h3>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '30px 0', color: '#94a3b8', fontSize: '0.85rem' }}>
                            Loading team notes...
                        </div>
                    ) : notes.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '36px 20px',
                            border: '1px dashed #232833',
                            borderRadius: '8px',
                            color: '#64748b',
                            fontSize: '0.85rem'
                        }}>
                            No studio notes added yet. Use the box above to log shoot dates, location notes, or equipment prep.
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {notes.map((note) => (
                                <div key={note.id} style={{
                                    padding: '14px 16px',
                                    backgroundColor: note.isPinned ? 'rgba(245, 158, 11, 0.05)' : '#161922',
                                    border: note.isPinned ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid #232833',
                                    borderRadius: '8px',
                                    transition: 'all 0.2s ease'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#818cf8' }}>
                                                👤 {note.authorName || 'Team Member'}
                                            </span>
                                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                                • {new Date(note.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                            </span>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <button
                                                onClick={() => handleTogglePin(note.id)}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    fontSize: '0.85rem',
                                                    opacity: note.isPinned ? 1 : 0.4,
                                                    padding: '2px 4px'
                                                }}
                                                title={note.isPinned ? 'Unpin Note' : 'Pin Note to Top'}
                                            >
                                                📌
                                            </button>
                                            <button
                                                onClick={() => handleDelete(note.id)}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: '#ef4444',
                                                    fontSize: '0.8rem',
                                                    cursor: 'pointer',
                                                    padding: '2px 4px'
                                                }}
                                                title="Delete Note"
                                            >
                                                🗑
                                            </button>
                                        </div>
                                    </div>

                                    <div style={{
                                        fontSize: '0.88rem',
                                        color: '#f1f5f9',
                                        whiteSpace: 'pre-wrap',
                                        lineHeight: 1.5
                                    }}>
                                        {note.content}
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
