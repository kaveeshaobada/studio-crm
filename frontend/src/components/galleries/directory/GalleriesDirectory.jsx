import React from 'react';
import {
    Settings,
    LayoutGrid,
    Star,
    Sparkles,
    Plus,
    ChevronDown,
    Search,
    List,
    Eye,
    MoreVertical,
    Share2,
} from 'lucide-react';
import { designTemplates } from '../constants/galleryPresets';
import DesignTemplatesView from './DesignTemplatesView';

export default function GalleriesDirectory({
    galleries = [],
    activeSidebarCategory,
    setActiveSidebarCategory,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    templateFilterCategory,
    setTemplateFilterCategory,
    onOpenCreateModal,
    onSelectGallery,
    onPreviewGallery,
    onShareGallery,
    onDeleteGallery,
    onPreviewTemplate,
    onCreateFromTemplate,
    onTriggerToast,
    plantCoverImg,
}) {
    const filteredGalleries = galleries.filter((g) => {
        if (activeSidebarCategory === 'starred' && !g.starred) return false;
        if (statusFilter !== 'ALL' && g.status !== statusFilter) return false;
        if (searchQuery && searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            return (
                g.name?.toLowerCase().includes(q) ||
                (g.project && g.project.toLowerCase().includes(q))
            );
        }
        return true;
    });

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
            padding: '1.5rem 2.5rem',
            position: 'relative',
        }}>
            {/* Header: Title + Gallery Settings + Create New */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.5rem',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <h1 style={{
                        fontSize: '1.75rem',
                        fontWeight: '800',
                        color: '#111827',
                        margin: 0,
                        letterSpacing: '-0.02em',
                    }}>
                        Galleries
                    </h1>

                    {/* View Switcher: My Galleries vs Design Templates */}
                    <div style={{
                        display: 'flex',
                        background: '#f1f5f9',
                        borderRadius: '8px',
                        padding: '3px',
                        gap: '2px',
                    }}>
                        <button
                            onClick={() => setActiveSidebarCategory('all')}
                            style={{
                                border: 'none',
                                background: activeSidebarCategory !== 'templates' ? '#ffffff' : 'transparent',
                                color: activeSidebarCategory !== 'templates' ? '#111827' : '#64748b',
                                fontWeight: activeSidebarCategory !== 'templates' ? '700' : '500',
                                fontSize: '0.8rem',
                                padding: '5px 12px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                boxShadow: activeSidebarCategory !== 'templates' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                            }}
                        >
                            My Galleries ({galleries.length})
                        </button>

                        <button
                            onClick={() => setActiveSidebarCategory('templates')}
                            style={{
                                border: 'none',
                                background: activeSidebarCategory === 'templates' ? '#ffffff' : 'transparent',
                                color: activeSidebarCategory === 'templates' ? '#111827' : '#64748b',
                                fontWeight: activeSidebarCategory === 'templates' ? '700' : '500',
                                fontSize: '0.8rem',
                                padding: '5px 12px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                boxShadow: activeSidebarCategory === 'templates' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                            }}
                        >
                            <Sparkles size={13} color="#2563eb" />
                            <span>Design Templates ({designTemplates.length})</span>
                        </button>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button
                        onClick={() => onTriggerToast('Gallery settings', 'Opening global gallery configuration')}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#111827',
                            fontSize: '0.82rem',
                            fontWeight: '500',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            cursor: 'pointer',
                        }}
                    >
                        <Settings size={15} color="#111827" />
                        <span>Gallery settings</span>
                    </button>

                    <button
                        onClick={onOpenCreateModal}
                        style={{
                            background: '#111827',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '7px 16px',
                            fontSize: '0.82rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                        }}
                    >
                        <span>Create new</span>
                    </button>
                </div>
            </div>

            {/* Split Content: Sub-sidebar on Left + Main Workspace on Right */}
            <div style={{ display: 'flex', gap: '2rem', flex: 1, minHeight: 0 }}>
                {/* Left Sub-sidebar: All galleries, Starred, Design Templates */}
                <div style={{ width: '180px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <button
                        onClick={() => setActiveSidebarCategory('all')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '7px 10px',
                            borderRadius: '6px',
                            border: 'none',
                            background: activeSidebarCategory === 'all' ? '#f3f4f6' : 'transparent',
                            color: '#111827',
                            fontSize: '0.82rem',
                            fontWeight: activeSidebarCategory === 'all' ? '600' : '400',
                            cursor: 'pointer',
                            textAlign: 'left',
                            width: '100%',
                        }}
                    >
                        <LayoutGrid size={15} />
                        <span>All galleries ({galleries.length})</span>
                    </button>

                    <button
                        onClick={() => setActiveSidebarCategory('starred')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '7px 10px',
                            borderRadius: '6px',
                            border: 'none',
                            background: activeSidebarCategory === 'starred' ? '#f3f4f6' : 'transparent',
                            color: activeSidebarCategory === 'starred' ? '#111827' : '#4b5563',
                            fontSize: '0.82rem',
                            fontWeight: activeSidebarCategory === 'starred' ? '600' : '400',
                            cursor: 'pointer',
                            textAlign: 'left',
                            width: '100%',
                        }}
                    >
                        <Star size={15} />
                        <span>Starred ({galleries.filter((g) => g.starred).length})</span>
                    </button>

                    <button
                        onClick={() => setActiveSidebarCategory('templates')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '7px 10px',
                            borderRadius: '6px',
                            border: 'none',
                            background: activeSidebarCategory === 'templates' ? '#eff6ff' : 'transparent',
                            color: activeSidebarCategory === 'templates' ? '#2563eb' : '#4b5563',
                            fontSize: '0.82rem',
                            fontWeight: activeSidebarCategory === 'templates' ? '700' : '400',
                            cursor: 'pointer',
                            textAlign: 'left',
                            width: '100%',
                        }}
                    >
                        <Sparkles size={15} color={activeSidebarCategory === 'templates' ? '#2563eb' : '#6b7280'} />
                        <span>Design Templates</span>
                    </button>

                    <div style={{ height: '8px' }} />

                    <button
                        onClick={() => {
                            const name = prompt('Create folder name:', 'Weddings');
                            if (name) onTriggerToast('Folder created', `Folder "${name}" added`);
                        }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '7px 10px',
                            borderRadius: '6px',
                            border: 'none',
                            background: 'transparent',
                            color: '#4b5563',
                            fontSize: '0.82rem',
                            cursor: 'pointer',
                            textAlign: 'left',
                            width: '100%',
                        }}
                    >
                        <Plus size={14} />
                        <span>Create folder</span>
                    </button>
                </div>

                {/* Right Area: Content (Galleries List OR Design Templates Showcase) */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* IF DESIGN TEMPLATES TAB IS ACTIVE */}
                    {activeSidebarCategory === 'templates' ? (
                        <DesignTemplatesView
                            templateFilterCategory={templateFilterCategory}
                            setTemplateFilterCategory={setTemplateFilterCategory}
                            onPreviewTemplate={onPreviewTemplate}
                            onCreateFromTemplate={onCreateFromTemplate}
                        />
                    ) : (
                        /* STANDARD GALLERIES DIRECTORY */
                        <>
                            {/* Filter & View Toolbar */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '1.25rem',
                                flexWrap: 'wrap',
                                gap: '10px',
                            }}>
                                {/* Left: Sort & Filter Pills */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer', marginRight: '4px' }}>
                                        <span style={{ fontSize: '0.8rem', color: '#374151', fontWeight: '500' }}>Sort by: Newest created</span>
                                        <ChevronDown size={13} color="#6b7280" />
                                    </div>

                                    {/* Status Filter Pill */}
                                    <button
                                        onClick={() => setStatusFilter((curr) => (curr === 'ALL' ? 'Draft' : curr === 'Draft' ? 'Published' : 'ALL'))}
                                        style={{
                                            background: '#ffffff',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '9999px',
                                            padding: '4px 10px',
                                            fontSize: '0.78rem',
                                            color: '#4b5563',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <span>Status {statusFilter !== 'ALL' ? `(${statusFilter})` : ''}</span>
                                        <ChevronDown size={12} color="#9ca3af" />
                                    </button>

                                    {/* Shoot Date Filter Pill */}
                                    <button style={{
                                        background: '#ffffff',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '9999px',
                                        padding: '4px 10px',
                                        fontSize: '0.78rem',
                                        color: '#4b5563',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        cursor: 'pointer',
                                    }}>
                                        <span>Shoot date</span>
                                        <ChevronDown size={12} color="#9ca3af" />
                                    </button>

                                    {/* Starred Filter Pill */}
                                    <button
                                        onClick={() => setActiveSidebarCategory((curr) => (curr === 'starred' ? 'all' : 'starred'))}
                                        style={{
                                            background: activeSidebarCategory === 'starred' ? '#eff6ff' : '#ffffff',
                                            border: activeSidebarCategory === 'starred' ? '1px solid #3b82f6' : '1px solid #e5e7eb',
                                            borderRadius: '9999px',
                                            padding: '4px 10px',
                                            fontSize: '0.78rem',
                                            color: activeSidebarCategory === 'starred' ? '#2563eb' : '#4b5563',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <Star size={12} fill={activeSidebarCategory === 'starred' ? '#2563eb' : 'none'} color={activeSidebarCategory === 'starred' ? '#2563eb' : '#9ca3af'} />
                                        <span>Starred</span>
                                    </button>
                                </div>

                                {/* Right: Search Capsule + List/Grid Toggles */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ position: 'relative' }}>
                                        <Search size={13} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                                        <input
                                            placeholder="Search galleries"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            style={{
                                                width: '160px',
                                                height: '30px',
                                                borderRadius: '6px',
                                                border: '1px solid #e5e7eb',
                                                paddingLeft: '28px',
                                                paddingRight: '10px',
                                                fontSize: '0.8rem',
                                                outline: 'none',
                                            }}
                                        />
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                        <button
                                            onClick={() => setViewMode('table')}
                                            style={{
                                                background: 'transparent',
                                                border: 'none',
                                                cursor: 'pointer',
                                                padding: '4px',
                                                color: viewMode === 'table' ? '#111827' : '#9ca3af',
                                            }}
                                            title="List view"
                                        >
                                            <List size={16} />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            style={{
                                                background: 'transparent',
                                                border: 'none',
                                                cursor: 'pointer',
                                                padding: '4px',
                                                color: viewMode === 'grid' ? '#111827' : '#9ca3af',
                                            }}
                                            title="Grid view"
                                        >
                                            <LayoutGrid size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* MAIN GALLERIES VIEW (EMPTY OR GRID OR TABLE) */}
                            {filteredGalleries.length === 0 ? (
                                <div style={{
                                    border: '1px solid #f1f3f5',
                                    borderRadius: '8px',
                                    minHeight: '380px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '3rem 2rem',
                                    textAlign: 'center',
                                    background: '#ffffff',
                                }}>
                                    <div style={{ position: 'relative', width: '90px', height: '80px', marginBottom: '1.25rem' }}>
                                        <div style={{ position: 'absolute', left: '8px', top: '4px', width: '65px', height: '52px', background: '#fde047', borderRadius: '5px', transform: 'rotate(-8deg)' }} />
                                        <div style={{ position: 'absolute', right: '8px', top: '6px', width: '65px', height: '52px', background: '#f97316', borderRadius: '5px', transform: 'rotate(8deg)' }} />
                                        <div style={{ position: 'absolute', left: '12px', top: '12px', width: '66px', height: '54px', background: 'linear-gradient(180deg, #60a5fa 0%, #3b82f6 50%, #1e40af 100%)', borderRadius: '5px', overflow: 'hidden' }}>
                                            <div style={{ position: 'absolute', top: '8px', right: '12px', width: '10px', height: '10px', borderRadius: '50%', background: '#ffffff' }} />
                                            <div style={{ position: 'absolute', bottom: '-4px', left: '-4px', width: '0', height: '0', borderLeft: '24px solid transparent', borderRight: '24px solid transparent', borderBottom: '32px solid #15803d' }} />
                                        </div>
                                        <div style={{ position: 'absolute', right: '2px', bottom: '4px', width: '26px', height: '26px', borderRadius: '50%', background: '#15803d', border: '2.5px solid #ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Plus size={14} color="#ffffff" strokeWidth={3} />
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '0.96rem', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>
                                        Your galleries will appear here
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: '#6b7280', maxWidth: '380px', lineHeight: '1.45', marginBottom: '14px' }}>
                                        Create and share your best work with clients and collaborators.
                                    </div>
                                    <button
                                        onClick={onOpenCreateModal}
                                        style={{ background: 'transparent', border: 'none', color: '#2563eb', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}
                                    >
                                        + Create gallery
                                    </button>
                                </div>
                            ) : viewMode === 'table' ? (
                                <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                                        <thead>
                                            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e5e7eb', color: '#64748b' }}>
                                                <th style={{ padding: '10px 16px', fontWeight: '600' }}>Gallery</th>
                                                <th style={{ padding: '10px 16px', fontWeight: '600' }}>Project</th>
                                                <th style={{ padding: '10px 16px', fontWeight: '600' }}>Shoot Date</th>
                                                <th style={{ padding: '10px 16px', fontWeight: '600' }}>Items</th>
                                                <th style={{ padding: '10px 16px', fontWeight: '600' }}>Status</th>
                                                <th style={{ padding: '10px 16px', fontWeight: '600', textAlign: 'right' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredGalleries.map((gal) => {
                                                const totalItems = gal.sets?.reduce((acc, s) => acc + (s.items?.length || 0), 0) || 0;
                                                return (
                                                    <tr
                                                        key={gal.id}
                                                        onClick={() => onSelectGallery(gal)}
                                                        style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background 0.12s ease' }}
                                                        onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                                                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                                                    >
                                                        <td style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                            <div style={{ width: '40px', height: '40px', borderRadius: '6px', overflow: 'hidden', background: '#f1f5f9', flexShrink: 0 }}>
                                                                <img src={gal.coverImage || plantCoverImg} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                            </div>
                                                            <span style={{ fontWeight: '600', color: '#111827' }}>{gal.name}</span>
                                                        </td>
                                                        <td style={{ padding: '12px 16px', color: '#4b5563' }}>{gal.project}</td>
                                                        <td style={{ padding: '12px 16px', color: '#6b7280' }}>{gal.shootDate}</td>
                                                        <td style={{ padding: '12px 16px', color: '#6b7280' }}>{totalItems} items</td>
                                                        <td style={{ padding: '12px 16px' }}>
                                                            <span style={{
                                                                background: gal.status === 'Published' ? '#ecfdf5' : '#f3f4f6',
                                                                color: gal.status === 'Published' ? '#059669' : '#4b5563',
                                                                fontSize: '0.72rem',
                                                                fontWeight: '600',
                                                                padding: '2px 8px',
                                                                borderRadius: '12px',
                                                            }}>
                                                                {gal.status}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        onPreviewGallery(gal);
                                                                    }}
                                                                    style={{ background: 'transparent', border: 'none', color: '#4b5563', cursor: 'pointer', padding: '4px' }}
                                                                    title="Preview"
                                                                >
                                                                    <Eye size={15} />
                                                                </button>
                                                                {gal.status === 'Published' && (
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            onShareGallery(gal);
                                                                        }}
                                                                        style={{ background: 'transparent', border: 'none', color: '#2563eb', cursor: 'pointer', padding: '4px' }}
                                                                        title="Share"
                                                                    >
                                                                        <Share2 size={15} />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 280px))', gap: '1.5rem' }}>
                                    {filteredGalleries.map((gal) => {
                                        const totalItems = gal.sets?.reduce((acc, s) => acc + (s.items?.length || 0), 0) || 0;
                                        return (
                                            <div
                                                key={gal.id}
                                                onClick={() => onSelectGallery(gal)}
                                                style={{
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '8px',
                                                    overflow: 'hidden',
                                                    background: '#ffffff',
                                                    cursor: 'pointer',
                                                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.08)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                    e.currentTarget.style.boxShadow = 'none';
                                                }}
                                            >
                                                <div style={{ width: '100%', height: '170px', overflow: 'hidden', background: '#f3f4f6', position: 'relative' }}>
                                                    <img src={gal.coverImage || plantCoverImg} alt={gal.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onPreviewGallery(gal);
                                                        }}
                                                        style={{
                                                            position: 'absolute',
                                                            top: '10px',
                                                            right: '10px',
                                                            background: 'rgba(0,0,0,0.6)',
                                                            backdropFilter: 'blur(4px)',
                                                            color: '#ffffff',
                                                            border: 'none',
                                                            borderRadius: '6px',
                                                            padding: '4px 8px',
                                                            fontSize: '0.72rem',
                                                            fontWeight: '600',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '4px',
                                                        }}
                                                    >
                                                        <Eye size={12} />
                                                        <span>Preview</span>
                                                    </button>
                                                </div>

                                                <div style={{ padding: '0.85rem 1rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                                                        <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                            {gal.name}
                                                        </div>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onDeleteGallery(gal);
                                                            }}
                                                            style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: '2px' }}
                                                        >
                                                            <MoreVertical size={14} />
                                                        </button>
                                                    </div>

                                                    <div style={{ fontSize: '0.78rem', color: '#6b7280', marginBottom: '4px' }}>
                                                        {totalItems} items • {gal.shootDate}
                                                    </div>

                                                    <div style={{ fontSize: '0.78rem', color: '#4b5563', marginBottom: '10px' }}>
                                                        {gal.project}
                                                    </div>

                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px' }}>
                                                        <span style={{
                                                            background: gal.status === 'Published' ? '#ecfdf5' : '#f3f4f6',
                                                            color: gal.status === 'Published' ? '#059669' : '#4b5563',
                                                            fontSize: '0.72rem',
                                                            fontWeight: '600',
                                                            padding: '2px 8px',
                                                            borderRadius: '12px',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '4px',
                                                        }}>
                                                            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: gal.status === 'Published' ? '#10b981' : '#9ca3af' }} />
                                                            {gal.status}
                                                        </span>

                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            {gal.status === 'Published' && (
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        onShareGallery(gal);
                                                                    }}
                                                                    style={{ background: 'transparent', border: 'none', color: '#2563eb', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}
                                                                    title="Share link"
                                                                >
                                                                    <Share2 size={14} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
