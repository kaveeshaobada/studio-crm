import React from 'react';

export default function GallerySettingsTab({
    selectedGallery,
    onUpdateGallery,
}) {
    if (!selectedGallery) return null;

    const settings = selectedGallery.settings || {};

    const handlePinChange = (e) => {
        const updated = {
            ...selectedGallery,
            settings: { ...settings, downloadPin: e.target.value },
        };
        onUpdateGallery(updated);
    };

    const handleRequireEmailChange = (e) => {
        const updated = {
            ...selectedGallery,
            settings: { ...settings, requireEmail: e.target.checked },
        };
        onUpdateGallery(updated);
    };

    const handleAllowHighResChange = (e) => {
        const updated = {
            ...selectedGallery,
            settings: { ...settings, allowHighRes: e.target.checked },
        };
        onUpdateGallery(updated);
    };

    return (
        <div style={{ flex: 1, padding: '2rem 3rem', maxWidth: '680px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827', marginBottom: '1.5rem' }}>
                Gallery Settings
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.25rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#111827', marginBottom: '6px' }}>
                        Gallery Download PIN
                    </label>
                    <p style={{ fontSize: '0.78rem', color: '#6b7280', margin: '0 0 10px 0' }}>
                        Clients must provide this 4-digit code to download high-resolution original files.
                    </p>
                    <input
                        value={settings.downloadPin || '4829'}
                        onChange={handlePinChange}
                        style={{
                            width: '140px',
                            padding: '8px 12px',
                            fontSize: '1rem',
                            fontWeight: '700',
                            letterSpacing: '0.15em',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                        }}
                    />
                </div>

                <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.25rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#111827', marginBottom: '6px' }}>
                        Client Registration & Access
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                            type="checkbox"
                            id="reqEmail"
                            checked={settings.requireEmail || false}
                            onChange={handleRequireEmailChange}
                        />
                        <label htmlFor="reqEmail" style={{ fontSize: '0.84rem', color: '#374151', cursor: 'pointer' }}>
                            Require visitors to enter their email address before accessing the gallery
                        </label>
                    </div>
                </div>

                <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.25rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#111827', marginBottom: '6px' }}>
                        Full Resolution Downloads
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                            type="checkbox"
                            id="allowHighRes"
                            checked={settings.allowHighRes !== false}
                            onChange={handleAllowHighResChange}
                        />
                        <label htmlFor="allowHighRes" style={{ fontSize: '0.84rem', color: '#374151', cursor: 'pointer' }}>
                            Allow single-photo and full collection original print-ready downloads
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
