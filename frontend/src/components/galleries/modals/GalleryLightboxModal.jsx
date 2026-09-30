import React, { useEffect } from 'react';
import { X, Heart, Download } from 'lucide-react';

export default function GalleryLightboxModal({
    lightboxIndex,
    allGalleryItems = [],
    favorites = {},
    selectedGallery,
    onClose,
    onNext,
    onPrev,
    onToggleFavorite,
    onTriggerToast,
}) {
    if (lightboxIndex === null || !allGalleryItems[lightboxIndex]) return null;

    const currentItem = allGalleryItems[lightboxIndex];
    const isFavorited = !!favorites[currentItem.id];

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') onNext();
            if (e.key === 'ArrowLeft') onPrev();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, onNext, onPrev]);

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.95)',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
        }}>
            {/* Top Toolbar */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.5rem',
                color: '#ffffff',
            }}>
                <span style={{ fontSize: '0.85rem' }}>
                    {lightboxIndex + 1} of {allGalleryItems.length} • {currentItem.title || 'Photograph'}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <button
                        onClick={() => onToggleFavorite(currentItem.id)}
                        style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer' }}
                        title="Favorite"
                    >
                        <Heart size={20} fill={isFavorited ? '#ef4444' : 'none'} color={isFavorited ? '#ef4444' : '#ffffff'} />
                    </button>

                    <button
                        onClick={() => onTriggerToast('High-Res Ready', `PIN verified: ${selectedGallery?.settings?.downloadPin || '4829'}`)}
                        style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer' }}
                        title="Download"
                    >
                        <Download size={20} />
                    </button>

                    <button
                        onClick={onClose}
                        style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer' }}
                    >
                        <X size={24} />
                    </button>
                </div>
            </div>

            {/* Main Stage with Prev / Next */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <button
                    onClick={onPrev}
                    style={{
                        position: 'absolute',
                        left: '20px',
                        background: 'rgba(255,255,255,0.1)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '50%',
                        width: '44px',
                        height: '44px',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background 0.15s ease',
                    }}
                >
                    ‹
                </button>

                <img
                    src={currentItem.url}
                    alt={currentItem.title || 'Full size'}
                    style={{ maxWidth: '90%', maxHeight: '82vh', objectFit: 'contain', borderRadius: '4px' }}
                />

                <button
                    onClick={onNext}
                    style={{
                        position: 'absolute',
                        right: '20px',
                        background: 'rgba(255,255,255,0.1)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '50%',
                        width: '44px',
                        height: '44px',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background 0.15s ease',
                    }}
                >
                    ›
                </button>
            </div>
        </div>
    );
}
