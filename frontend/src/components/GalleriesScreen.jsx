import React, { useState, useEffect } from 'react';
import plantCoverImg from '../assets/gallery_plant_cover.jpg';
import editorialModelImg from '../assets/gallery_editorial_model.jpg';
import archInteriorImg from '../assets/gallery_interior_arch.jpg';
import coupleImg from '../assets/gallery_couple.jpg';
import { CheckCircle2, X } from 'lucide-react';

import {
    getInitialGalleries,
    designTemplates,
    fontPresets,
    colorPresets,
} from './galleries/constants/galleryPresets';

import GalleriesDirectory from './galleries/directory/GalleriesDirectory';
import GalleryDetailView from './galleries/editor/GalleryDetailView';

import CreateGalleryModal from './galleries/modals/CreateGalleryModal';
import ShareGalleryModal from './galleries/modals/ShareGalleryModal';
import FullscreenPreviewModal from './galleries/modals/FullscreenPreviewModal';
import GalleryLightboxModal from './galleries/modals/GalleryLightboxModal';
import CustomPaletteModal from './galleries/modals/CustomPaletteModal';
import CustomFontModal from './galleries/modals/CustomFontModal';

export default function GalleriesScreen({
    projects = [],
    initialCategory = 'all',
    onNavigateToPipeline,
}) {
    // 1. Core State
    const [galleries, setGalleries] = useState(getInitialGalleries);
    const [selectedGallery, setSelectedGallery] = useState(null);
    const [view, setView] = useState('list'); // 'list' | 'detail'
    const [detailTab, setDetailTab] = useState('design'); // 'media' | 'design' | 'settings' | 'store' | 'activity'
    const [activeSidebarCategory, setActiveSidebarCategory] = useState(initialCategory); // 'all' | 'starred' | 'templates'
    const [templateFilterCategory, setTemplateFilterCategory] = useState('ALL');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

    // 2. Editor Design State
    const [designSubTab, setDesignSubTab] = useState('cover'); // 'cover' | 'grid' | 'typography' | 'color'
    const [selectedSetId, setSelectedSetId] = useState('set-highlights');
    const [favorites, setFavorites] = useState({});

    // 3. Modals State
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showFullscreenPreview, setShowFullscreenPreview] = useState(false);
    const [previewDeviceMode, setPreviewDeviceMode] = useState('desktop');
    const [lightboxIndex, setLightboxIndex] = useState(null);
    const [showCustomPaletteModal, setShowCustomPaletteModal] = useState(false);
    const [showCustomFontModal, setShowCustomFontModal] = useState(false);

    // 4. Modal Form State
    const [newGalleryProject, setNewGalleryProject] = useState(projects[0]?.name || '21');
    const [newGalleryName, setNewGalleryName] = useState('21');
    const [newGalleryShootDate, setNewGalleryShootDate] = useState('Sep 17, 2026');
    const [newGalleryTemplate, setNewGalleryTemplate] = useState('editorial_vogue');

    // 5. Share Modal State
    const [shareModalTab, setShareModalTab] = useState('link');
    const [copiedLink, setCopiedLink] = useState(false);
    const [copiedPin, setCopiedPin] = useState(false);
    const [clientEmailInvite, setClientEmailInvite] = useState('');
    const [clientEmailNote, setClientEmailNote] = useState('Hi! Your complete high-resolution photo collection is ready to view and download.');

    // 6. Toast Notification State
    const [toast, setToast] = useState({ show: false, title: '', message: '' });

    const triggerToast = (title, message) => {
        setToast({ show: true, title, message });
        setTimeout(() => {
            setToast((prev) => ({ ...prev, show: false }));
        }, 3200);
    };

    // Keep activeSidebarCategory in sync if parent prop changes
    useEffect(() => {
        if (initialCategory) {
            setActiveSidebarCategory(initialCategory);
        }
    }, [initialCategory]);

    // Derived design tokens for selected gallery
    const currentDesign = selectedGallery?.design || {
        coverLayout: 'split',
        logo: 'none',
        gridStyle: 'horizontal',
        thumbnailSize: 'standard',
        gridSpacing: 'compact',
        fontPreset: 'simple',
        colorPreset: 'air',
        deviceMode: 'desktop',
    };

    const activeFont = fontPresets[currentDesign.fontPreset] || fontPresets.simple;
    const activeColor = colorPresets[currentDesign.colorPreset] || colorPresets.air;

    const allGalleryItems = selectedGallery?.sets?.flatMap((s) => s.items) || [];

    // Handlers
    const updateDesign = (key, value) => {
        if (!selectedGallery) return;
        const updated = {
            ...selectedGallery,
            design: {
                ...selectedGallery.design,
                [key]: value,
            },
        };
        setSelectedGallery(updated);
        setGalleries((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
    };

    const applyDesignTemplate = (template) => {
        if (!selectedGallery) return;
        const updated = {
            ...selectedGallery,
            coverImage: template.coverImage || selectedGallery.coverImage,
            plantCover: template.coverImage || selectedGallery.plantCover,
            design: {
                ...selectedGallery.design,
                coverLayout: template.coverLayout,
                gridStyle: template.gridStyle,
                thumbnailSize: template.thumbnailSize,
                gridSpacing: template.gridSpacing,
                fontPreset: template.fontPreset,
                colorPreset: template.colorPreset,
                logo: template.logo || selectedGallery.design?.logo || 'none',
            },
        };
        setSelectedGallery(updated);
        setGalleries((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
        triggerToast('Template applied', `Theme set to "${template.name}"`);
    };

    const handleCreateGallery = (e) => {
        if (e) e.preventDefault();
        const galleryName = newGalleryName.trim() || 'New Collection';
        const tpl = designTemplates.find((t) => t.id === newGalleryTemplate) || designTemplates[0];

        const newGal = {
            id: `gal-${Date.now()}`,
            name: galleryName,
            project: newGalleryProject || 'Photography',
            shootDate: newGalleryShootDate || 'Today',
            status: 'Draft',
            starred: false,
            templateId: tpl.id,
            coverImage: tpl.coverImage || plantCoverImg,
            plantCover: tpl.coverImage || plantCoverImg,
            design: {
                coverLayout: tpl.coverLayout,
                logo: 'none',
                gridStyle: tpl.gridStyle,
                thumbnailSize: tpl.thumbnailSize,
                gridSpacing: tpl.gridSpacing,
                fontPreset: tpl.fontPreset,
                colorPreset: tpl.colorPreset,
                deviceMode: 'desktop',
            },
            sets: [
                {
                    id: 'set-highlights',
                    name: 'Highlights',
                    items: [
                        { id: `item-${Date.now()}-1`, url: tpl.coverImage, title: 'Hero Showcase' },
                        { id: `item-${Date.now()}-2`, url: archInteriorImg, title: 'Architecture Detail' },
                        { id: `item-${Date.now()}-3`, url: coupleImg, title: 'Golden Hour Portrait' },
                    ],
                },
            ],
            settings: {
                downloadPin: Math.floor(1000 + Math.random() * 9000).toString(),
                requireEmail: false,
                allowHighRes: true,
            },
            activity: [
                { id: `act-${Date.now()}`, text: 'Gallery created with template', time: 'Just now', type: 'create' },
            ],
        };

        setGalleries([newGal, ...galleries]);
        setSelectedGallery(newGal);
        setShowCreateModal(false);
        setView('detail');
        setDetailTab('design');
        triggerToast('Gallery created', `${galleryName} is ready to design`);
    };

    const handleCreateFromTemplate = (template, directPublish = false) => {
        const galName = `${template.name} Collection`;
        const newGal = {
            id: `gal-${Date.now()}`,
            name: galName,
            project: 'Fine Art Portfolio',
            shootDate: 'Today',
            status: directPublish ? 'Published' : 'Draft',
            starred: false,
            templateId: template.id,
            coverImage: template.coverImage,
            plantCover: template.coverImage,
            design: {
                coverLayout: template.coverLayout,
                logo: template.logo || 'none',
                gridStyle: template.gridStyle,
                thumbnailSize: template.thumbnailSize,
                gridSpacing: template.gridSpacing,
                fontPreset: template.fontPreset,
                colorPreset: template.colorPreset,
                deviceMode: 'desktop',
            },
            sets: [
                {
                    id: 'set-highlights',
                    name: 'Highlights',
                    items: [
                        { id: `item-${Date.now()}-1`, url: template.coverImage, title: 'Editorial Feature' },
                        { id: `item-${Date.now()}-2`, url: editorialModelImg, title: 'Vogue Portrait' },
                        { id: `item-${Date.now()}-3`, url: archInteriorImg, title: 'Minimalist Interior' },
                        { id: `item-${Date.now()}-4`, url: coupleImg, title: 'Couple Walk' },
                    ],
                },
            ],
            settings: {
                downloadPin: '4829',
                requireEmail: false,
                allowHighRes: true,
            },
            activity: [
                { id: `act-${Date.now()}`, text: directPublish ? 'Published immediately via template' : 'Draft created from template', time: 'Just now', type: directPublish ? 'publish' : 'create' },
            ],
        };

        setGalleries([newGal, ...galleries]);
        setSelectedGallery(newGal);
        setView('detail');
        setDetailTab('design');

        if (directPublish) {
            setShowShareModal(true);
            triggerToast('Template Published', `"${galName}" is live and ready to share!`);
        } else {
            triggerToast('Template loaded', `"${galName}" created in editor`);
        }
    };

    const handlePreviewTemplate = (template) => {
        const mockGallery = {
            id: `temp-preview-${template.id}`,
            name: template.name,
            project: `${template.category} Photography`,
            shootDate: 'Autumn 2026',
            status: 'Published',
            starred: true,
            coverImage: template.coverImage,
            plantCover: template.coverImage,
            design: {
                coverLayout: template.coverLayout,
                logo: template.logo || 'none',
                gridStyle: template.gridStyle,
                thumbnailSize: template.thumbnailSize,
                gridSpacing: template.gridSpacing,
                fontPreset: template.fontPreset,
                colorPreset: template.colorPreset,
                deviceMode: 'desktop',
            },
            sets: [
                {
                    id: 'set-demo',
                    name: 'Highlights',
                    items: (template.samplePhotos || [template.coverImage, coupleImg, archInteriorImg, editorialModelImg]).map((url, i) => ({
                        id: `demo-${i}`,
                        url,
                        title: `Art Piece ${i + 1}`,
                    })),
                },
            ],
            settings: {
                downloadPin: '4829',
                requireEmail: false,
                allowHighRes: true,
            },
        };
        setSelectedGallery(mockGallery);
        setShowFullscreenPreview(true);
    };

    const handleUploadFiles = () => {
        if (!selectedGallery) return;
        const newItems = [
            { id: `item-${Date.now()}-1`, url: editorialModelImg, title: 'Portrait Editorial' },
            { id: `item-${Date.now()}-2`, url: archInteriorImg, title: 'Interior Architecture' },
            { id: `item-${Date.now()}-3`, url: coupleImg, title: 'Sunset Couple Walk' },
        ];

        const updated = {
            ...selectedGallery,
            sets: (selectedGallery.sets || []).map((s) =>
                s.id === selectedSetId ? { ...s, items: [...(s.items || []), ...newItems] } : s
            ),
            activity: [
                { id: `act-${Date.now()}`, text: `${newItems.length} photos uploaded to set`, time: 'Just now', type: 'upload' },
                ...(selectedGallery.activity || []),
            ],
        };

        setSelectedGallery(updated);
        setGalleries((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
        triggerToast('Upload complete', `${newItems.length} photos added to set`);
    };

    const handleCopyShareLink = () => {
        const link = `https://studiocrm.app/g/${selectedGallery?.id || 'collection'}`;
        navigator.clipboard?.writeText(link);
        setCopiedLink(true);
        triggerToast('Link copied', 'Client direct link copied to clipboard');
        setTimeout(() => setCopiedLink(false), 2200);
    };

    const handleCopyPin = () => {
        const pin = selectedGallery?.settings?.downloadPin || '4829';
        navigator.clipboard?.writeText(pin);
        setCopiedPin(true);
        triggerToast('PIN copied', `Download PIN ${pin} copied to clipboard`);
        setTimeout(() => setCopiedPin(false), 2200);
    };

    const handleSendEmailInvite = (e) => {
        if (e) e.preventDefault();
        if (!clientEmailInvite || !clientEmailInvite.trim()) {
            triggerToast('Missing email', 'Please provide a valid client email');
            return;
        }
        const updated = {
            ...selectedGallery,
            activity: [
                { id: `act-${Date.now()}`, text: `Email invitation sent to ${clientEmailInvite}`, time: 'Just now', type: 'email' },
                ...(selectedGallery.activity || []),
            ],
        };
        setSelectedGallery(updated);
        setGalleries((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
        setShowShareModal(false);
        setClientEmailInvite('');
        triggerToast('Invitation Sent', `Client gallery access sent to ${clientEmailInvite}`);
    };

    const handleUpdateGallery = (updated) => {
        setSelectedGallery(updated);
        setGalleries((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
    };

    const handleDeleteGallery = (gal) => {
        if (window.confirm(`Delete gallery "${gal.name}"?`)) {
            setGalleries((prev) => prev.filter((item) => item.id !== gal.id));
            if (selectedGallery?.id === gal.id) {
                setSelectedGallery(null);
                setView('list');
            }
            triggerToast('Gallery deleted', `${gal.name} was removed`);
        }
    };

    return (
        <div style={{ flex: 1, width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* VIEW 1: DETAIL VIEW */}
            {view === 'detail' && selectedGallery ? (
                <GalleryDetailView
                    selectedGallery={selectedGallery}
                    onBackToList={() => setView('list')}
                    detailTab={detailTab}
                    setDetailTab={setDetailTab}
                    onUpdateGallery={handleUpdateGallery}
                    onOpenFullscreenPreview={() => setShowFullscreenPreview(true)}
                    onOpenShareModal={() => setShowShareModal(true)}
                    onTriggerToast={triggerToast}
                    // Design props
                    currentDesign={currentDesign}
                    designSubTab={designSubTab}
                    setDesignSubTab={setDesignSubTab}
                    activeFont={activeFont}
                    activeColor={activeColor}
                    allGalleryItems={allGalleryItems}
                    favorites={favorites}
                    updateDesign={updateDesign}
                    applyDesignTemplate={applyDesignTemplate}
                    onNavigateToTemplates={() => {
                        setView('list');
                        setActiveSidebarCategory('templates');
                    }}
                    onOpenCustomColorModal={() => setShowCustomPaletteModal(true)}
                    onOpenCustomFontModal={() => setShowCustomFontModal(true)}
                    onOpenLightbox={(idx) => setLightboxIndex(idx)}
                    onToggleFavorite={(id) => setFavorites((prev) => ({ ...prev, [id]: !prev[id] }))}
                    onScrollToGrid={() => {
                        const el = document.getElementById('client-gallery-grid-anchor');
                        el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    // Media props
                    selectedSetId={selectedSetId}
                    setSelectedSetId={setSelectedSetId}
                    onUploadFiles={handleUploadFiles}
                    plantCoverImg={plantCoverImg}
                />
            ) : (
                /* VIEW 2: DIRECTORY VIEW (MY GALLERIES / DESIGN TEMPLATES) */
                <GalleriesDirectory
                    galleries={galleries}
                    activeSidebarCategory={activeSidebarCategory}
                    setActiveSidebarCategory={setActiveSidebarCategory}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    templateFilterCategory={templateFilterCategory}
                    setTemplateFilterCategory={setTemplateFilterCategory}
                    onOpenCreateModal={() => setShowCreateModal(true)}
                    onSelectGallery={(gal) => {
                        setSelectedGallery(gal);
                        setSelectedSetId(gal.sets?.[0]?.id || 'set-highlights');
                        setView('detail');
                        setDetailTab('design');
                    }}
                    onPreviewGallery={(gal) => {
                        setSelectedGallery(gal);
                        setShowFullscreenPreview(true);
                    }}
                    onShareGallery={(gal) => {
                        setSelectedGallery(gal);
                        setShowShareModal(true);
                    }}
                    onDeleteGallery={handleDeleteGallery}
                    onPreviewTemplate={handlePreviewTemplate}
                    onCreateFromTemplate={handleCreateFromTemplate}
                    onTriggerToast={triggerToast}
                    plantCoverImg={plantCoverImg}
                />
            )}

            {/* MODAL: CREATE GALLERY */}
            <CreateGalleryModal
                show={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleCreateGallery}
                projects={projects}
                newGalleryProject={newGalleryProject}
                setNewGalleryProject={setNewGalleryProject}
                newGalleryName={newGalleryName}
                setNewGalleryName={setNewGalleryName}
                newGalleryShootDate={newGalleryShootDate}
                setNewGalleryShootDate={setNewGalleryShootDate}
                newGalleryTemplate={newGalleryTemplate}
                setNewGalleryTemplate={setNewGalleryTemplate}
            />

            {/* MODAL: SHARE & PUBLISH */}
            <ShareGalleryModal
                show={showShareModal}
                onClose={() => setShowShareModal(false)}
                selectedGallery={selectedGallery}
                shareModalTab={shareModalTab}
                setShareModalTab={setShareModalTab}
                copiedLink={copiedLink}
                handleCopyShareLink={handleCopyShareLink}
                copiedPin={copiedPin}
                handleCopyPin={handleCopyPin}
                clientEmailInvite={clientEmailInvite}
                setClientEmailInvite={setClientEmailInvite}
                clientEmailNote={clientEmailNote}
                setClientEmailNote={setClientEmailNote}
                handleSendEmailInvite={handleSendEmailInvite}
                onOpenLivePreview={() => {
                    setShowShareModal(false);
                    setShowFullscreenPreview(true);
                }}
                onTriggerToast={triggerToast}
            />

            {/* MODAL: FULLSCREEN LIVE CLIENT PREVIEW */}
            <FullscreenPreviewModal
                show={showFullscreenPreview}
                onClose={() => setShowFullscreenPreview(false)}
                selectedGallery={selectedGallery}
                previewDeviceMode={previewDeviceMode}
                setPreviewDeviceMode={setPreviewDeviceMode}
                activeFont={activeFont}
                activeColor={activeColor}
                currentDesign={currentDesign}
                allGalleryItems={allGalleryItems}
                favorites={favorites}
                onToggleFavorite={(id) => setFavorites((prev) => ({ ...prev, [id]: !prev[id] }))}
                onOpenLightbox={(idx) => setLightboxIndex(idx)}
                onTriggerToast={triggerToast}
                onOpenShare={() => {
                    setShowFullscreenPreview(false);
                    setShowShareModal(true);
                }}
                onScrollToGrid={() => {
                    const el = document.getElementById('client-gallery-grid-anchor');
                    el?.scrollIntoView({ behavior: 'smooth' });
                }}
            />

            {/* MODAL: HIGH-RES LIGHTBOX */}
            <GalleryLightboxModal
                lightboxIndex={lightboxIndex}
                allGalleryItems={allGalleryItems}
                favorites={favorites}
                selectedGallery={selectedGallery}
                onClose={() => setLightboxIndex(null)}
                onNext={() => setLightboxIndex((curr) => (curr < allGalleryItems.length - 1 ? curr + 1 : 0))}
                onPrev={() => setLightboxIndex((curr) => (curr > 0 ? curr - 1 : allGalleryItems.length - 1))}
                onToggleFavorite={(id) => setFavorites((prev) => ({ ...prev, [id]: !prev[id] }))}
                onTriggerToast={triggerToast}
            />

            {/* MODAL: CUSTOM COLOR PALETTE */}
            <CustomPaletteModal
                show={showCustomPaletteModal}
                onClose={() => setShowCustomPaletteModal(false)}
                currentDesign={currentDesign}
                updateDesign={updateDesign}
                onTriggerToast={triggerToast}
            />

            {/* MODAL: CUSTOM FONT */}
            <CustomFontModal
                show={showCustomFontModal}
                onClose={() => setShowCustomFontModal(false)}
                currentDesign={currentDesign}
                updateDesign={updateDesign}
                onTriggerToast={triggerToast}
            />

            {/* GLOBAL TOAST NOTIFICATION BANNER */}
            {toast.show && (
                <div style={{
                    position: 'fixed',
                    bottom: '24px',
                    right: '24px',
                    background: '#111827',
                    color: '#ffffff',
                    padding: '12px 18px',
                    borderRadius: '8px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
                    zIndex: 11000,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '0.82rem',
                    animation: 'fadeIn 0.2s ease',
                }}>
                    <CheckCircle2 size={16} color="#10b981" />
                    <div>
                        <div style={{ fontWeight: '600' }}>{toast.title}</div>
                        <div style={{ color: '#9ca3af', fontSize: '0.75rem', marginTop: '1px' }}>{toast.message}</div>
                    </div>
                    <button
                        onClick={() => setToast((prev) => ({ ...prev, show: false }))}
                        style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: '2px', marginLeft: '12px' }}
                    >
                        <X size={14} />
                    </button>
                </div>
            )}
        </div>
    );
}
