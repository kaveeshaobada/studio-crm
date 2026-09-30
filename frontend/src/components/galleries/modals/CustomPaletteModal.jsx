import React from 'react';
import { X } from 'lucide-react';

export default function CustomPaletteModal({ show, onClose, onApplyCustomColors }) {
    if (!show) return null;

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
            <div style={{ background: '#ffffff', borderRadius: '12px', width: '100%', maxWidth: '360px', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700' }}>Custom Color Palette</h3>
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                        <X size={16} />
                    </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Canvas Background</label>
                        <input type="color" defaultValue="#fdfbf7" style={{ width: '100%', height: '36px', borderRadius: '6px', cursor: 'pointer' }} />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Primary Typography</label>
                        <input type="color" defaultValue="#1a1c1e" style={{ width: '100%', height: '36px', borderRadius: '6px', cursor: 'pointer' }} />
                    </div>
                    <button
                        onClick={() => {
                            onApplyCustomColors();
                            onClose();
                        }}
                        style={{ background: '#111827', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '8px', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', marginTop: '6px' }}
                    >
                        Apply Colors
                    </button>
                </div>
            </div>
        </div>
    );
}
