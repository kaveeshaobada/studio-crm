import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import plantCoverImg from '../../../assets/gallery_plant_cover.jpg';

export default function CoverHeroLayouts({
    layout = 'split',
    coverImg = plantCoverImg,
    selectedGallery,
    hasLogo = false,
    isFull = false,
    isMobile = false,
    activeFont,
    activeColor,
    onScrollToGrid,
    gridTargetId,
}) {
    if (!selectedGallery) return null;

    // 1. NONE LAYOUT: Clean Minimal Header
    if (layout === 'none') {
        return (
            <div style={{
                padding: isFull ? '3rem 2rem 2rem 2rem' : '1.75rem 1.25rem 1.25rem 1.25rem',
                textAlign: 'center',
                borderBottom: `1px solid ${activeColor.border}`,
                background: activeColor.heroBg,
            }}>
                {hasLogo && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
                        <div style={{ width: '22px', height: '22px', borderRadius: '4px', background: activeColor.accent, color: activeColor.btnText, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: '800' }}>
                            S
                        </div>
                        <span style={{ fontSize: '0.78rem', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase', color: activeColor.text }}>
                            STUDIO CRM
                        </span>
                    </div>
                )}
                <span style={{ fontSize: isFull ? '0.85rem' : '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: activeColor.textMuted, fontFamily: activeFont.bodyFont }}>
                    {selectedGallery.project || 'Photography'}
                </span>
                <h1 style={{
                    fontSize: isFull ? '2.8rem' : '1.8rem',
                    fontFamily: activeFont.headingFont,
                    fontWeight: activeFont.headingWeight,
                    textTransform: activeFont.headingTransform,
                    letterSpacing: activeFont.letterSpacing,
                    color: activeColor.text,
                    margin: '6px 0',
                }}>
                    {selectedGallery.name}
                </h1>
                <div style={{ fontSize: isFull ? '0.9rem' : '0.78rem', color: activeColor.textMuted, fontFamily: activeFont.bodyFont }}>
                    {selectedGallery.shootDate}
                </div>
            </div>
        );
    }

    // 2. SPLIT LAYOUT (50/50 Editorial split)
    if (layout === 'split') {
        return (
            <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                minHeight: isMobile ? 'auto' : (isFull ? '540px' : '320px'),
                background: activeColor.bg,
            }}>
                {/* Left Column: Text, Title & CTA */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: isMobile ? '2rem 1.5rem' : '2.5rem',
                    textAlign: 'center',
                }}>
                    {hasLogo && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
                            <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: activeColor.accent, color: activeColor.btnText, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', fontWeight: '800' }}>
                                S
                            </div>
                            <span style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase', color: activeColor.text }}>
                                STUDIO ARCHIVE
                            </span>
                        </div>
                    )}

                    <span style={{
                        fontSize: isFull ? '0.85rem' : '0.72rem',
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        color: activeColor.textMuted,
                        marginBottom: '6px',
                        fontFamily: activeFont.bodyFont,
                    }}>
                        {selectedGallery.project || 'Photography'}
                    </span>

                    <h1 style={{
                        fontSize: isFull ? (isMobile ? '2.4rem' : '3.6rem') : (isMobile ? '1.8rem' : '2.4rem'),
                        fontFamily: activeFont.headingFont,
                        fontWeight: activeFont.headingWeight,
                        textTransform: activeFont.headingTransform,
                        letterSpacing: activeFont.letterSpacing,
                        color: activeColor.text,
                        margin: '0 0 6px 0',
                        lineHeight: 1.1,
                    }}>
                        {selectedGallery.name}
                    </h1>

                    <span style={{
                        fontSize: isFull ? '0.88rem' : '0.75rem',
                        color: activeColor.textMuted,
                        marginBottom: '1.25rem',
                        fontFamily: activeFont.bodyFont,
                    }}>
                        {selectedGallery.shootDate}
                    </span>

                    <button
                        onClick={() => onScrollToGrid(gridTargetId)}
                        style={{
                            background: activeColor.accent,
                            color: activeColor.btnText,
                            border: 'none',
                            borderRadius: '9999px',
                            padding: isFull ? '10px 24px' : '8px 18px',
                            fontSize: isFull ? '0.82rem' : '0.72rem',
                            fontWeight: '600',
                            letterSpacing: '0.08em',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            transition: 'transform 0.15s ease',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        View Gallery
                    </button>
                </div>

                {/* Right Column: Cover Photo */}
                <div style={{
                    flex: 1,
                    height: isMobile ? '240px' : 'auto',
                    minHeight: isMobile ? '240px' : '320px',
                    background: '#e5e7eb',
                    position: 'relative',
                    overflow: 'hidden',
                }}>
                    <img
                        src={coverImg}
                        alt={selectedGallery.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                </div>
            </div>
        );
    }

    // 3. TITLE ABOVE LAYOUT
    if (layout === 'title_above') {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', background: activeColor.bg }}>
                <div style={{ padding: isFull ? '2.5rem 1.5rem 1.75rem 1.5rem' : '1.5rem 1rem 1rem 1rem', textAlign: 'center' }}>
                    {hasLogo && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                            <div style={{ width: '18px', height: '18px', borderRadius: '3px', background: activeColor.accent, color: activeColor.btnText, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.62rem', fontWeight: '800' }}>
                                S
                            </div>
                            <span style={{ fontSize: '0.72rem', fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase', color: activeColor.text }}>
                                STUDIO ARCHIVE
                            </span>
                        </div>
                    )}
                    <div style={{ fontSize: isFull ? '0.85rem' : '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: activeColor.textMuted, fontFamily: activeFont.bodyFont }}>
                        {selectedGallery.project}
                    </div>
                    <h1 style={{
                        fontSize: isFull ? '3.2rem' : '2.1rem',
                        fontFamily: activeFont.headingFont,
                        fontWeight: activeFont.headingWeight,
                        textTransform: activeFont.headingTransform,
                        letterSpacing: activeFont.letterSpacing,
                        margin: '4px 0 6px 0',
                        color: activeColor.text,
                    }}>
                        {selectedGallery.name}
                    </h1>
                    <div style={{ fontSize: isFull ? '0.88rem' : '0.75rem', color: activeColor.textMuted, marginBottom: '1rem' }}>
                        {selectedGallery.shootDate}
                    </div>
                </div>
                <div style={{ height: isFull ? '440px' : '240px', width: '100%', position: 'relative' }}>
                    <img src={coverImg} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button
                        onClick={() => onScrollToGrid(gridTargetId)}
                        style={{
                            position: 'absolute',
                            bottom: '16px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            background: activeColor.accent,
                            color: activeColor.btnText,
                            border: 'none',
                            borderRadius: '9999px',
                            padding: isFull ? '8px 20px' : '6px 14px',
                            fontSize: isFull ? '0.78rem' : '0.7rem',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            cursor: 'pointer',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.18)',
                        }}
                    >
                        View Gallery ↓
                    </button>
                </div>
            </div>
        );
    }

    // 4. TITLE BELOW LAYOUT
    if (layout === 'title_below') {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', background: activeColor.bg }}>
                <div style={{ height: isFull ? '440px' : '240px', width: '100%', position: 'relative' }}>
                    <img src={coverImg} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: isFull ? '2.5rem 1.5rem' : '1.5rem 1rem', textAlign: 'center' }}>
                    {hasLogo && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                            <div style={{ width: '18px', height: '18px', borderRadius: '3px', background: activeColor.accent, color: activeColor.btnText, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.62rem', fontWeight: '800' }}>
                                S
                            </div>
                            <span style={{ fontSize: '0.72rem', fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase', color: activeColor.text }}>
                                STUDIO ARCHIVE
                            </span>
                        </div>
                    )}
                    <h1 style={{
                        fontSize: isFull ? '3.2rem' : '2.1rem',
                        fontFamily: activeFont.headingFont,
                        fontWeight: activeFont.headingWeight,
                        textTransform: activeFont.headingTransform,
                        letterSpacing: activeFont.letterSpacing,
                        margin: '0 0 6px 0',
                        color: activeColor.text,
                    }}>
                        {selectedGallery.name}
                    </h1>
                    <div style={{ fontSize: isFull ? '0.88rem' : '0.75rem', color: activeColor.textMuted, marginBottom: '1.25rem' }}>
                        {selectedGallery.project} • {selectedGallery.shootDate}
                    </div>
                    <button
                        onClick={() => onScrollToGrid(gridTargetId)}
                        style={{
                            background: activeColor.accent,
                            color: activeColor.btnText,
                            border: 'none',
                            borderRadius: '9999px',
                            padding: isFull ? '10px 24px' : '8px 16px',
                            fontSize: isFull ? '0.8rem' : '0.72rem',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            cursor: 'pointer',
                        }}
                    >
                        View Gallery
                    </button>
                </div>
            </div>
        );
    }

    // 5. EDITORIAL 1 (Asymmetric magazine journal layout)
    if (layout === 'editorial_1') {
        return (
            <div style={{
                padding: isFull ? '3.5rem 3rem' : '1.75rem 1.25rem',
                background: activeColor.bg,
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: 'center',
                gap: isFull ? '3.5rem' : '1.5rem',
            }}>
                {/* Left: Magazine Typography & Issue Badge */}
                <div style={{ flex: 1, textAlign: isMobile ? 'center' : 'left' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: activeColor.heroBg,
                        border: `1px solid ${activeColor.border}`,
                        padding: '3px 10px',
                        borderRadius: '9999px',
                        fontSize: isFull ? '0.74rem' : '0.64rem',
                        fontWeight: '700',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: activeColor.textMuted,
                        marginBottom: '1rem',
                    }}>
                        <Sparkles size={11} color={activeColor.accent} />
                        <span>Issue 21 • Volume 01</span>
                    </div>

                    <h1 style={{
                        fontSize: isFull ? (isMobile ? '2.5rem' : '4rem') : '2.2rem',
                        fontFamily: activeFont.headingFont,
                        fontWeight: activeFont.headingWeight,
                        textTransform: activeFont.headingTransform,
                        letterSpacing: activeFont.letterSpacing,
                        color: activeColor.text,
                        margin: '0 0 12px 0',
                        lineHeight: 1.05,
                    }}>
                        {selectedGallery.name}
                    </h1>

                    <p style={{
                        fontSize: isFull ? '0.95rem' : '0.78rem',
                        color: activeColor.textMuted,
                        lineHeight: 1.6,
                        margin: '0 0 1.5rem 0',
                        maxWidth: '420px',
                        fontFamily: activeFont.bodyFont,
                    }}>
                        A visual journal curated with love. Capture date {selectedGallery.shootDate}. Curated by Studio CRM.
                    </p>

                    <button
                        onClick={() => onScrollToGrid(gridTargetId)}
                        style={{
                            background: activeColor.accent,
                            color: activeColor.btnText,
                            border: 'none',
                            borderRadius: '9999px',
                            padding: isFull ? '11px 26px' : '8px 18px',
                            fontSize: isFull ? '0.82rem' : '0.72rem',
                            fontWeight: '600',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                        }}
                    >
                        <span>View Story</span>
                        <ArrowRight size={14} />
                    </button>
                </div>

                {/* Right: Offset Vertical Photo Card */}
                <div style={{
                    flex: 1,
                    width: isMobile ? '100%' : 'auto',
                    maxWidth: isMobile ? '100%' : '440px',
                    height: isFull ? '460px' : '260px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 20px 35px -10px rgba(0,0,0,0.15)',
                    position: 'relative',
                }}>
                    <img src={coverImg} alt="Editorial Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{
                        position: 'absolute',
                        bottom: '12px',
                        right: '12px',
                        background: 'rgba(0,0,0,0.65)',
                        backdropFilter: 'blur(6px)',
                        color: '#ffffff',
                        padding: '4px 10px',
                        borderRadius: '4px',
                        fontSize: '0.68rem',
                        fontWeight: '600',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                    }}>
                        {selectedGallery.shootDate}
                    </div>
                </div>
            </div>
        );
    }

    // 6. EDITORIAL 2 (Minimalist architecture journal layout)
    if (layout === 'editorial_2') {
        return (
            <div style={{ position: 'relative', width: '100%', height: isFull ? '500px' : '270px', overflow: 'hidden' }}>
                <img src={coverImg} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)',
                }} />

                {/* Floating Corner Card */}
                <div style={{
                    position: 'absolute',
                    bottom: isFull ? '32px' : '16px',
                    left: isFull ? '32px' : '16px',
                    background: 'rgba(255, 255, 255, 0.94)',
                    backdropFilter: 'blur(8px)',
                    padding: isFull ? '20px 28px' : '12px 18px',
                    borderRadius: '8px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                    maxWidth: isFull ? '380px' : '260px',
                }}>
                    <span style={{ fontSize: isFull ? '0.76rem' : '0.66rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: '600' }}>
                        {selectedGallery.project} • Journal
                    </span>
                    <h2 style={{
                        fontSize: isFull ? '2rem' : '1.3rem',
                        fontWeight: activeFont.headingWeight,
                        fontFamily: activeFont.headingFont,
                        color: '#111827',
                        margin: '4px 0',
                    }}>
                        {selectedGallery.name}
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                        <span style={{ fontSize: isFull ? '0.8rem' : '0.7rem', color: '#4b5563' }}>{selectedGallery.shootDate}</span>
                        <button
                            onClick={() => onScrollToGrid(gridTargetId)}
                            style={{
                                background: '#111827',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '9999px',
                                padding: '5px 14px',
                                fontSize: isFull ? '0.74rem' : '0.66rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                textTransform: 'uppercase',
                            }}
                        >
                            Enter
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 7. FRAMED LAYOUT (Museum-quality passe-partout mat border)
    if (layout === 'framed') {
        return (
            <div style={{
                padding: isFull ? (isMobile ? '1.5rem' : '3.5rem') : '1.25rem',
                background: activeColor.heroBg,
                borderBottom: `1px solid ${activeColor.border}`,
            }}>
                <div style={{
                    background: activeColor.cardBg,
                    border: `1px solid ${activeColor.border}`,
                    borderRadius: '6px',
                    padding: isFull ? '2.5rem 2.5rem 2rem 2.5rem' : '1.25rem 1.25rem 1rem 1.25rem',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                    maxWidth: isFull ? '840px' : '100%',
                    margin: '0 auto',
                }}>
                    <div style={{
                        height: isFull ? '380px' : '190px',
                        width: '100%',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.08)',
                    }}>
                        <img src={coverImg} alt="Framed Print" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>

                    <div style={{ textAlign: 'center', marginTop: isFull ? '1.75rem' : '1rem' }}>
                        <h2 style={{
                            fontSize: isFull ? '2.2rem' : '1.4rem',
                            fontFamily: activeFont.headingFont,
                            fontWeight: activeFont.headingWeight,
                            textTransform: activeFont.headingTransform,
                            letterSpacing: activeFont.letterSpacing,
                            color: activeColor.text,
                            margin: '0 0 4px 0',
                        }}>
                            {selectedGallery.name}
                        </h2>
                        <div style={{ fontSize: isFull ? '0.85rem' : '0.72rem', color: activeColor.textMuted, fontStyle: 'italic', marginBottom: '1rem' }}>
                            Archival Fine Art Collection • {selectedGallery.shootDate}
                        </div>
                        <button
                            onClick={() => onScrollToGrid(gridTargetId)}
                            style={{
                                background: activeColor.accent,
                                color: activeColor.btnText,
                                border: 'none',
                                borderRadius: '9999px',
                                padding: isFull ? '8px 22px' : '6px 14px',
                                fontSize: isFull ? '0.76rem' : '0.68rem',
                                fontWeight: '600',
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                            }}
                        >
                            View Collection
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 8. MODERN LAYOUT (Contemporary glass floating card on full-bleed)
    if (layout === 'modern') {
        return (
            <div style={{
                height: isFull ? '520px' : '290px',
                position: 'relative',
                width: '100%',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <img src={coverImg} alt="Modern Cover" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)' }} />

                <div style={{
                    position: 'relative',
                    zIndex: 2,
                    background: 'rgba(255, 255, 255, 0.82)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.6)',
                    borderRadius: '16px',
                    padding: isFull ? '2.5rem 3.5rem' : '1.5rem 2rem',
                    textAlign: 'center',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    maxWidth: isFull ? '540px' : '320px',
                }}>
                    <span style={{ fontSize: isFull ? '0.78rem' : '0.66rem', fontWeight: '700', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#4b5563' }}>
                        {selectedGallery.project}
                    </span>
                    <h1 style={{
                        fontSize: isFull ? '3.2rem' : '1.9rem',
                        fontFamily: activeFont.headingFont,
                        fontWeight: activeFont.headingWeight,
                        textTransform: activeFont.headingTransform,
                        letterSpacing: activeFont.letterSpacing,
                        color: '#111827',
                        margin: '4px 0 8px 0',
                    }}>
                        {selectedGallery.name}
                    </h1>
                    <div style={{ fontSize: isFull ? '0.88rem' : '0.75rem', color: '#6b7280', marginBottom: '1.25rem' }}>
                        {selectedGallery.shootDate}
                    </div>
                    <button
                        onClick={() => onScrollToGrid(gridTargetId)}
                        style={{
                            background: '#111827',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '9999px',
                            padding: isFull ? '9px 24px' : '7px 16px',
                            fontSize: isFull ? '0.8rem' : '0.7rem',
                            fontWeight: '600',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                        }}
                    >
                        Open Gallery
                    </button>
                </div>
            </div>
        );
    }

    // 9. OVERLAY LAYOUT (Light airy gradient scrim)
    if (layout === 'overlay') {
        return (
            <div style={{
                height: isFull ? '520px' : '280px',
                position: 'relative',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <img src={coverImg} alt="Cover" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.7) 60%, rgba(255,255,255,0.92) 100%)',
                }} />
                <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', color: '#111827', padding: '1.5rem' }}>
                    <span style={{ fontSize: isFull ? '0.85rem' : '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#4b5563', fontWeight: '600' }}>
                        {selectedGallery.project}
                    </span>
                    <h1 style={{
                        fontSize: isFull ? '3.5rem' : '2.1rem',
                        fontFamily: activeFont.headingFont,
                        fontWeight: activeFont.headingWeight,
                        textTransform: activeFont.headingTransform,
                        letterSpacing: activeFont.letterSpacing,
                        color: '#111827',
                        margin: '4px 0 6px 0',
                    }}>
                        {selectedGallery.name}
                    </h1>
                    <div style={{ fontSize: isFull ? '0.9rem' : '0.78rem', color: '#4b5563', marginBottom: '1.25rem' }}>
                        {selectedGallery.shootDate}
                    </div>
                    <button
                        onClick={() => onScrollToGrid(gridTargetId)}
                        style={{
                            background: '#111827',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '9999px',
                            padding: isFull ? '10px 24px' : '7px 18px',
                            fontSize: isFull ? '0.8rem' : '0.7rem',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            cursor: 'pointer',
                        }}
                    >
                        View Gallery
                    </button>
                </div>
            </div>
        );
    }

    // 10. DARK OVERLAY LAYOUT (Moody cinematic dark vignette)
    if (layout === 'dark_overlay') {
        return (
            <div style={{
                height: isFull ? '540px' : '290px',
                position: 'relative',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <img src={coverImg} alt="Cover" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.65) 60%, rgba(0,0,0,0.92) 100%)',
                }} />
                <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', color: '#ffffff', padding: '1.5rem' }}>
                    <span style={{ fontSize: isFull ? '0.85rem' : '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#cbd5e1', fontWeight: '500' }}>
                        {selectedGallery.project}
                    </span>
                    <h1 style={{
                        fontSize: isFull ? '3.8rem' : '2.2rem',
                        fontFamily: activeFont.headingFont,
                        fontWeight: activeFont.headingWeight,
                        textTransform: activeFont.headingTransform,
                        letterSpacing: activeFont.letterSpacing,
                        color: '#ffffff',
                        margin: '4px 0 8px 0',
                        textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                    }}>
                        {selectedGallery.name}
                    </h1>
                    <div style={{ fontSize: isFull ? '0.9rem' : '0.78rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
                        {selectedGallery.shootDate}
                    </div>
                    <button
                        onClick={() => onScrollToGrid(gridTargetId)}
                        style={{
                            background: '#ffffff',
                            color: '#111827',
                            border: 'none',
                            borderRadius: '9999px',
                            padding: isFull ? '10px 24px' : '8px 18px',
                            fontSize: isFull ? '0.8rem' : '0.7rem',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            cursor: 'pointer',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                        }}
                    >
                        View Gallery
                    </button>
                </div>
            </div>
        );
    }

    return null;
}
