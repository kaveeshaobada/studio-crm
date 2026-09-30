import React from 'react';
import { X, Info, ChevronDown, Calendar } from 'lucide-react';
import { designTemplates } from '../constants/galleryPresets';

export default function CreateGalleryModal({
    show,
    onClose,
    onSubmit,
    projects = [],
    newGalleryProject,
    setNewGalleryProject,
    newGalleryName,
    setNewGalleryName,
    newGalleryShootDate,
    setNewGalleryShootDate,
    newGalleryTemplate,
    setNewGalleryTemplate,
}) {
    if (!show) return null;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(2px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1.5rem',
        }}>
            <div style={{
                background: '#ffffff',
                borderRadius: '12px',
                width: '100%',
                maxWidth: '460px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.25)',
                overflow: 'hidden',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom: '1.5rem' }}>
                    <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '700', color: '#111827' }}>
                        Create gallery
                    </h2>
                    <button
                        onClick={onClose}
                        style={{ position: 'absolute', right: 0, background: 'transparent', border: 'none', cursor: 'pointer', color: '#4b5563', padding: '4px' }}
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.84rem', fontWeight: '500', color: '#1f2937', marginBottom: '6px' }}>
                            <span>Project *</span>
                            <Info size={14} color="#6b7280" />
                        </label>
                        <div style={{ position: 'relative' }}>
                            <select
                                value={newGalleryProject}
                                onChange={(e) => {
                                    setNewGalleryProject(e.target.value);
                                    setNewGalleryName(e.target.value);
                                }}
                                style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: 'none', background: '#f9fafb', fontSize: '0.85rem', color: '#111827', appearance: 'none', outline: 'none', cursor: 'pointer' }}
                            >
                                <option value="21">21</option>
                                <option value="Test project">Test project</option>
                                {projects.map((p) => (
                                    <option key={p.id} value={p.name || p.title}>{p.name || p.title}</option>
                                ))}
                            </select>
                            <ChevronDown size={14} color="#6b7280" style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        </div>
                    </div>

                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <label style={{ fontSize: '0.84rem', fontWeight: '500', color: '#1f2937' }}>
                                Gallery name *
                            </label>
                            <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>{newGalleryName.length}/50</span>
                        </div>
                        <input
                            value={newGalleryName}
                            maxLength={50}
                            onChange={(e) => setNewGalleryName(e.target.value)}
                            required
                            style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: 'none', background: '#f9fafb', fontSize: '0.85rem', color: '#111827', outline: 'none' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '500', color: '#1f2937', marginBottom: '6px' }}>
                            Starting Design Template
                        </label>
                        <div style={{ position: 'relative' }}>
                            <select
                                value={newGalleryTemplate}
                                onChange={(e) => setNewGalleryTemplate(e.target.value)}
                                style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: 'none', background: '#f9fafb', fontSize: '0.85rem', color: '#111827', appearance: 'none', outline: 'none', cursor: 'pointer' }}
                            >
                                {designTemplates.map((t) => (
                                    <option key={t.id} value={t.id}>{t.name} ({t.category})</option>
                                ))}
                            </select>
                            <ChevronDown size={14} color="#6b7280" style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '500', color: '#1f2937', marginBottom: '6px' }}>
                            Shoot date
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                value={newGalleryShootDate}
                                onChange={(e) => setNewGalleryShootDate(e.target.value)}
                                style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: 'none', background: '#f9fafb', fontSize: '0.85rem', color: '#111827', outline: 'none' }}
                            />
                            <Calendar size={14} color="#9ca3af" style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{ background: 'transparent', border: 'none', color: '#111827', fontSize: '0.88rem', fontWeight: '600', cursor: 'pointer' }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            style={{ background: '#111827', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '9px 24px', fontSize: '0.88rem', fontWeight: '600', cursor: 'pointer' }}
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
