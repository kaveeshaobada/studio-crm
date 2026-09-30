import React from 'react';
import { X } from 'lucide-react';

export default function CustomFontModal({ show, onClose, onSelectCustomFont }) {
    if (!show) return null;

    const fontOptions = [
        'Cormorant Garamond',
        'Cinzel Luxury',
        'Montserrat Urban',
        'Outfit Minimal',
        'Lora Romantic',
    ];

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
            zIndex: 9600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
        }}>
            <div style={{ background: '#ffffff', borderRadius: '12px', width: '100%', maxWidth: '380px', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700' }}>Google Fonts Selection</h3>
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                        <X size={16} />
                    </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {fontOptions.map((f) => (
                        <button
                            key={f}
                            onClick={() => {
                                onSelectCustomFont(f);
                                onClose();
                            }}
                            style={{ textAlign: 'left', padding: '10px', borderRadius: '6px', border: '1px solid #e5e7eb', background: '#ffffff', fontSize: '0.9rem', cursor: 'pointer' }}
                        >
                            <div style={{ fontWeight: '700' }}>{f}</div>
                            <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>Preview headline and editorial body</div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
