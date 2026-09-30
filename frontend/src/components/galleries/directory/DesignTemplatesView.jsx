import React from 'react';
import { Sparkles, Eye, Plus, Share2 } from 'lucide-react';
import { designTemplates } from '../constants/galleryPresets';

export default function DesignTemplatesView({
    templateFilterCategory,
    setTemplateFilterCategory,
    onPreviewTemplate,
    onCreateFromTemplate,
}) {
    const filteredTemplates = designTemplates.filter((t) => {
        if (templateFilterCategory === 'ALL') return true;
        return t.category.toLowerCase() === templateFilterCategory.toLowerCase();
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Templates Banner & Category Pills */}
            <div style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%)',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.5rem 1.75rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
            }}>
                <div>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: '#eff6ff',
                        color: '#2563eb',
                        padding: '3px 10px',
                        borderRadius: '12px',
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        marginBottom: '6px',
                    }}>
                        <Sparkles size={12} />
                        <span>Intuitive Ready-to-Publish Templates</span>
                    </div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#111827', margin: '0 0 4px 0' }}>
                        Curated Gallery Design Templates
                    </h2>
                    <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0, maxWidth: '580px' }}>
                        Every template comes with curated cover compositions, responsive masonry, refined font pairings, and harmonious color palettes. Preview, customize, publish, and share directly with your clients.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {['ALL', 'Editorial', 'Fine Art', 'Modern', 'Minimalist'].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setTemplateFilterCategory(cat)}
                            style={{
                                padding: '5px 12px',
                                borderRadius: '9999px',
                                border: templateFilterCategory === cat ? '1px solid #111827' : '1px solid #cbd5e1',
                                background: templateFilterCategory === cat ? '#111827' : '#ffffff',
                                color: templateFilterCategory === cat ? '#ffffff' : '#475569',
                                fontSize: '0.76rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Templates Grid Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.5rem' }}>
                {filteredTemplates.map((template) => (
                    <div
                        key={template.id}
                        style={{
                            border: '1px solid #e5e7eb',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            background: '#ffffff',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-3px)';
                            e.currentTarget.style.boxShadow = '0 12px 24px -4px rgba(0,0,0,0.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                        }}
                    >
                        {/* Card Thumbnail with Badge */}
                        <div style={{ height: '180px', position: 'relative', overflow: 'hidden', background: '#f1f5f9' }}>
                            <img
                                src={template.coverImage}
                                alt={template.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <div style={{
                                position: 'absolute',
                                top: '12px',
                                left: '12px',
                                background: 'rgba(255, 255, 255, 0.92)',
                                backdropFilter: 'blur(4px)',
                                padding: '3px 8px',
                                borderRadius: '12px',
                                fontSize: '0.7rem',
                                fontWeight: '700',
                                color: '#111827',
                            }}>
                                {template.badge}
                            </div>

                            <div style={{
                                position: 'absolute',
                                bottom: '10px',
                                right: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                background: 'rgba(0,0,0,0.6)',
                                backdropFilter: 'blur(4px)',
                                color: '#ffffff',
                                padding: '3px 8px',
                                borderRadius: '4px',
                                fontSize: '0.68rem',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                            }}>
                                <span>{template.coverLayout} layout</span>
                            </div>
                        </div>

                        {/* Card Details */}
                        <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '700', color: '#111827' }}>
                                    {template.name}
                                </h3>
                                <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: '500' }}>
                                    {template.category}
                                </span>
                            </div>

                            <p style={{ fontSize: '0.78rem', color: '#6b7280', margin: '4px 0 12px 0', lineHeight: '1.45', flex: 1 }}>
                                {template.description}
                            </p>

                            {/* Design System Metadata Chips */}
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                                <span style={{ background: '#f1f5f9', color: '#475569', fontSize: '0.68rem', padding: '2px 7px', borderRadius: '4px', fontWeight: '500' }}>
                                    Grid: {template.gridStyle}
                                </span>
                                <span style={{ background: '#f1f5f9', color: '#475569', fontSize: '0.68rem', padding: '2px 7px', borderRadius: '4px', fontWeight: '500' }}>
                                    Font: {template.fontPreset}
                                </span>
                                <span style={{ background: '#f1f5f9', color: '#475569', fontSize: '0.68rem', padding: '2px 7px', borderRadius: '4px', fontWeight: '500' }}>
                                    Color: {template.colorPreset}
                                </span>
                            </div>

                            {/* 3 Action Buttons: Preview | Use Template | Publish & Share */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                                <button
                                    onClick={() => onPreviewTemplate(template)}
                                    style={{
                                        background: '#ffffff',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        padding: '7px 12px',
                                        fontSize: '0.78rem',
                                        fontWeight: '600',
                                        color: '#374151',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '5px',
                                    }}
                                >
                                    <Eye size={13} />
                                    <span>Preview</span>
                                </button>

                                <button
                                    onClick={() => onCreateFromTemplate(template, false)}
                                    style={{
                                        background: '#111827',
                                        border: 'none',
                                        borderRadius: '6px',
                                        padding: '7px 12px',
                                        fontSize: '0.78rem',
                                        fontWeight: '600',
                                        color: '#ffffff',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '5px',
                                    }}
                                >
                                    <Plus size={13} />
                                    <span>Use Template</span>
                                </button>
                            </div>

                            <button
                                onClick={() => onCreateFromTemplate(template, true)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#2563eb',
                                    fontSize: '0.76rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    marginTop: '8px',
                                    textAlign: 'center',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '4px',
                                }}
                            >
                                <Share2 size={12} />
                                <span>Publish & Share directly</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
