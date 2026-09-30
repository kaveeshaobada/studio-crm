import React from 'react';
import { Target, ExternalLink, Plus, Monitor, Smartphone, Sparkles } from 'lucide-react';
import plantCoverImg from '../../../../assets/gallery_plant_cover.jpg';
import ClientGalleryCanvas from '../../canvas/ClientGalleryCanvas';
import { designTemplates, colorPresets } from '../../constants/galleryPresets';

export default function GalleryDesignTab({
    selectedGallery,
    currentDesign,
    designSubTab,
    setDesignSubTab,
    activeFont,
    activeColor,
    allGalleryItems = [],
    favorites = {},
    updateDesign,
    applyDesignTemplate,
    onNavigateToTemplates,
    onTriggerToast,
    onOpenCustomColorModal,
    onOpenCustomFontModal,
    onOpenShare,
    onOpenLightbox,
    onToggleFavorite,
    onScrollToGrid,
}) {
    return (
        <div style={{
            flex: 1,
            display: 'flex',
            minHeight: 0,
            background: '#f8fafc',
        }}>
            {/* LEFT CUSTOMIZER SIDEBAR (~360px) */}
            <div style={{
                width: '360px',
                minWidth: '340px',
                background: '#ffffff',
                borderRight: '1px solid #e5e7eb',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                overflowY: 'auto',
            }}>
                {/* PRESET TEMPLATES BAR AT TOP */}
                <div style={{
                    padding: '12px 16px',
                    background: '#f8fafc',
                    borderBottom: '1px solid #e5e7eb',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#4b5563', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Sparkles size={13} color="#2563eb" />
                            <span>Curated Design Presets</span>
                        </span>
                        <button
                            onClick={onNavigateToTemplates}
                            style={{ background: 'transparent', border: 'none', color: '#2563eb', fontSize: '0.74rem', fontWeight: '600', cursor: 'pointer' }}
                        >
                            Browse all
                        </button>
                    </div>

                    <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
                        {designTemplates.slice(0, 5).map((tpl) => (
                            <button
                                key={tpl.id}
                                onClick={() => applyDesignTemplate(tpl)}
                                style={{
                                    padding: '4px 10px',
                                    borderRadius: '9999px',
                                    border: selectedGallery.templateId === tpl.id ? '1px solid #111827' : '1px solid #d1d5db',
                                    background: selectedGallery.templateId === tpl.id ? '#111827' : '#ffffff',
                                    color: selectedGallery.templateId === tpl.id ? '#ffffff' : '#374151',
                                    fontSize: '0.72rem',
                                    fontWeight: '600',
                                    whiteSpace: 'nowrap',
                                    cursor: 'pointer',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                                }}
                            >
                                {tpl.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sub-Tabs: Cover | Grid | Fonts | Color */}
                <div style={{
                    display: 'flex',
                    borderBottom: '1px solid #e5e7eb',
                    background: '#ffffff',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                }}>
                    {[
                        { id: 'cover', label: 'Cover' },
                        { id: 'grid', label: 'Grid' },
                        { id: 'fonts', label: 'Fonts' },
                        { id: 'color', label: 'Color' },
                    ].map((st) => (
                        <button
                            key={st.id}
                            onClick={() => setDesignSubTab(st.id)}
                            style={{
                                flex: 1,
                                padding: '12px 0',
                                border: 'none',
                                background: 'transparent',
                                color: designSubTab === st.id ? '#111827' : '#6b7280',
                                fontWeight: designSubTab === st.id ? '700' : '500',
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                borderBottom: designSubTab === st.id ? '2px solid #2563eb' : '2px solid transparent',
                                textAlign: 'center',
                            }}
                        >
                            {st.label}
                        </button>
                    ))}
                </div>

                {/* SUB-TAB CONTENT */}
                <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* 1. COVER SUB-TAB (MATCHING SCREENSHOT 1) */}
                    {designSubTab === 'cover' && (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#111827' }}>
                                    Cover layout
                                </span>
                                <button
                                    onClick={() => onTriggerToast('Focal point adjusted', 'Cover centered on primary subject')}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#2563eb',
                                        fontSize: '0.78rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                    }}
                                >
                                    <Target size={13} />
                                    <span>Focal point</span>
                                </button>
                            </div>

                            {/* 10 Cover Layout Option Cards */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                                {[
                                    { id: 'none', label: 'None' },
                                    { id: 'split', label: 'Split' },
                                    { id: 'title_above', label: 'Title above' },
                                    { id: 'title_below', label: 'Title below' },
                                    { id: 'editorial_1', label: 'Editorial 1' },
                                    { id: 'editorial_2', label: 'Editorial 2' },
                                    { id: 'framed', label: 'Framed' },
                                    { id: 'modern', label: 'Modern' },
                                    { id: 'overlay', label: 'Overlay' },
                                    { id: 'dark_overlay', label: 'Dark overlay' },
                                ].map((cov) => {
                                    const isSelected = currentDesign.coverLayout === cov.id;
                                    return (
                                        <div
                                            key={cov.id}
                                            onClick={() => updateDesign('coverLayout', cov.id)}
                                            style={{
                                                border: isSelected ? '1.5px solid #111827' : '1px solid #e5e7eb',
                                                borderRadius: '8px',
                                                padding: '6px',
                                                cursor: 'pointer',
                                                background: isSelected ? '#fafafa' : '#ffffff',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                transition: 'all 0.15s ease',
                                            }}
                                        >
                                            <div style={{
                                                width: '100%',
                                                height: '64px',
                                                background: '#f9fafb',
                                                borderRadius: '4px',
                                                overflow: 'hidden',
                                                position: 'relative',
                                                border: '1px solid #f1f3f5',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}>
                                                {cov.id === 'none' && (
                                                    <svg width="100%" height="100%">
                                                        <line x1="0" y1="64" x2="100%" y2="0" stroke="#cbd5e1" strokeWidth="1" />
                                                    </svg>
                                                )}
                                                {cov.id === 'split' && (
                                                    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
                                                        <div style={{ width: '45%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4px' }}>
                                                            <div style={{ width: '60%', height: '3px', background: '#9ca3af', marginBottom: '2px' }} />
                                                            <div style={{ width: '40%', height: '2px', background: '#cbd5e1' }} />
                                                        </div>
                                                        <div style={{ width: '55%', height: '100%', overflow: 'hidden' }}>
                                                            <img src={plantCoverImg} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        </div>
                                                    </div>
                                                )}
                                                {cov.id === 'title_above' && (
                                                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
                                                        <div style={{ height: '35%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <div style={{ width: '50%', height: '3px', background: '#9ca3af' }} />
                                                        </div>
                                                        <div style={{ height: '65%', width: '100%' }}>
                                                            <img src={plantCoverImg} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        </div>
                                                    </div>
                                                )}
                                                {cov.id === 'title_below' && (
                                                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
                                                        <div style={{ height: '65%', width: '100%' }}>
                                                            <img src={plantCoverImg} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        </div>
                                                        <div style={{ height: '35%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <div style={{ width: '50%', height: '3px', background: '#9ca3af' }} />
                                                        </div>
                                                    </div>
                                                )}
                                                {cov.id === 'framed' && (
                                                    <div style={{ padding: '6px', width: '100%', height: '100%', boxSizing: 'border-box' }}>
                                                        <div style={{ width: '100%', height: '100%', border: '1px solid #cbd5e1', overflow: 'hidden' }}>
                                                            <img src={plantCoverImg} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        </div>
                                                    </div>
                                                )}
                                                {['editorial_1', 'editorial_2', 'modern', 'overlay', 'dark_overlay'].includes(cov.id) && (
                                                    <img
                                                        src={plantCoverImg}
                                                        alt={cov.label}
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover',
                                                            filter: cov.id === 'dark_overlay' ? 'brightness(0.6)' : 'none',
                                                        }}
                                                    />
                                                )}
                                            </div>
                                            <span style={{ fontSize: '0.76rem', color: isSelected ? '#111827' : '#6b7280', fontWeight: isSelected ? '600' : '400', marginTop: '6px' }}>
                                                {cov.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Logo Option Section */}
                            <div style={{ marginTop: '0.5rem' }}>
                                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
                                    Logo
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                                    <div
                                        onClick={() => updateDesign('logo', 'none')}
                                        style={{
                                            border: currentDesign.logo === 'none' ? '1.5px solid #111827' : '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            padding: '6px',
                                            cursor: 'pointer',
                                            textAlign: 'center',
                                            background: currentDesign.logo === 'none' ? '#fafafa' : '#ffffff',
                                        }}
                                    >
                                        <div style={{ height: '54px', border: '1px solid #f1f3f5', borderRadius: '4px', position: 'relative' }}>
                                            <svg width="100%" height="100%">
                                                <line x1="0" y1="54" x2="100%" y2="0" stroke="#cbd5e1" strokeWidth="1" />
                                            </svg>
                                        </div>
                                        <span style={{ fontSize: '0.76rem', color: '#4b5563', marginTop: '4px', display: 'block' }}>No logo</span>
                                    </div>

                                    <div
                                        onClick={() => updateDesign('logo', 'use_logo')}
                                        style={{
                                            border: currentDesign.logo === 'use_logo' ? '1.5px solid #111827' : '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            padding: '6px',
                                            cursor: 'pointer',
                                            textAlign: 'center',
                                            background: currentDesign.logo === 'use_logo' ? '#fafafa' : '#ffffff',
                                        }}
                                    >
                                        <div style={{
                                            height: '54px',
                                            border: '1px solid #f1f3f5',
                                            borderRadius: '4px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            background: '#f9fafb',
                                            color: '#2563eb',
                                            fontSize: '0.68rem',
                                            padding: '4px',
                                        }}>
                                            <ExternalLink size={12} />
                                            <span style={{ lineHeight: '1.2', marginTop: '2px' }}>Upload in gallery settings</span>
                                        </div>
                                        <span style={{ fontSize: '0.76rem', color: '#4b5563', marginTop: '4px', display: 'block' }}>Use logo</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* 2. GRID SUB-TAB (MATCHING SCREENSHOT 2) */}
                    {designSubTab === 'grid' && (
                        <>
                            <div>
                                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
                                    Grid style
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                                    {[
                                        { id: 'horizontal', label: 'Horizontal' },
                                        { id: 'vertical', label: 'Vertical' },
                                    ].map((g) => {
                                        const isSelected = currentDesign.gridStyle === g.id;
                                        return (
                                            <div
                                                key={g.id}
                                                onClick={() => updateDesign('gridStyle', g.id)}
                                                style={{
                                                    border: isSelected ? '1.5px solid #111827' : '1px solid #e5e7eb',
                                                    borderRadius: '8px',
                                                    padding: '10px',
                                                    cursor: 'pointer',
                                                    textAlign: 'center',
                                                    background: isSelected ? '#fafafa' : '#ffffff',
                                                }}
                                            >
                                                <div style={{ height: '54px', display: 'flex', flexDirection: g.id === 'horizontal' ? 'column' : 'row', gap: '4px', padding: '4px', background: '#fafbfc', borderRadius: '4px' }}>
                                                    {g.id === 'horizontal' ? (
                                                        <>
                                                            <div style={{ display: 'flex', gap: '4px', flex: 1 }}>
                                                                <div style={{ width: '40%', background: '#94a3b8', borderRadius: '2px' }} />
                                                                <div style={{ width: '60%', background: '#94a3b8', borderRadius: '2px' }} />
                                                            </div>
                                                            <div style={{ display: 'flex', gap: '4px', flex: 1 }}>
                                                                <div style={{ width: '70%', background: '#94a3b8', borderRadius: '2px' }} />
                                                                <div style={{ width: '30%', background: '#94a3b8', borderRadius: '2px' }} />
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                                                                <div style={{ height: '60%', background: '#94a3b8', borderRadius: '2px' }} />
                                                                <div style={{ height: '40%', background: '#94a3b8', borderRadius: '2px' }} />
                                                            </div>
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                                                                <div style={{ height: '40%', background: '#94a3b8', borderRadius: '2px' }} />
                                                                <div style={{ height: '60%', background: '#94a3b8', borderRadius: '2px' }} />
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                                <span style={{ fontSize: '0.8rem', fontWeight: isSelected ? '600' : '400', color: isSelected ? '#111827' : '#4b5563', marginTop: '6px', display: 'block' }}>
                                                    {g.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
                                    Thumbnail size
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                                    {[
                                        { id: 'standard', label: 'Standard', cols: 3 },
                                        { id: 'large', label: 'Large', cols: 2 },
                                    ].map((t) => {
                                        const isSelected = currentDesign.thumbnailSize === t.id;
                                        return (
                                            <div
                                                key={t.id}
                                                onClick={() => updateDesign('thumbnailSize', t.id)}
                                                style={{
                                                    border: isSelected ? '1.5px solid #111827' : '1px solid #e5e7eb',
                                                    borderRadius: '8px',
                                                    padding: '10px',
                                                    cursor: 'pointer',
                                                    textAlign: 'center',
                                                    background: isSelected ? '#fafafa' : '#ffffff',
                                                }}
                                            >
                                                <div style={{
                                                    height: '54px',
                                                    display: 'grid',
                                                    gridTemplateColumns: `repeat(${t.cols}, 1fr)`,
                                                    gap: '3px',
                                                    padding: '4px',
                                                    background: '#fafbfc',
                                                    borderRadius: '4px',
                                                }}>
                                                    {Array.from({ length: t.cols * 2 }).map((_, i) => (
                                                        <div key={i} style={{ background: '#94a3b8', borderRadius: '2px' }} />
                                                    ))}
                                                </div>
                                                <span style={{ fontSize: '0.8rem', fontWeight: isSelected ? '600' : '400', color: isSelected ? '#111827' : '#4b5563', marginTop: '6px', display: 'block' }}>
                                                    {t.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
                                    Grid spacing
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                                    {[
                                        { id: 'compact', label: 'Compact', gap: '2px' },
                                        { id: 'wide', label: 'Wide', gap: '8px' },
                                    ].map((s) => {
                                        const isSelected = currentDesign.gridSpacing === s.id;
                                        return (
                                            <div
                                                key={s.id}
                                                onClick={() => updateDesign('gridSpacing', s.id)}
                                                style={{
                                                    border: isSelected ? '1.5px solid #111827' : '1px solid #e5e7eb',
                                                    borderRadius: '8px',
                                                    padding: '10px',
                                                    cursor: 'pointer',
                                                    textAlign: 'center',
                                                    background: isSelected ? '#fafafa' : '#ffffff',
                                                }}
                                            >
                                                <div style={{
                                                    height: '54px',
                                                    display: 'grid',
                                                    gridTemplateColumns: 'repeat(2, 1fr)',
                                                    gap: s.gap,
                                                    padding: '4px',
                                                    background: '#fafbfc',
                                                    borderRadius: '4px',
                                                }}>
                                                    {Array.from({ length: 4 }).map((_, i) => (
                                                        <div key={i} style={{ background: '#94a3b8', borderRadius: '2px' }} />
                                                    ))}
                                                </div>
                                                <span style={{ fontSize: '0.8rem', fontWeight: isSelected ? '600' : '400', color: isSelected ? '#111827' : '#4b5563', marginTop: '6px', display: 'block' }}>
                                                    {s.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    )}

                    {/* 3. FONTS SUB-TAB (MATCHING SCREENSHOT 3) */}
                    {designSubTab === 'fonts' && (
                        <>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                                {[
                                    { id: 'simple', name: 'Simple', h: 'Heading', b: 'Body text', hFont: 'sans-serif', hWeight: '700' },
                                    { id: 'classic', name: 'Classic', h: 'HEADING', b: 'Body text', hFont: 'serif', hWeight: '400' },
                                    { id: 'minimal', name: 'Minimal', h: 'Heading', b: 'Body text', hFont: 'sans-serif', hWeight: '300' },
                                    { id: 'soft', name: 'Soft', h: 'Heading', b: 'Body text', hFont: 'serif', hWeight: '500' },
                                    { id: 'bold', name: 'Bold', h: 'HEADING', b: 'Body text', hFont: 'sans-serif', hWeight: '900' },
                                ].map((f) => {
                                    const isSelected = currentDesign.fontPreset === f.id;
                                    return (
                                        <div
                                            key={f.id}
                                            onClick={() => updateDesign('fontPreset', f.id)}
                                            style={{
                                                border: isSelected ? '1.5px solid #111827' : '1px solid #e5e7eb',
                                                borderRadius: '8px',
                                                padding: '16px 12px',
                                                cursor: 'pointer',
                                                background: isSelected ? '#fafafa' : '#ffffff',
                                                textAlign: 'left',
                                                boxShadow: isSelected ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
                                            }}
                                        >
                                            <div style={{
                                                fontSize: '1.05rem',
                                                fontFamily: f.hFont,
                                                fontWeight: f.hWeight,
                                                color: '#111827',
                                                marginBottom: '2px',
                                            }}>
                                                {f.h}
                                            </div>
                                            <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>
                                                {f.b}
                                            </div>
                                            <div style={{ fontSize: '0.76rem', color: '#9ca3af', marginTop: '10px' }}>
                                                {f.name}
                                            </div>
                                        </div>
                                    );
                                })}

                                <div
                                    onClick={onOpenCustomFontModal}
                                    style={{
                                        border: '1.5px dashed #3b82f6',
                                        borderRadius: '8px',
                                        padding: '16px 12px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: '#eff6ff',
                                        color: '#2563eb',
                                    }}
                                >
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', fontWeight: '600' }}>
                                        <Plus size={16} /> Select
                                    </div>
                                    <div style={{ fontSize: '0.76rem', color: '#6b7280', marginTop: '8px' }}>Custom</div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* 4. COLOR SUB-TAB (MATCHING SCREENSHOT 4) */}
                    {designSubTab === 'color' && (
                        <>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                                {Object.entries(colorPresets).map(([key, col]) => {
                                    const isSelected = currentDesign.colorPreset === key;
                                    return (
                                        <div
                                            key={key}
                                            onClick={() => updateDesign('colorPreset', key)}
                                            style={{
                                                border: isSelected ? '1.5px solid #111827' : '1px solid #e5e7eb',
                                                borderRadius: '8px',
                                                padding: '14px 10px',
                                                cursor: 'pointer',
                                                background: isSelected ? '#fafafa' : '#ffffff',
                                                textAlign: 'center',
                                                boxShadow: isSelected ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
                                            }}
                                        >
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px',
                                                marginBottom: '8px',
                                            }}>
                                                <div style={{
                                                    width: '26px',
                                                    height: '26px',
                                                    borderRadius: '50%',
                                                    background: col.circle1,
                                                    border: '1px solid #d1d5db',
                                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                                }} />
                                                <div style={{
                                                    width: '26px',
                                                    height: '26px',
                                                    borderRadius: '50%',
                                                    background: col.circle2,
                                                    border: '1px solid #d1d5db',
                                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                                }} />
                                            </div>
                                            <div style={{ fontSize: '0.82rem', fontWeight: isSelected ? '600' : '400', color: '#111827' }}>
                                                {col.title}
                                            </div>
                                        </div>
                                    );
                                })}

                                <div
                                    onClick={onOpenCustomColorModal}
                                    style={{
                                        border: '1.5px dashed #3b82f6',
                                        borderRadius: '8px',
                                        padding: '14px 10px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: '#eff6ff',
                                        color: '#2563eb',
                                    }}
                                >
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.88rem', fontWeight: '600' }}>
                                        <Plus size={16} /> Select
                                    </div>
                                    <div style={{ fontSize: '0.76rem', color: '#6b7280', marginTop: '8px' }}>Custom</div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* RIGHT LIVE PREVIEW CANVAS AREA */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '1.5rem',
                overflowY: 'auto',
            }}>
                {/* Device Mode Toggle Bar */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: '#e2e8f0',
                    borderRadius: '9999px',
                    padding: '3px',
                    marginBottom: '1.5rem',
                }}>
                    <button
                        onClick={() => updateDesign('deviceMode', 'desktop')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '5px 14px',
                            borderRadius: '9999px',
                            border: 'none',
                            background: currentDesign.deviceMode === 'desktop' ? '#ffffff' : 'transparent',
                            color: currentDesign.deviceMode === 'desktop' ? '#111827' : '#64748b',
                            fontSize: '0.78rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            boxShadow: currentDesign.deviceMode === 'desktop' ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
                        }}
                    >
                        <Monitor size={14} />
                        <span>Desktop</span>
                    </button>

                    <button
                        onClick={() => updateDesign('deviceMode', 'mobile')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '5px 14px',
                            borderRadius: '9999px',
                            border: 'none',
                            background: currentDesign.deviceMode === 'mobile' ? '#ffffff' : 'transparent',
                            color: currentDesign.deviceMode === 'mobile' ? '#111827' : '#64748b',
                            fontSize: '0.78rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            boxShadow: currentDesign.deviceMode === 'mobile' ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
                        }}
                    >
                        <Smartphone size={14} />
                        <span>Mobile</span>
                    </button>
                </div>

                {/* Rendered Live Canvas */}
                <ClientGalleryCanvas
                    selectedGallery={selectedGallery}
                    isFull={false}
                    forcedDeviceMode={currentDesign.deviceMode}
                    activeFont={activeFont}
                    activeColor={activeColor}
                    currentDesign={currentDesign}
                    allGalleryItems={allGalleryItems}
                    favorites={favorites}
                    onToggleFavorite={onToggleFavorite}
                    onOpenLightbox={onOpenLightbox}
                    onTriggerToast={onTriggerToast}
                    onOpenShare={onOpenShare}
                    onScrollToGrid={onScrollToGrid}
                />
            </div>
        </div>
    );
}
