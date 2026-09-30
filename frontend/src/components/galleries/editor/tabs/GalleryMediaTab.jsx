import React from 'react';
import { ChevronDown, UploadCloud, Plus } from 'lucide-react';

export default function GalleryMediaTab({
    selectedGallery,
    selectedSetId,
    setSelectedSetId,
    onUpdateGallery,
    onUploadFiles,
    onTriggerToast,
    plantCoverImg,
}) {
    if (!selectedGallery) return null;

    const currentSet = selectedGallery.sets?.find((s) => s.id === selectedSetId) || selectedGallery.sets?.[0];

    const handleCreateSet = () => {
        const setName = prompt('Enter new set name:', 'Reception');
        if (setName && setName.trim()) {
            const newSet = { id: `set-${Date.now()}`, name: setName.trim(), items: [] };
            const updated = { ...selectedGallery, sets: [...(selectedGallery.sets || []), newSet] };
            onUpdateGallery(updated);
            setSelectedSetId(newSet.id);
            onTriggerToast('Set created', `"${setName}" added`);
        }
    };

    const handleSetAsCover = (itemUrl) => {
        const updated = { ...selectedGallery, plantCover: itemUrl, coverImage: itemUrl };
        onUpdateGallery(updated);
        onTriggerToast('Cover updated', 'Set photo as gallery cover');
    };

    return (
        <div style={{ flex: 1, padding: '1.75rem 2.5rem', display: 'flex', gap: '2.5rem' }}>
            {/* Left Column: Gallery Cover & Sets */}
            <div style={{ width: '220px', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#6b7280', letterSpacing: '0.06em', marginBottom: '0.65rem' }}>
                    GALLERY COVER
                </div>
                <div
                    onClick={() => onTriggerToast('Change cover', 'Click any photo below to set as cover')}
                    style={{
                        width: '100%',
                        height: '130px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        position: 'relative',
                        background: '#f3f4f6',
                    }}
                >
                    <img
                        src={selectedGallery.plantCover || selectedGallery.coverImage || plantCoverImg}
                        alt="Gallery cover"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(0, 0, 0, 0.35)',
                            opacity: 0,
                            transition: 'opacity 0.15s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
                    >
                        Change cover
                    </div>
                </div>

                {/* SETS Section */}
                <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#6b7280', letterSpacing: '0.06em', marginTop: '1.75rem', marginBottom: '0.65rem' }}>
                    SETS
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {selectedGallery.sets?.map((s) => (
                        <button
                            key={s.id}
                            onClick={() => setSelectedSetId(s.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '7px 10px',
                                borderRadius: '6px',
                                border: 'none',
                                background: selectedSetId === s.id ? '#e5e7eb' : 'transparent',
                                color: '#111827',
                                fontSize: '0.82rem',
                                fontWeight: selectedSetId === s.id ? '600' : '500',
                                cursor: 'pointer',
                                textAlign: 'left',
                            }}
                        >
                            <span>{s.name} ({s.items?.length || 0})</span>
                        </button>
                    ))}
                    <button
                        onClick={handleCreateSet}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '7px 10px',
                            border: 'none',
                            background: 'transparent',
                            color: '#4b5563',
                            fontSize: '0.82rem',
                            cursor: 'pointer',
                            textAlign: 'left',
                            marginTop: '4px',
                        }}
                    >
                        <Plus size={14} />
                        <span>Create set</span>
                    </button>
                </div>
            </div>

            {/* Right Column: Upload Area / Photo Grid */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                        <span style={{ fontSize: '0.82rem', color: '#374151', fontWeight: '500' }}>Sort by: Custom</span>
                        <ChevronDown size={14} color="#6b7280" />
                    </div>
                    <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                        {currentSet?.items?.length || 0} items
                    </span>
                </div>

                {(!currentSet || currentSet.items.length === 0) ? (
                    <div style={{
                        flex: 1,
                        minHeight: '380px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        background: '#fafbfc',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '3rem',
                        textAlign: 'center',
                    }}>
                        <UploadCloud size={36} color="#6b7280" strokeWidth={1.5} />
                        <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1f2937', marginTop: '12px' }}>
                            Drag photos and videos to "{currentSet?.name || 'Highlights'}" set
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#9ca3af', margin: '4px 0 12px 0' }}>or</div>
                        <button
                            onClick={onUploadFiles}
                            style={{ background: 'transparent', border: 'none', color: '#2563eb', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}
                        >
                            + Upload from computer
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                onClick={onUploadFiles}
                                style={{
                                    background: '#f3f4f6',
                                    border: '1px solid #e5e7eb',
                                    color: '#111827',
                                    fontSize: '0.8rem',
                                    fontWeight: '600',
                                    borderRadius: '6px',
                                    padding: '6px 12px',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                }}
                            >
                                <Plus size={14} /> Add more media
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
                            {currentSet.items.map((item, idx) => (
                                <div
                                    key={item.id}
                                    style={{
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        position: 'relative',
                                        aspectRatio: '4/3',
                                        background: '#f3f4f6',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => handleSetAsCover(item.url)}
                                >
                                    <img src={item.url} alt={item.title || `Photo ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '6px 8px', background: 'linear-gradient(transparent, rgba(0,0,0,0.6))', color: '#ffffff', fontSize: '0.72rem', fontWeight: '500' }}>
                                        Photo #{idx + 1}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
