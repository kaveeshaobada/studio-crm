import React from 'react';
import { X, CheckCircle2, Copy, Check, Lock, Mail, ExternalLink, Send, Download } from 'lucide-react';

export default function ShareGalleryModal({
    show,
    onClose,
    selectedGallery,
    shareModalTab,
    setShareModalTab,
    copiedLink,
    handleCopyShareLink,
    copiedPin,
    handleCopyPin,
    clientEmailInvite,
    setClientEmailInvite,
    clientEmailNote,
    setClientEmailNote,
    handleSendEmailInvite,
    onOpenLivePreview,
    onTriggerToast,
}) {
    if (!show || !selectedGallery) return null;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(3px)',
            zIndex: 9500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
        }}>
            <div style={{
                background: '#ffffff',
                borderRadius: '14px',
                width: '100%',
                maxWidth: '520px',
                padding: '1.75rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.28)',
            }}>
                {/* Modal Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CheckCircle2 size={16} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '700', color: '#111827' }}>
                                Share Client Gallery
                            </h3>
                            <span style={{ fontSize: '0.74rem', color: '#059669', fontWeight: '600' }}>
                                ● Published & Live
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{ background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Share Tabs: Direct Link | Email Invite | QR Code */}
                <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', marginBottom: '1.25rem' }}>
                    {[
                        { id: 'link', label: 'Direct Link' },
                        { id: 'email', label: 'Email Invite' },
                        { id: 'qr', label: 'QR Code' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setShareModalTab(tab.id)}
                            style={{
                                padding: '8px 16px',
                                border: 'none',
                                background: 'transparent',
                                fontSize: '0.84rem',
                                fontWeight: shareModalTab === tab.id ? '700' : '500',
                                color: shareModalTab === tab.id ? '#2563eb' : '#6b7280',
                                borderBottom: shareModalTab === tab.id ? '2px solid #2563eb' : '2px solid transparent',
                                cursor: 'pointer',
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* TAB 1: DIRECT LINK */}
                {shareModalTab === 'link' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                                Direct Client Link
                            </label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    readOnly
                                    value={`https://studiocrm.app/g/${selectedGallery.id || '21-collection'}`}
                                    style={{
                                        flex: 1,
                                        padding: '9px 12px',
                                        fontSize: '0.82rem',
                                        borderRadius: '6px',
                                        border: '1px solid #d1d5db',
                                        background: '#f9fafb',
                                        outline: 'none',
                                    }}
                                />
                                <button
                                    onClick={handleCopyShareLink}
                                    style={{
                                        background: '#111827',
                                        color: '#ffffff',
                                        border: 'none',
                                        borderRadius: '6px',
                                        padding: '9px 16px',
                                        fontSize: '0.82rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                    }}
                                >
                                    {copiedLink ? <Check size={14} color="#10b981" /> : <Copy size={13} />}
                                    <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                                </button>
                            </div>
                        </div>

                        {/* Download PIN Box */}
                        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ fontSize: '0.76rem', color: '#64748b' }}>Client Download PIN</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '0.12em', color: '#0f172a' }}>
                                    {selectedGallery.settings?.downloadPin || '4829'}
                                </div>
                            </div>
                            <button
                                onClick={handleCopyPin}
                                style={{
                                    background: '#ffffff',
                                    border: '1px solid #cbd5e1',
                                    borderRadius: '6px',
                                    padding: '5px 10px',
                                    fontSize: '0.76rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    color: '#334155',
                                }}
                            >
                                <Copy size={12} />
                                <span>{copiedPin ? 'Copied!' : 'Copy PIN'}</span>
                            </button>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                            <button
                                onClick={() => setShareModalTab('email')}
                                style={{
                                    background: '#f1f5f9',
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '10px',
                                    fontSize: '0.82rem',
                                    fontWeight: '600',
                                    color: '#1e293b',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px',
                                }}
                            >
                                <Mail size={14} /> Send via Email
                            </button>

                            <button
                                onClick={onOpenLivePreview}
                                style={{
                                    background: '#111827',
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '10px',
                                    fontSize: '0.82rem',
                                    fontWeight: '600',
                                    color: '#ffffff',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px',
                                }}
                            >
                                <ExternalLink size={14} /> Open Live Page
                            </button>
                        </div>
                    </div>
                )}

                {/* TAB 2: EMAIL INVITE */}
                {shareModalTab === 'email' && (
                    <form onSubmit={handleSendEmailInvite} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
                                Client Email Address *
                            </label>
                            <input
                                type="email"
                                required
                                placeholder="client@example.com"
                                value={clientEmailInvite}
                                onChange={(e) => setClientEmailInvite(e.target.value)}
                                style={{ width: '100%', padding: '9px 12px', fontSize: '0.85rem', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
                                Subject
                            </label>
                            <input
                                readOnly
                                value={`Your photo gallery is ready to view: ${selectedGallery.name}`}
                                style={{ width: '100%', padding: '9px 12px', fontSize: '0.82rem', borderRadius: '6px', border: '1px solid #d1d5db', background: '#f9fafb' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
                                Personal Message
                            </label>
                            <textarea
                                rows={3}
                                value={clientEmailNote}
                                onChange={(e) => setClientEmailNote(e.target.value)}
                                style={{ width: '100%', padding: '9px 12px', fontSize: '0.82rem', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none', resize: 'none' }}
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
                            <button
                                type="button"
                                onClick={() => setShareModalTab('link')}
                                style={{ background: 'transparent', border: 'none', color: '#4b5563', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', padding: '8px 14px' }}
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                style={{
                                    background: '#2563eb',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '9px 20px',
                                    fontSize: '0.84rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                }}
                            >
                                <Send size={13} />
                                <span>Send Invitation</span>
                            </button>
                        </div>
                    </form>
                )}

                {/* TAB 3: QR CODE */}
                {shareModalTab === 'qr' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.25rem', padding: '1rem 0' }}>
                        <div style={{
                            width: '180px',
                            height: '180px',
                            background: '#ffffff',
                            border: '2px solid #111827',
                            borderRadius: '12px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '12px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px', width: '100%', height: '100%' }}>
                                {Array.from({ length: 25 }).map((_, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            background: [0, 4, 12, 20, 24, 6, 8, 16, 18, 2, 22].includes(i) ? '#111827' : '#f1f5f9',
                                            borderRadius: '2px',
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#111827' }}>
                                Scan to View {selectedGallery.name}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '2px' }}>
                                Perfect for printing on wedding programs, reception signage, or client print cards.
                            </div>
                        </div>

                        <button
                            onClick={() => onTriggerToast('QR Code saved', 'PNG ready for print materials')}
                            style={{
                                background: '#111827',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '8px 20px',
                                fontSize: '0.82rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                            }}
                        >
                            <Download size={14} /> Download QR PNG
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
