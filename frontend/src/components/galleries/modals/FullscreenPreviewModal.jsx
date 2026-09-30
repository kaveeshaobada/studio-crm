import React from 'react';
import { Eye, Monitor, Smartphone, Share2, X } from 'lucide-react';
import ClientGalleryCanvas from '../canvas/ClientGalleryCanvas';

export default function FullscreenPreviewModal({
    show,
    onClose,
    selectedGallery,
    previewDeviceMode,
    setPreviewDeviceMode,
    activeFont,
    activeColor,
    currentDesign,
    allGalleryItems = [],
    favorites = {},
    onToggleFavorite,
    onOpenLightbox,
    onTriggerToast,
    onOpenShare,
    onScrollToGrid,
}) {
    if (!show || !selectedGallery) return null;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: '#0f172a',
            zIndex: 9000,
            display: 'flex',
            flexDirection: 'column',
        }}>
            {/* Top Bar with Device Mode Selector & Close */}
            <div style={{
                height: '52px',
                background: '#1e293b',
                borderBottom: '1px solid #334155',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 1.5rem',
                color: '#ffffff',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Eye size={16} color="#38bdf8" />
                    <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Client Live Preview</span>
                    <span style={{ fontSize: '0.72rem', background: '#334155', padding: '2px 8px', borderRadius: '10px' }}>
                        {selectedGallery.name}
                    </span>
                </div>

                {/* Device Mode Toggle inside Preview */}
                <div style={{ display: 'flex', alignItems: 'center', background: '#0f172a', borderRadius: '9999px', padding: '2px' }}>
                    <button
                        onClick={() => setPreviewDeviceMode('desktop')}
                        style={{
                            background: previewDeviceMode === 'desktop' ? '#334155' : 'transparent',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '9999px',
                            padding: '4px 12px',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                        }}
                    >
                        <Monitor size={12} /> Desktop
                    </button>
                    <button
                        onClick={() => setPreviewDeviceMode('mobile')}
                        style={{
                            background: previewDeviceMode === 'mobile' ? '#334155' : 'transparent',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '9999px',
                            padding: '4px 12px',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                        }}
                    >
                        <Smartphone size={12} /> Mobile
                    </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                        onClick={onOpenShare}
                        style={{
                            background: '#38bdf8',
                            color: '#0f172a',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '5px 12px',
                            fontSize: '0.78rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                        }}
                    >
                        <Share2 size={13} />
                        <span>Share</span>
                    </button>

                    <button
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.82rem',
                            padding: '4px 8px',
                        }}
                    >
                        <X size={18} />
                        <span>Close</span>
                    </button>
                </div>
            </div>

            {/* Scrollable Viewport */}
            <div style={{ flex: 1, overflowY: 'auto', padding: previewDeviceMode === 'mobile' ? '2rem 0' : '0' }}>
                <ClientGalleryCanvas
                    selectedGallery={selectedGallery}
                    isFull={true}
                    forcedDeviceMode={previewDeviceMode}
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
