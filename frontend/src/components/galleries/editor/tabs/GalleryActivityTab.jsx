import React from 'react';

export default function GalleryActivityTab({
    selectedGallery,
    favorites = {},
}) {
    if (!selectedGallery) return null;

    const favoriteCount = Object.values(favorites).filter(Boolean).length || 29;

    const defaultActivities = [
        { id: '1', text: 'Gallery published by owner', time: '10 mins ago', type: 'publish' },
        { id: '2', text: 'PIN 4829 used for full download', time: '2 hours ago', type: 'download' },
        { id: '3', text: 'Client opened mobile view', time: 'Yesterday', type: 'view' },
    ];

    const activities = selectedGallery.activity && selectedGallery.activity.length > 0
        ? selectedGallery.activity
        : defaultActivities;

    return (
        <div style={{ flex: 1, padding: '2rem 3rem', maxWidth: '880px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827', marginBottom: '1.5rem' }}>
                Gallery Analytics & Activity
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.25rem' }}>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600' }}>
                        Total Views
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#111827', marginTop: '4px' }}>
                        142
                    </div>
                </div>

                <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.25rem' }}>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600' }}>
                        Unique Visitors
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#111827', marginTop: '4px' }}>
                        38
                    </div>
                </div>

                <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.25rem' }}>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600' }}>
                        Downloads
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#111827', marginTop: '4px' }}>
                        56
                    </div>
                </div>

                <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.25rem' }}>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600' }}>
                        Favorites
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#111827', marginTop: '4px' }}>
                        {favoriteCount}
                    </div>
                </div>
            </div>

            {/* Recent Activity Log */}
            <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.25rem' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#111827', marginBottom: '1rem' }}>
                    Live Client Event Stream
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {activities.map((act) => (
                        <div
                            key={act.id}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '8px 12px',
                                background: '#f8fafc',
                                borderRadius: '6px',
                                fontSize: '0.82rem',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563eb' }} />
                                <span style={{ color: '#1e293b' }}>{act.text}</span>
                            </div>
                            <span style={{ color: '#94a3b8', fontSize: '0.74rem' }}>{act.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
