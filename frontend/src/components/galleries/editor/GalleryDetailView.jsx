import React from 'react';
import { ArrowLeft, Eye, ChevronDown, MoreVertical } from 'lucide-react';
import GalleryDesignTab from './tabs/GalleryDesignTab';
import GalleryMediaTab from './tabs/GalleryMediaTab';
import GallerySettingsTab from './tabs/GallerySettingsTab';
import GalleryStoreTab from './tabs/GalleryStoreTab';
import GalleryActivityTab from './tabs/GalleryActivityTab';

export default function GalleryDetailView({
    selectedGallery,
    onBackToList,
    detailTab,
    setDetailTab,
    onUpdateGallery,
    onOpenFullscreenPreview,
    onOpenShareModal,
    onTriggerToast,
    // Design tab specific props
    currentDesign,
    designSubTab,
    setDesignSubTab,
    activeFont,
    activeColor,
    allGalleryItems = [],
    favorites = {},
    updateDesign,
    applyDesignTemplate,
    onNavigateToTemplates,
    onOpenCustomColorModal,
    onOpenCustomFontModal,
    onOpenLightbox,
    onToggleFavorite,
    onScrollToGrid,
    // Media tab specific props
    selectedSetId,
    setSelectedSetId,
    onUploadFiles,
    plantCoverImg,
}) {
    if (!selectedGallery) return null;

    const handlePublishClick = () => {
        const updated = {
            ...selectedGallery,
            status: 'Published',
            activity: [
                { id: `act-${Date.now()}`, text: 'Gallery published and client direct link activated', time: 'Just now', type: 'publish' },
                ...(selectedGallery.activity || []),
            ],
        };
        onUpdateGallery(updated);
        onOpenShareModal();
        onTriggerToast('Gallery Published', 'Client link is now active and ready to share');
    };

    const handleToggleStatus = () => {
        const nextStatus = selectedGallery.status === 'Published' ? 'Draft' : 'Published';
        const updated = { ...selectedGallery, status: nextStatus };
        onUpdateGallery(updated);
        onTriggerToast('Status changed', `Gallery is now marked as ${nextStatus}`);
    };

    return (
        <div style={{
            flex: 1,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            background: '#ffffff',
            boxSizing: 'border-box',
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
            overflowY: 'auto',
        }}>
            {/* 1. Detail Header Matching Screenshot */}
            <div style={{
                padding: '1.25rem 2.5rem 0.5rem 2.5rem',
                borderBottom: '1px solid #f1f3f5',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {/* Title Row with Back Arrow and Status Badge */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button
                            onClick={onBackToList}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#4b5563',
                                display: 'flex',
                                alignItems: 'center',
                                padding: '4px',
                                borderRadius: '4px',
                            }}
                            title="Back to galleries"
                        >
                            <ArrowLeft size={18} />
                        </button>

                        <h1 style={{
                            fontSize: '1.45rem',
                            fontWeight: '700',
                            color: '#111827',
                            margin: 0,
                            letterSpacing: '-0.02em',
                        }}>
                            {selectedGallery.name}
                        </h1>

                        <span style={{
                            background: selectedGallery.status === 'Published' ? '#ecfdf5' : '#f3f4f6',
                            color: selectedGallery.status === 'Published' ? '#059669' : '#4b5563',
                            fontSize: '0.74rem',
                            fontWeight: '600',
                            padding: '3px 9px',
                            borderRadius: '12px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                        }}>
                            <span style={{
                                width: '5px',
                                height: '5px',
                                borderRadius: '50%',
                                background: selectedGallery.status === 'Published' ? '#10b981' : '#9ca3af',
                            }} />
                            {selectedGallery.status}
                        </span>
                    </div>

                    {/* Top Actions: Preview, Publish/Share Button, More Options */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                            onClick={onOpenFullscreenPreview}
                            style={{
                                background: '#ffffff',
                                border: '1px solid #d1d5db',
                                color: '#374151',
                                fontSize: '0.82rem',
                                fontWeight: '600',
                                padding: '6px 14px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                            }}
                        >
                            <Eye size={14} />
                            <span>Preview</span>
                        </button>

                        {/* If Published: Show Share ▾ button matching Screenshot 1 */}
                        {selectedGallery.status === 'Published' ? (
                            <button
                                onClick={onOpenShareModal}
                                style={{
                                    background: '#111827',
                                    border: 'none',
                                    color: '#ffffff',
                                    fontSize: '0.82rem',
                                    fontWeight: '600',
                                    padding: '7px 16px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                                }}
                            >
                                <span>Share</span>
                                <ChevronDown size={14} />
                            </button>
                        ) : (
                            <button
                                onClick={handlePublishClick}
                                style={{
                                    background: '#111827',
                                    border: 'none',
                                    color: '#ffffff',
                                    fontSize: '0.82rem',
                                    fontWeight: '600',
                                    padding: '7px 16px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                }}
                            >
                                Publish
                            </button>
                        )}

                        <button
                            onClick={handleToggleStatus}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#4b5563',
                                cursor: 'pointer',
                                padding: '6px',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                            title="Toggle Draft/Publish"
                        >
                            <MoreVertical size={16} />
                        </button>
                    </div>
                </div>

                {/* Subtitle: Project name and shoot date */}
                <div style={{ fontSize: '0.82rem', color: '#6b7280', marginLeft: '30px' }}>
                    {selectedGallery.project} • {selectedGallery.shootDate}
                </div>

                {/* Tabs: Media, Design, Settings, Store, Activity */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem', marginTop: '0.5rem', marginLeft: '30px' }}>
                    {[
                        { id: 'media', label: 'Media' },
                        { id: 'design', label: 'Design' },
                        { id: 'settings', label: 'Settings' },
                        { id: 'store', label: 'Store' },
                        { id: 'activity', label: 'Activity' },
                    ].map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setDetailTab(t.id)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: detailTab === t.id ? '#111827' : '#6b7280',
                                fontWeight: detailTab === t.id ? '600' : '500',
                                fontSize: '0.85rem',
                                paddingBottom: '0.65rem',
                                borderBottom: detailTab === t.id ? '2.5px solid #2563eb' : '2.5px solid transparent',
                                cursor: 'pointer',
                                transition: 'color 0.15s ease',
                            }}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* TAB CONTENTS */}
            {detailTab === 'design' && (
                <GalleryDesignTab
                    selectedGallery={selectedGallery}
                    currentDesign={currentDesign}
                    designSubTab={designSubTab}
                    setDesignSubTab={setDesignSubTab}
                    activeFont={activeFont}
                    activeColor={activeColor}
                    allGalleryItems={allGalleryItems}
                    favorites={favorites}
                    updateDesign={updateDesign}
                    applyDesignTemplate={applyDesignTemplate}
                    onNavigateToTemplates={onNavigateToTemplates}
                    onTriggerToast={onTriggerToast}
                    onOpenCustomColorModal={onOpenCustomColorModal}
                    onOpenCustomFontModal={onOpenCustomFontModal}
                    onOpenShare={onOpenShareModal}
                    onOpenLightbox={onOpenLightbox}
                    onToggleFavorite={onToggleFavorite}
                    onScrollToGrid={onScrollToGrid}
                />
            )}

            {detailTab === 'media' && (
                <GalleryMediaTab
                    selectedGallery={selectedGallery}
                    selectedSetId={selectedSetId}
                    setSelectedSetId={setSelectedSetId}
                    onUpdateGallery={onUpdateGallery}
                    onUploadFiles={onUploadFiles}
                    onTriggerToast={onTriggerToast}
                    plantCoverImg={plantCoverImg}
                />
            )}

            {detailTab === 'settings' && (
                <GallerySettingsTab
                    selectedGallery={selectedGallery}
                    onUpdateGallery={onUpdateGallery}
                />
            )}

            {detailTab === 'store' && (
                <GalleryStoreTab selectedGallery={selectedGallery} />
            )}

            {detailTab === 'activity' && (
                <GalleryActivityTab
                    selectedGallery={selectedGallery}
                    favorites={favorites}
                />
            )}
        </div>
    );
}
