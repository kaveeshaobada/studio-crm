import React from 'react';
import { Heart, Download, Share2 } from 'lucide-react';
import CoverHeroLayouts from './CoverHeroLayouts';
import plantCoverImg from '../../../assets/gallery_plant_cover.jpg';

export default function ClientGalleryCanvas({
    selectedGallery,
    isFull = false,
    forcedDeviceMode = null,
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
    if (!selectedGallery) return null;

    const mode = forcedDeviceMode || currentDesign.deviceMode;
    const isMobile = mode === 'mobile';
    const gridTargetId = isFull ? 'full-grid-target' : 'preview-grid-target';
    const coverImg = selectedGallery.plantCover || selectedGallery.coverImage || plantCoverImg;
    const hasLogo = currentDesign.logo === 'use_logo';

    // Canvas container style
    const canvasContainerStyle = isFull
        ? {
            width: isMobile ? '390px' : '100%',
            maxWidth: isMobile ? '390px' : '1240px',
            margin: '0 auto',
            background: activeColor.bg,
            color: activeColor.text,
            minHeight: '100vh',
            boxShadow: isMobile ? '0 25px 50px -12px rgba(0, 0, 0, 0.4)' : 'none',
            borderRadius: isMobile ? '36px' : '0',
            border: isMobile ? '12px solid #1f2937' : 'none',
            overflow: 'hidden',
            transition: 'all 0.25s ease',
        }
        : {
            width: isMobile ? '320px' : '100%',
            maxWidth: isMobile ? '320px' : '780px',
            margin: '0 auto',
            background: activeColor.bg,
            color: activeColor.text,
            borderRadius: isMobile ? '24px' : '8px',
            border: isMobile ? '8px solid #1f2937' : '1px solid #e5e7eb',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08)',
            overflow: 'hidden',
            transition: 'all 0.25s ease',
        };

    const isLargeThumb = currentDesign.thumbnailSize === 'large';
    const isVerticalGrid = currentDesign.gridStyle === 'vertical';
    const isWideSpacing = currentDesign.gridSpacing === 'wide';

    let gridColumns;
    if (isMobile) {
        gridColumns = isLargeThumb ? '1fr' : 'repeat(2, 1fr)';
    } else if (isFull) {
        gridColumns = isLargeThumb ? 'repeat(2, 1fr)' : (isVerticalGrid ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)');
    } else {
        gridColumns = isLargeThumb ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)';
    }

    return (
        <div style={canvasContainerStyle}>
            {/* 1. HERO COVER SECTION */}
            <CoverHeroLayouts
                layout={currentDesign.coverLayout}
                coverImg={coverImg}
                selectedGallery={selectedGallery}
                hasLogo={hasLogo}
                isFull={isFull}
                isMobile={isMobile}
                activeFont={activeFont}
                activeColor={activeColor}
                onScrollToGrid={onScrollToGrid}
                gridTargetId={gridTargetId}
            />

            {/* 2. GALLERY SUB-HEADER / CLIENT TOOLBAR */}
            <div
                id={gridTargetId}
                style={{
                    padding: isFull ? '1.5rem 2.5rem 1rem 2.5rem' : '0.85rem 1.25rem 0.6rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: `1px solid ${activeColor.border}`,
                    background: activeColor.bg,
                }}
            >
                <div>
                    <div style={{
                        fontSize: isFull ? '1.15rem' : '0.88rem',
                        fontWeight: '700',
                        fontFamily: activeFont.headingFont,
                        color: activeColor.text,
                    }}>
                        {selectedGallery.name}
                    </div>
                    <div style={{
                        fontSize: isFull ? '0.78rem' : '0.68rem',
                        color: activeColor.textMuted,
                        fontFamily: activeFont.bodyFont,
                    }}>
                        {selectedGallery.project} • {allGalleryItems.length} photographs
                    </div>
                </div>

                {/* Client Interactive Actions: Favorite count, Download, Share */}
                <div style={{ display: 'flex', alignItems: 'center', gap: isFull ? '12px' : '8px' }}>
                    <button
                        onClick={() => onTriggerToast('Favorites', `${Object.values(favorites).filter(Boolean).length} items favorited`)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: activeColor.textMuted,
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.75rem',
                        }}
                        title="Favorites"
                    >
                        <Heart
                            size={isFull ? 18 : 14}
                            fill={Object.values(favorites).some(Boolean) ? '#ef4444' : 'none'}
                            color={Object.values(favorites).some(Boolean) ? '#ef4444' : activeColor.textMuted}
                        />
                        {Object.values(favorites).filter(Boolean).length > 0 && (
                            <span>{Object.values(favorites).filter(Boolean).length}</span>
                        )}
                    </button>

                    <button
                        onClick={() => onTriggerToast('Download PIN required', `Enter client PIN: ${selectedGallery.settings?.downloadPin || '4829'}`)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: activeColor.textMuted,
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                        title="Download All Photos"
                    >
                        <Download size={isFull ? 18 : 14} />
                    </button>

                    <button
                        onClick={onOpenShare}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: activeColor.textMuted,
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                        title="Share Gallery"
                    >
                        <Share2 size={isFull ? 18 : 14} />
                    </button>
                </div>
            </div>

            {/* 3. PHOTO GRID */}
            <div style={{
                padding: isFull
                    ? (isWideSpacing ? '2rem' : '1rem')
                    : (isWideSpacing ? '1rem' : '0.5rem'),
                background: activeColor.bg,
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: gridColumns,
                    gap: isWideSpacing ? (isFull ? '24px' : '12px') : (isFull ? '6px' : '3px'),
                }}>
                    {allGalleryItems.map((item, idx) => (
                        <div
                            key={item.id}
                            onClick={() => onOpenLightbox(idx)}
                            style={{
                                position: 'relative',
                                overflow: 'hidden',
                                aspectRatio: isVerticalGrid ? '3/4' : '4/3',
                                borderRadius: '4px',
                                background: '#f3f4f6',
                                cursor: 'pointer',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                            }}
                        >
                            <img
                                src={item.url}
                                alt={item.title}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    display: 'block',
                                    transition: 'transform 0.25s ease',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            />

                            {/* Hover Overlay with Actions */}
                            <div
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'linear-gradient(transparent 60%, rgba(0,0,0,0.7))',
                                    opacity: 0,
                                    transition: 'opacity 0.15s ease',
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                    justifyContent: 'space-between',
                                    padding: '8px 10px',
                                    color: '#ffffff',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                            >
                                <span style={{ fontSize: '0.72rem', fontWeight: '500' }}>#{idx + 1} {item.title || ''}</span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleFavorite(item.id);
                                    }}
                                    style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer', padding: '2px' }}
                                >
                                    <Heart size={15} fill={favorites[item.id] ? '#ef4444' : 'none'} color={favorites[item.id] ? '#ef4444' : '#ffffff'} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 4. FOOTER BRAND CREDIT */}
            <div style={{
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                borderTop: `1px solid ${activeColor.border}`,
                color: activeColor.textMuted,
                fontSize: '0.75rem',
                fontFamily: activeFont.bodyFont,
                background: activeColor.bg,
            }}>
                <div style={{ fontWeight: '600', color: activeColor.text, marginBottom: '2px' }}>
                    {selectedGallery.name} Photography Portfolio
                </div>
                <div style={{ opacity: 0.7 }}>Powered by Studio CRM Client Galleries • All rights reserved</div>
            </div>
        </div>
    );
}
