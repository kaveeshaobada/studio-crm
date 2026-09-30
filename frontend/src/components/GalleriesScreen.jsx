import React, { useState, useRef, useEffect } from 'react';
import plantCoverImg from '../assets/gallery_plant_cover.jpg';
import teamPhotoImg from '../assets/gallery_team_photo.jpg';
import dinnerImg from '../assets/gallery_dinner.jpg';
import coupleImg from '../assets/gallery_couple.jpg';
import editorialModelImg from '../assets/gallery_editorial_model.jpg';
import archInteriorImg from '../assets/gallery_interior_arch.jpg';
import {
    Plus,
    LayoutGrid,
    List,
    Star,
    Calendar,
    ChevronDown,
    Search,
    SlidersHorizontal,
    Settings,
    MoreVertical,
    ArrowLeft,
    UploadCloud,
    Check,
    X,
    Eye,
    FolderPlus,
    Info,
    Trash2,
    Share2,
    Image as ImageIcon,
    Smartphone,
    Monitor,
    Heart,
    Download,
    ExternalLink,
    Copy,
    QrCode,
    Lock,
    Mail,
    Sparkles,
    ShoppingBag,
    BarChart3,
    CheckCircle2,
    Target,
    Layers,
    Send,
    ArrowRight,
    Palette,
    Type,
    Maximize2,
    RefreshCw,
    Sliders,
    Camera,
    ShieldCheck,
} from 'lucide-react';

export default function GalleriesScreen({ projects = [], onNavigateToPipeline, initialCategory = 'all' }) {
    // Current view: 'list' (galleries directory) or 'detail' (inside a specific gallery)
    const [view, setView] = useState('list');
    const [selectedGallery, setSelectedGallery] = useState(null);

    // Directory category: 'all' | 'starred' | 'templates'
    const [activeSidebarCategory, setActiveSidebarCategory] = useState(initialCategory || 'all');
    const [templateFilterCategory, setTemplateFilterCategory] = useState('ALL'); // 'ALL' | 'Editorial' | 'Fine Art' | 'Modern' | 'Minimalist'
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [sortOption, setSortOption] = useState('newest');

    // Modals & Drawers
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newGalleryProject, setNewGalleryProject] = useState('21');
    const [newGalleryName, setNewGalleryName] = useState('21');
    const [newGalleryShootDate, setNewGalleryShootDate] = useState('Sep 17, 2026');
    const [newGalleryTemplate, setNewGalleryTemplate] = useState('editorial_vogue');

    // Detail Screen Navigation Tabs
    const [detailTab, setDetailTab] = useState('design'); // 'media' | 'design' | 'settings' | 'store' | 'activity'
    const [designSubTab, setDesignSubTab] = useState('cover'); // 'cover' | 'grid' | 'fonts' | 'color'
    const [selectedSetId, setSelectedSetId] = useState('set-highlights');

    // Live preview & sharing state
    const [showShareModal, setShowShareModal] = useState(false);
    const [shareModalTab, setShareModalTab] = useState('link'); // 'link' | 'email' | 'qr'
    const [showFullscreenPreview, setShowFullscreenPreview] = useState(false);
    const [previewDeviceMode, setPreviewDeviceMode] = useState('desktop'); // 'desktop' | 'mobile'
    const [lightboxIndex, setLightboxIndex] = useState(null);
    const [favorites, setFavorites] = useState({});
    const [clientEmailInvite, setClientEmailInvite] = useState('');
    const [clientEmailNote, setClientEmailNote] = useState('Hi! Your complete photo collection is now ready to view, download, and share. Enjoy looking through these memories!');
    const [copiedLink, setCopiedLink] = useState(false);
    const [copiedPin, setCopiedPin] = useState(false);
    const [showCustomColorModal, setShowCustomColorModal] = useState(false);
    const [showCustomFontModal, setShowCustomFontModal] = useState(false);

    // Toast state
    const [toast, setToast] = useState({
        show: true,
        title: 'Upload complete',
        subtitle: '3 files uploaded',
    });

    const triggerToast = (title, subtitle) => {
        setToast({ show: true, title, subtitle });
        setTimeout(() => {
            setToast((prev) => (prev.title === title ? { ...prev, show: false } : prev));
        }, 4000);
    };

    // =========================================================================
    // 1. CURATED DESIGN TEMPLATES SYSTEM
    // =========================================================================
    const designTemplates = [
        {
            id: 'editorial_vogue',
            name: 'Editorial Vogue',
            category: 'Editorial',
            badge: 'Most Popular',
            description: 'Split cover composition with high-fashion serif typography, balanced negative space, and vertical portrait masonry.',
            coverLayout: 'split',
            logo: 'none',
            gridStyle: 'vertical',
            thumbnailSize: 'standard',
            gridSpacing: 'compact',
            fontPreset: 'classic',
            colorPreset: 'air',
            coverImage: editorialModelImg,
            samplePhotos: [editorialModelImg, plantCoverImg, dinnerImg, coupleImg, teamPhotoImg],
        },
        {
            id: 'modern_noir',
            name: 'Modern Noir',
            category: 'Modern',
            badge: 'Trending',
            description: 'Dramatic full-bleed dark vignette with glowing typography, heavy sans display, and expansive panoramic photo cards.',
            coverLayout: 'dark_overlay',
            logo: 'use_logo',
            gridStyle: 'horizontal',
            thumbnailSize: 'large',
            gridSpacing: 'wide',
            fontPreset: 'bold',
            colorPreset: 'graphite',
            coverImage: dinnerImg,
            samplePhotos: [dinnerImg, teamPhotoImg, coupleImg, archInteriorImg, editorialModelImg],
        },
        {
            id: 'fine_art_sage',
            name: 'Fine Art Sage',
            category: 'Fine Art',
            badge: "Editor's Choice",
            description: 'Museum-quality passe-partout matte border framing the photo with warm serif typography and organic botanical sage tones.',
            coverLayout: 'framed',
            logo: 'none',
            gridStyle: 'vertical',
            thumbnailSize: 'standard',
            gridSpacing: 'wide',
            fontPreset: 'soft',
            colorPreset: 'sage',
            coverImage: plantCoverImg,
            samplePhotos: [plantCoverImg, coupleImg, archInteriorImg, editorialModelImg, dinnerImg],
        },
        {
            id: 'golden_dune',
            name: 'Golden Dune',
            category: 'Minimalist',
            badge: 'Warm Aesthetic',
            description: 'Sun-drenched landscape hero image with centered minimalist title below and artisan sand linen palette.',
            coverLayout: 'title_below',
            logo: 'none',
            gridStyle: 'horizontal',
            thumbnailSize: 'standard',
            gridSpacing: 'wide',
            fontPreset: 'minimal',
            colorPreset: 'dune',
            coverImage: coupleImg,
            samplePhotos: [coupleImg, plantCoverImg, archInteriorImg, dinnerImg, teamPhotoImg],
        },
        {
            id: 'coastal_breeze',
            name: 'Coastal Breeze',
            category: 'Fine Art',
            badge: 'Clean & Bright',
            description: 'Airy ocean-inspired layout with clean centered typography above an expansive landscape banner with maritime slate accents.',
            coverLayout: 'title_above',
            logo: 'none',
            gridStyle: 'horizontal',
            thumbnailSize: 'large',
            gridSpacing: 'compact',
            fontPreset: 'simple',
            colorPreset: 'coastal',
            coverImage: archInteriorImg,
            samplePhotos: [archInteriorImg, coupleImg, plantCoverImg, editorialModelImg, dinnerImg],
        },
        {
            id: 'the_atelier',
            name: 'The Atelier',
            category: 'Editorial',
            badge: 'Signature',
            description: 'High-end art magazine journal with asymmetric vertical cover card, volume metadata, and interactive story button.',
            coverLayout: 'editorial_1',
            logo: 'use_logo',
            gridStyle: 'vertical',
            thumbnailSize: 'standard',
            gridSpacing: 'compact',
            fontPreset: 'classic',
            colorPreset: 'air',
            coverImage: editorialModelImg,
            samplePhotos: [editorialModelImg, plantCoverImg, coupleImg, archInteriorImg, dinnerImg],
        },
        {
            id: 'nordic_journal',
            name: 'Nordic Journal',
            category: 'Minimalist',
            badge: 'Minimalist',
            description: 'Understated Scandinavian aesthetic with lower floating title card and balanced geometric landscape rhythm.',
            coverLayout: 'editorial_2',
            logo: 'none',
            gridStyle: 'horizontal',
            thumbnailSize: 'standard',
            gridSpacing: 'compact',
            fontPreset: 'minimal',
            colorPreset: 'air',
            coverImage: archInteriorImg,
            samplePhotos: [archInteriorImg, dinnerImg, plantCoverImg, teamPhotoImg, coupleImg],
        },
        {
            id: 'glass_contemporary',
            name: 'Contemporary Glass',
            category: 'Modern',
            badge: 'Architectural',
            description: 'Futuristic frosted glass floating title card over full-bleed photography with modern pill actions.',
            coverLayout: 'modern',
            logo: 'use_logo',
            gridStyle: 'horizontal',
            thumbnailSize: 'large',
            gridSpacing: 'wide',
            fontPreset: 'bold',
            colorPreset: 'air',
            coverImage: archInteriorImg,
            samplePhotos: [archInteriorImg, teamPhotoImg, coupleImg, dinnerImg, editorialModelImg],
        },
    ];

    // Initial galleries list matching user's screenshots
    const [galleries, setGalleries] = useState([
        {
            id: 'gal-test-1',
            name: '21',
            project: '21',
            shootDate: 'Sep 17, 2026',
            status: 'Published',
            starred: false,
            templateId: 'editorial_vogue',
            coverImage: plantCoverImg,
            plantCover: plantCoverImg,
            design: {
                coverLayout: 'split', // 'none' | 'split' | 'title_above' | 'title_below' | 'editorial_1' | 'editorial_2' | 'framed' | 'modern' | 'overlay' | 'dark_overlay'
                logo: 'none', // 'none' | 'use_logo'
                gridStyle: 'horizontal', // 'horizontal' | 'vertical'
                thumbnailSize: 'standard', // 'standard' | 'large'
                gridSpacing: 'compact', // 'compact' | 'wide'
                fontPreset: 'simple', // 'simple' | 'classic' | 'minimal' | 'soft' | 'bold'
                colorPreset: 'air', // 'air' | 'sage' | 'dune' | 'coastal' | 'graphite'
                deviceMode: 'desktop', // 'desktop' | 'mobile'
            },
            sets: [
                {
                    id: 'set-highlights',
                    name: 'Highlights',
                    items: [
                        { id: 'item-1', url: dinnerImg, title: 'Reception Dinner Banquet', width: 4, height: 3 },
                        { id: 'item-2', url: coupleImg, title: 'Newlyweds Golden Hour', width: 4, height: 3 },
                        { id: 'item-3', url: teamPhotoImg, title: 'Wedding Celebration Guests', width: 16, height: 9 },
                        { id: 'item-4', url: plantCoverImg, title: 'Botanical Floral Details', width: 16, height: 9 },
                        { id: 'item-5', url: editorialModelImg, title: 'Bride Portrait', width: 3, height: 4 },
                        { id: 'item-6', url: archInteriorImg, title: 'Venue Architecture', width: 16, height: 9 },
                    ],
                },
                {
                    id: 'set-ceremony',
                    name: 'Ceremony',
                    items: [
                        { id: 'item-7', url: coupleImg, title: 'Exchange of Vows', width: 4, height: 3 },
                        { id: 'item-8', url: teamPhotoImg, title: 'Family Processional', width: 16, height: 9 },
                    ],
                },
            ],
            settings: {
                downloadPin: '4829',
                allowHighRes: true,
                requireEmail: false,
                expiryDate: 'Dec 31, 2026',
            },
            activity: [
                { id: 'act-1', text: 'Gallery published and client direct link activated', time: '10 mins ago', type: 'publish' },
                { id: 'act-2', text: 'Invitation email viewed by client (emma@clientstudio.com)', time: '2 hours ago', type: 'email' },
                { id: 'act-3', text: '4 items marked as client favorites', time: 'Yesterday', type: 'favorite' },
            ],
        },
    ]);

    // =========================================================================
    // 2. DESIGN SYSTEM TOKENS & TYPOGRAPHY
    // =========================================================================
    const fontPresets = {
        simple: {
            title: 'Simple',
            headingFont: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
            bodyFont: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
            headingWeight: '700',
            headingTransform: 'none',
            letterSpacing: '-0.02em',
        },
        classic: {
            title: 'Classic',
            headingFont: "Playfair Display, Georgia, 'Times New Roman', serif",
            bodyFont: "Georgia, serif",
            headingWeight: '400',
            headingTransform: 'uppercase',
            letterSpacing: '0.14em',
        },
        minimal: {
            title: 'Minimal',
            headingFont: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            bodyFont: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            headingWeight: '300',
            headingTransform: 'none',
            letterSpacing: '0.06em',
        },
        soft: {
            title: 'Soft',
            headingFont: "Merriweather, Garamond, Georgia, serif",
            bodyFont: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            headingWeight: '400',
            headingTransform: 'none',
            letterSpacing: '0',
        },
        bold: {
            title: 'Bold',
            headingFont: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            bodyFont: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            headingWeight: '900',
            headingTransform: 'uppercase',
            letterSpacing: '0.08em',
        },
    };

    const colorPresets = {
        air: {
            title: 'Air',
            circle1: '#ffffff',
            circle2: '#1f2937',
            bg: '#ffffff',
            text: '#111827',
            textMuted: '#6b7280',
            accent: '#111827',
            cardBg: '#ffffff',
            border: '#e5e7eb',
            btnText: '#ffffff',
            heroBg: '#f9fafb',
        },
        sage: {
            title: 'Sage',
            circle1: '#edf3ef',
            circle2: '#4d6054',
            bg: '#edf3ef',
            text: '#223028',
            textMuted: '#52665a',
            accent: '#37473d',
            cardBg: '#ffffff',
            border: '#d2ded6',
            btnText: '#ffffff',
            heroBg: '#e2ece5',
        },
        dune: {
            title: 'Dune',
            circle1: '#f8f4ee',
            circle2: '#856e58',
            bg: '#f8f4ee',
            text: '#382d23',
            textMuted: '#706051',
            accent: '#524335',
            cardBg: '#ffffff',
            border: '#e6ded3',
            btnText: '#ffffff',
            heroBg: '#f0e8dc',
        },
        coastal: {
            title: 'Coastal',
            circle1: '#f3f6fa',
            circle2: '#536378',
            bg: '#f3f6fa',
            text: '#202d3d',
            textMuted: '#586b82',
            accent: '#32445b',
            cardBg: '#ffffff',
            border: '#dbe3ed',
            btnText: '#ffffff',
            heroBg: '#e7eef7',
        },
        graphite: {
            title: 'Graphite',
            circle1: '#141416',
            circle2: '#2a2b2f',
            bg: '#141416',
            text: '#f9fafb',
            textMuted: '#9ca3af',
            accent: '#ffffff',
            cardBg: '#1f2024',
            border: '#2e3036',
            btnText: '#111827',
            heroBg: '#1c1d22',
        },
    };

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

    // Helper: update active gallery design
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

    // Helper: apply an entire curated design template
    const applyDesignTemplate = (template) => {
        if (!selectedGallery) return;
        const updated = {
            ...selectedGallery,
            templateId: template.id,
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
                logo: template.logo || selectedGallery.design.logo,
            },
        };
        setSelectedGallery(updated);
        setGalleries((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
        triggerToast('Template applied', `Switched to "${template.name}" styling`);
    };

    // Helper: create gallery from a template and navigate to it
    const handleCreateFromTemplate = (template, shouldPublishImmediately = false) => {
        const uniqueId = `gal-${Date.now()}`;
        const newGal = {
            id: uniqueId,
            name: `${template.name} Showcase`,
            project: template.name,
            shootDate: 'Sep 30, 2026',
            status: shouldPublishImmediately ? 'Published' : 'Draft',
            starred: false,
            templateId: template.id,
            coverImage: template.coverImage || plantCoverImg,
            plantCover: template.coverImage || plantCoverImg,
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
                    id: `set-${Date.now()}`,
                    name: 'Highlights',
                    items: (template.samplePhotos || [plantCoverImg, dinnerImg, coupleImg, teamPhotoImg]).map((photo, i) => ({
                        id: `item-${Date.now()}-${i}`,
                        url: photo,
                        title: `Showcase Photo #${i + 1}`,
                    })),
                },
            ],
            settings: {
                downloadPin: '4829',
                allowHighRes: true,
                requireEmail: false,
                expiryDate: 'Dec 31, 2026',
            },
            activity: [
                { id: `act-${Date.now()}`, text: `Gallery created from "${template.name}" template`, time: 'Just now', type: 'create' },
            ],
        };

        setGalleries([newGal, ...galleries]);
        setSelectedGallery(newGal);
        setSelectedSetId(newGal.sets[0].id);
        setView('detail');
        setDetailTab('design');

        if (shouldPublishImmediately) {
            setShowShareModal(true);
            triggerToast('Published & Ready to Share', `"${newGal.name}" is now live!`);
        } else {
            triggerToast('Template Loaded', `Editing "${newGal.name}"`);
        }
    };

    // Helper: preview template in client modal
    const handlePreviewTemplate = (template) => {
        const mockGallery = {
            id: `template-preview-${template.id}`,
            name: template.name,
            project: `${template.category} Photography`,
            shootDate: 'Sep 30, 2026',
            status: 'Published',
            starred: false,
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
                deviceMode: previewDeviceMode,
            },
            sets: [
                {
                    id: 'set-tpl',
                    name: 'Portfolio Highlights',
                    items: (template.samplePhotos || [plantCoverImg, dinnerImg, coupleImg, teamPhotoImg]).map((photo, i) => ({
                        id: `tpl-photo-${i}`,
                        url: photo,
                        title: `${template.name} #${i + 1}`,
                    })),
                },
            ],
            settings: {
                downloadPin: '4829',
                allowHighRes: true,
                requireEmail: false,
                expiryDate: 'Dec 31, 2026',
            },
        };
        setSelectedGallery(mockGallery);
        setShowFullscreenPreview(true);
    };

    // Filter galleries in directory view
    const filteredGalleries = galleries.filter((g) => {
        if (activeSidebarCategory === 'starred' && !g.starred) return false;
        if (statusFilter !== 'ALL' && g.status !== statusFilter) return false;
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            return g.name.toLowerCase().includes(q) || g.project.toLowerCase().includes(q);
        }
        return true;
    });

    // Filter templates
    const filteredTemplates = designTemplates.filter((t) => {
        if (templateFilterCategory !== 'ALL' && t.category !== templateFilterCategory) return false;
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            return t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q);
        }
        return true;
    });

    // Toggle star on gallery
    const toggleStar = (e, galleryId) => {
        e.stopPropagation();
        setGalleries((prev) =>
            prev.map((g) => (g.id === galleryId ? { ...g, starred: !g.starred } : g))
        );
    };

    // Handle Create Gallery from standard modal
    const handleCreateGallery = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        const galleryName = newGalleryName.trim() || 'New Gallery';
        const tpl = designTemplates.find((t) => t.id === newGalleryTemplate) || designTemplates[0];

        const newGal = {
            id: `gal-${Date.now()}`,
            name: galleryName,
            project: newGalleryProject || '21',
            shootDate: newGalleryShootDate || 'Sep 17, 2026',
            status: 'Draft',
            starred: false,
            templateId: tpl.id,
            coverImage: plantCoverImg,
            plantCover: plantCoverImg,
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
                    id: `set-${Date.now()}`,
                    name: 'Highlights',
                    items: [
                        { id: 'item-1', url: dinnerImg, title: 'Reception Dinner' },
                        { id: 'item-2', url: coupleImg, title: 'Golden Hour Couple' },
                        { id: 'item-3', url: teamPhotoImg, title: 'Celebration Guests' },
                        { id: 'item-4', url: plantCoverImg, title: 'Botanical Details' },
                    ],
                },
            ],
            settings: {
                downloadPin: '4829',
                allowHighRes: true,
                requireEmail: false,
                expiryDate: 'Dec 31, 2026',
            },
            activity: [
                { id: `act-${Date.now()}`, text: `Gallery "${galleryName}" created`, time: 'Just now', type: 'create' },
            ],
        };

        setGalleries([newGal, ...galleries]);
        setSelectedGallery(newGal);
        setSelectedSetId(newGal.sets[0].id);
        setShowCreateModal(false);
        setView('detail');
        setDetailTab('design');
        triggerToast('Gallery created', `${galleryName} is ready to design`);
    };

    // Upload items to current gallery set
    const handleUploadFiles = () => {
        if (!selectedGallery) return;
        const newItems = [
            { id: `item-${Date.now()}-1`, url: editorialModelImg, title: 'Portrait Editorial' },
            { id: `item-${Date.now()}-2`, url: archInteriorImg, title: 'Interior Architecture' },
            { id: `item-${Date.now()}-3`, url: coupleImg, title: 'Sunset Couple Walk' },
        ];

        const updated = {
            ...selectedGallery,
            sets: selectedGallery.sets.map((s) =>
                s.id === selectedSetId ? { ...s, items: [...s.items, ...newItems] } : s
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

    const currentSet = selectedGallery?.sets?.find((s) => s.id === selectedSetId) || selectedGallery?.sets?.[0];
    const allGalleryItems = selectedGallery?.sets?.flatMap((s) => s.items) || [];

    // Scroll down to gallery photos inside preview
    const scrollToGalleryGrid = (containerId) => {
        const target = document.getElementById(containerId);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Copy to clipboard helper
    const handleCopyShareLink = () => {
        const link = `https://studiocrm.app/g/${selectedGallery?.id || '21-collection'}`;
        navigator.clipboard.writeText(link);
        setCopiedLink(true);
        triggerToast('Link copied', 'Client direct link copied to clipboard');
        setTimeout(() => setCopiedLink(false), 2500);
    };

    const handleCopyPin = () => {
        const pin = selectedGallery?.settings?.downloadPin || '4829';
        navigator.clipboard.writeText(pin);
        setCopiedPin(true);
        triggerToast('PIN copied', `Download PIN ${pin} copied`);
        setTimeout(() => setCopiedPin(false), 2500);
    };

    // Send email invitation helper
    const handleSendEmailInvite = (e) => {
        e.preventDefault();
        if (!clientEmailInvite) return;
        const updated = {
            ...selectedGallery,
            activity: [
                { id: `act-${Date.now()}`, text: `Gallery invite emailed to ${clientEmailInvite}`, time: 'Just now', type: 'email' },
                ...(selectedGallery.activity || []),
            ],
        };
        setSelectedGallery(updated);
        setGalleries((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
        setShowShareModal(false);
        setClientEmailInvite('');
        triggerToast('Invitation sent', `Direct access link sent to ${clientEmailInvite}`);
    };

    // =========================================================================
    // 3. RENDER ALL 10 INTUITIVE CLIENT GALLERY COVER LAYOUTS
    // =========================================================================
    const renderCoverHeroLayout = (isFull = false, isMobile = false) => {
        const layout = currentDesign.coverLayout;
        const coverImg = selectedGallery.plantCover || selectedGallery.coverImage || plantCoverImg;
        const hasLogo = currentDesign.logo === 'use_logo';
        const gridTargetId = isFull ? 'full-grid-target' : 'preview-grid-target';

        // 1. NONE LAYOUT: Minimal clean header masthead
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

        // 2. SPLIT LAYOUT (50/50 Editorial split - matches user screenshot 1)
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
                            onClick={() => scrollToGalleryGrid(gridTargetId)}
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
                            onClick={() => scrollToGalleryGrid(gridTargetId)}
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
                            onClick={() => scrollToGalleryGrid(gridTargetId)}
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

        // 5. EDITORIAL 1 (Asymmetric magazine journal layout with offset vertical photo)
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
                            onClick={() => scrollToGalleryGrid(gridTargetId)}
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

        // 6. EDITORIAL 2 (Minimalist architecture journal layout with floating corner card)
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
                                onClick={() => scrollToGalleryGrid(gridTargetId)}
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

        // 7. FRAMED LAYOUT (Museum-quality passe-partout mat border with fine art typography)
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
                        {/* Framed Image */}
                        <div style={{
                            height: isFull ? '380px' : '190px',
                            width: '100%',
                            borderRadius: '4px',
                            overflow: 'hidden',
                            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.08)',
                        }}>
                            <img src={coverImg} alt="Framed Print" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>

                        {/* Museum Mat Label */}
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
                                onClick={() => scrollToGalleryGrid(gridTargetId)}
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

                    {/* Centered Frosted Glass Card */}
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
                            onClick={() => scrollToGalleryGrid(gridTargetId)}
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

        // 9. OVERLAY LAYOUT (Light airy gradient scrim with dark crisp typography)
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
                            onClick={() => scrollToGalleryGrid(gridTargetId)}
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

        // 10. DARK OVERLAY LAYOUT (Dramatic moody cinematic dark vignette with white typography)
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
                            onClick={() => scrollToGalleryGrid(gridTargetId)}
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
    };

    // =========================================================================
    // 4. RENDER LIVE PREVIEW CANVAS COMPONENT (USED IN EDITOR & PREVIEW MODAL)
    // =========================================================================
    const renderClientGalleryCanvas = (isFull = false, forcedDeviceMode = null) => {
        const mode = forcedDeviceMode || currentDesign.deviceMode;
        const isMobile = mode === 'mobile';
        const gridTargetId = isFull ? 'full-grid-target' : 'preview-grid-target';

        // Outer canvas container styling
        const canvasContainerStyle = isFull
            ? {
                width: isMobile ? '390px' : '100%',
                maxWidth: isMobile ? '390px' : '1240px',
                margin: '0 auto',
                background: activeColor.bg,
                color: activeColor.text,
                minHeight: '100vh',
                boxShadow: isMobile ? '0 25px 50px -12px rgba(0, 0, 0, 0.4)' : 'none',
                borderRadius: isMobile ? '36px' : '0',
                border: isMobile ? '12px solid #1f2937' : 'none',
                overflow: 'hidden',
                transition: 'all 0.25s ease',
            }
            : {
                width: isMobile ? '320px' : '100%',
                maxWidth: isMobile ? '320px' : '780px',
                margin: '0 auto',
                background: activeColor.bg,
                color: activeColor.text,
                borderRadius: isMobile ? '24px' : '8px',
                border: isMobile ? '8px solid #1f2937' : '1px solid #e5e7eb',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08)',
                overflow: 'hidden',
                transition: 'all 0.25s ease',
            };

        // Determine grid layout columns
        const isLargeThumb = currentDesign.thumbnailSize === 'large';
        const isVerticalGrid = currentDesign.gridStyle === 'vertical';
        const isWideSpacing = currentDesign.gridSpacing === 'wide';

        let gridColumns;
        if (isMobile) {
            gridColumns = isLargeThumb ? '1fr' : 'repeat(2, 1fr)';
        } else if (isFull) {
            gridColumns = isLargeThumb ? 'repeat(2, 1fr)' : (isVerticalGrid ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)');
        } else {
            gridColumns = isLargeThumb ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)';
        }

        return (
            <div style={canvasContainerStyle}>
                {/* 1. HERO COVER SECTION (ALL 10 DISTINCT LAYOUTS) */}
                {renderCoverHeroLayout(isFull, isMobile)}

                {/* 2. GALLERY SUB-HEADER / CLIENT TOOLBAR */}
                <div
                    id={gridTargetId}
                    style={{
                        padding: isFull ? '1.5rem 2.5rem 1rem 2.5rem' : '0.85rem 1.25rem 0.6rem 1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: `1px solid ${activeColor.border}`,
                        background: activeColor.bg,
                    }}
                >
                    <div>
                        <div style={{
                            fontSize: isFull ? '1.15rem' : '0.88rem',
                            fontWeight: '700',
                            fontFamily: activeFont.headingFont,
                            color: activeColor.text,
                        }}>
                            {selectedGallery.name}
                        </div>
                        <div style={{
                            fontSize: isFull ? '0.78rem' : '0.68rem',
                            color: activeColor.textMuted,
                            fontFamily: activeFont.bodyFont,
                        }}>
                            {selectedGallery.project} • {allGalleryItems.length} photographs
                        </div>
                    </div>

                    {/* Client Interactive Actions: Favorite count, Download, Share */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: isFull ? '12px' : '8px' }}>
                        <button
                            onClick={() => triggerToast('Favorites', `${Object.values(favorites).filter(Boolean).length} items favorited`)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                color: activeColor.textMuted,
                                padding: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '0.75rem',
                            }}
                            title="Favorites"
                        >
                            <Heart size={isFull ? 18 : 14} fill={Object.values(favorites).some(Boolean) ? '#ef4444' : 'none'} color={Object.values(favorites).some(Boolean) ? '#ef4444' : activeColor.textMuted} />
                            {Object.values(favorites).filter(Boolean).length > 0 && (
                                <span>{Object.values(favorites).filter(Boolean).length}</span>
                            )}
                        </button>

                        <button
                            onClick={() => triggerToast('Download PIN required', `Enter client PIN: ${selectedGallery.settings?.downloadPin || '4829'}`)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                color: activeColor.textMuted,
                                padding: '4px',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                            title="Download All Photos"
                        >
                            <Download size={isFull ? 18 : 14} />
                        </button>

                        <button
                            onClick={() => setShowShareModal(true)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                color: activeColor.textMuted,
                                padding: '4px',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                            title="Share Gallery"
                        >
                            <Share2 size={isFull ? 18 : 14} />
                        </button>
                    </div>
                </div>

                {/* 3. PHOTO GRID (Dynamic based on Grid Style, Thumbnail Size, Spacing) */}
                <div style={{
                    padding: isFull
                        ? (isWideSpacing ? '2rem' : '1rem')
                        : (isWideSpacing ? '1rem' : '0.5rem'),
                    background: activeColor.bg,
                }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: gridColumns,
                        gap: isWideSpacing ? (isFull ? '24px' : '12px') : (isFull ? '6px' : '3px'),
                    }}>
                        {allGalleryItems.map((item, idx) => (
                            <div
                                key={item.id}
                                onClick={() => setLightboxIndex(idx)}
                                style={{
                                    position: 'relative',
                                    overflow: 'hidden',
                                    aspectRatio: isVerticalGrid ? '3/4' : '4/3',
                                    borderRadius: '4px',
                                    background: '#f3f4f6',
                                    cursor: 'pointer',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                                }}
                            >
                                <img
                                    src={item.url}
                                    alt={item.title}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        display: 'block',
                                        transition: 'transform 0.25s ease',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                />

                                {/* Hover Overlay with Actions */}
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'linear-gradient(transparent 60%, rgba(0,0,0,0.7))',
                                    opacity: 0,
                                    transition: 'opacity 0.15s ease',
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                    justifyContent: 'space-between',
                                    padding: '8px 10px',
                                    color: '#ffffff',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                                >
                                    <span style={{ fontSize: '0.72rem', fontWeight: '500' }}>#{idx + 1} {item.title || ''}</span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setFavorites((prev) => ({ ...prev, [item.id]: !prev[item.id] }));
                                        }}
                                        style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer', padding: '2px' }}
                                    >
                                        <Heart size={15} fill={favorites[item.id] ? '#ef4444' : 'none'} color={favorites[item.id] ? '#ef4444' : '#ffffff'} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. FOOTER BRAND CREDIT */}
                <div style={{
                    padding: '2.5rem 1.5rem',
                    textAlign: 'center',
                    borderTop: `1px solid ${activeColor.border}`,
                    color: activeColor.textMuted,
                    fontSize: '0.75rem',
                    fontFamily: activeFont.bodyFont,
                    background: activeColor.bg,
                }}>
                    <div style={{ fontWeight: '600', color: activeColor.text, marginBottom: '2px' }}>
                        {selectedGallery.name} Photography Portfolio
                    </div>
                    <div style={{ opacity: 0.7 }}>Powered by Studio CRM Client Galleries • All rights reserved</div>
                </div>
            </div>
        );
    };

    // =========================================================================
    // 5. DETAIL VIEW (INSIDE A SPECIFIC GALLERY)
    // =========================================================================
    if (view === 'detail' && selectedGallery) {
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
                                onClick={() => setView('list')}
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
                                onClick={() => setShowFullscreenPreview(true)}
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
                                    onClick={() => setShowShareModal(true)}
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
                                    onClick={() => {
                                        const updated = {
                                            ...selectedGallery,
                                            status: 'Published',
                                            activity: [
                                                { id: `act-${Date.now()}`, text: 'Gallery published and client direct link activated', time: 'Just now', type: 'publish' },
                                                ...(selectedGallery.activity || []),
                                            ],
                                        };
                                        setSelectedGallery(updated);
                                        setGalleries((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
                                        setShowShareModal(true);
                                        triggerToast('Gallery Published', 'Client link is now active and ready to share');
                                    }}
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
                                onClick={() => {
                                    const nextStatus = selectedGallery.status === 'Published' ? 'Draft' : 'Published';
                                    const updated = { ...selectedGallery, status: nextStatus };
                                    setSelectedGallery(updated);
                                    setGalleries((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
                                    triggerToast('Status changed', `Gallery is now marked as ${nextStatus}`);
                                }}
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

                {/* =========================================================================
                    TAB 1: DESIGN TAB (MATCHING USER SCREENSHOTS 1, 2, 3, 4)
                   ========================================================================= */}
                {detailTab === 'design' && (
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        minHeight: 0,
                        background: '#f8fafc',
                    }}>
                        {/* LEFT CUSTOMIZER SIDEBAR (~360px) */}
                        <div style={{
                            width: '360px',
                            minWidth: '340px',
                            background: '#ffffff',
                            borderRight: '1px solid #e5e7eb',
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            overflowY: 'auto',
                        }}>
                            {/* PRESET TEMPLATES BAR AT TOP */}
                            <div style={{
                                padding: '12px 16px',
                                background: '#f8fafc',
                                borderBottom: '1px solid #e5e7eb',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#4b5563', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <Sparkles size={13} color="#2563eb" />
                                        <span>Curated Design Presets</span>
                                    </span>
                                    <button
                                        onClick={() => {
                                            setActiveSidebarCategory('templates');
                                            setView('list');
                                        }}
                                        style={{ background: 'transparent', border: 'none', color: '#2563eb', fontSize: '0.74rem', fontWeight: '600', cursor: 'pointer' }}
                                    >
                                        Browse all
                                    </button>
                                </div>

                                <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
                                    {designTemplates.slice(0, 5).map((tpl) => (
                                        <button
                                            key={tpl.id}
                                            onClick={() => applyDesignTemplate(tpl)}
                                            style={{
                                                padding: '4px 10px',
                                                borderRadius: '9999px',
                                                border: selectedGallery.templateId === tpl.id ? '1px solid #111827' : '1px solid #d1d5db',
                                                background: selectedGallery.templateId === tpl.id ? '#111827' : '#ffffff',
                                                color: selectedGallery.templateId === tpl.id ? '#ffffff' : '#374151',
                                                fontSize: '0.72rem',
                                                fontWeight: '600',
                                                whiteSpace: 'nowrap',
                                                cursor: 'pointer',
                                                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                                            }}
                                        >
                                            {tpl.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sub-Tabs: Cover | Grid | Fonts | Color */}
                            <div style={{
                                display: 'flex',
                                borderBottom: '1px solid #e5e7eb',
                                background: '#ffffff',
                                position: 'sticky',
                                top: 0,
                                zIndex: 10,
                            }}>
                                {[
                                    { id: 'cover', label: 'Cover' },
                                    { id: 'grid', label: 'Grid' },
                                    { id: 'fonts', label: 'Fonts' },
                                    { id: 'color', label: 'Color' },
                                ].map((st) => (
                                    <button
                                        key={st.id}
                                        onClick={() => setDesignSubTab(st.id)}
                                        style={{
                                            flex: 1,
                                            padding: '12px 0',
                                            border: 'none',
                                            background: 'transparent',
                                            color: designSubTab === st.id ? '#111827' : '#6b7280',
                                            fontWeight: designSubTab === st.id ? '700' : '500',
                                            fontSize: '0.85rem',
                                            cursor: 'pointer',
                                            borderBottom: designSubTab === st.id ? '2px solid #2563eb' : '2px solid transparent',
                                            textAlign: 'center',
                                        }}
                                    >
                                        {st.label}
                                    </button>
                                ))}
                            </div>

                            {/* SUB-TAB CONTENT */}
                            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {/* 1. COVER SUB-TAB (MATCHING SCREENSHOT 1) */}
                                {designSubTab === 'cover' && (
                                    <>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#111827' }}>
                                                Cover layout
                                            </span>
                                            <button
                                                onClick={() => triggerToast('Focal point adjusted', 'Cover centered on primary subject')}
                                                style={{
                                                    background: 'transparent',
                                                    border: 'none',
                                                    color: '#2563eb',
                                                    fontSize: '0.78rem',
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                }}
                                            >
                                                <Target size={13} />
                                                <span>Focal point</span>
                                            </button>
                                        </div>

                                        {/* 10 Cover Layout Option Cards (2 Columns) */}
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                                            {[
                                                { id: 'none', label: 'None' },
                                                { id: 'split', label: 'Split' },
                                                { id: 'title_above', label: 'Title above' },
                                                { id: 'title_below', label: 'Title below' },
                                                { id: 'editorial_1', label: 'Editorial 1' },
                                                { id: 'editorial_2', label: 'Editorial 2' },
                                                { id: 'framed', label: 'Framed' },
                                                { id: 'modern', label: 'Modern' },
                                                { id: 'overlay', label: 'Overlay' },
                                                { id: 'dark_overlay', label: 'Dark overlay' },
                                            ].map((cov) => {
                                                const isSelected = currentDesign.coverLayout === cov.id;
                                                return (
                                                    <div
                                                        key={cov.id}
                                                        onClick={() => updateDesign('coverLayout', cov.id)}
                                                        style={{
                                                            border: isSelected ? '1.5px solid #111827' : '1px solid #e5e7eb',
                                                            borderRadius: '8px',
                                                            padding: '6px',
                                                            cursor: 'pointer',
                                                            background: isSelected ? '#fafafa' : '#ffffff',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            transition: 'all 0.15s ease',
                                                        }}
                                                    >
                                                        {/* Thumbnail Graphic Preview */}
                                                        <div style={{
                                                            width: '100%',
                                                            height: '64px',
                                                            background: '#f9fafb',
                                                            borderRadius: '4px',
                                                            overflow: 'hidden',
                                                            position: 'relative',
                                                            border: '1px solid #f1f3f5',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                        }}>
                                                            {cov.id === 'none' && (
                                                                <svg width="100%" height="100%">
                                                                    <line x1="0" y1="64" x2="100%" y2="0" stroke="#cbd5e1" strokeWidth="1" />
                                                                </svg>
                                                            )}
                                                            {cov.id === 'split' && (
                                                                <div style={{ display: 'flex', width: '100%', height: '100%' }}>
                                                                    <div style={{ width: '45%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4px' }}>
                                                                        <div style={{ width: '60%', height: '3px', background: '#9ca3af', marginBottom: '2px' }} />
                                                                        <div style={{ width: '40%', height: '2px', background: '#cbd5e1' }} />
                                                                    </div>
                                                                    <div style={{ width: '55%', height: '100%', overflow: 'hidden' }}>
                                                                        <img src={plantCoverImg} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {cov.id === 'title_above' && (
                                                                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
                                                                    <div style={{ height: '35%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                        <div style={{ width: '50%', height: '3px', background: '#9ca3af' }} />
                                                                    </div>
                                                                    <div style={{ height: '65%', width: '100%' }}>
                                                                        <img src={plantCoverImg} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {cov.id === 'title_below' && (
                                                                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
                                                                    <div style={{ height: '65%', width: '100%' }}>
                                                                        <img src={plantCoverImg} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                                    </div>
                                                                    <div style={{ height: '35%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                        <div style={{ width: '50%', height: '3px', background: '#9ca3af' }} />
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {cov.id === 'framed' && (
                                                                <div style={{ padding: '6px', width: '100%', height: '100%', boxSizing: 'border-box' }}>
                                                                    <div style={{ width: '100%', height: '100%', border: '1px solid #cbd5e1', overflow: 'hidden' }}>
                                                                        <img src={plantCoverImg} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {['editorial_1', 'editorial_2', 'modern', 'overlay', 'dark_overlay'].includes(cov.id) && (
                                                                <img
                                                                    src={plantCoverImg}
                                                                    alt={cov.label}
                                                                    style={{
                                                                        width: '100%',
                                                                        height: '100%',
                                                                        objectFit: 'cover',
                                                                        filter: cov.id === 'dark_overlay' ? 'brightness(0.6)' : 'none',
                                                                    }}
                                                                />
                                                            )}
                                                        </div>
                                                        <span style={{ fontSize: '0.76rem', color: isSelected ? '#111827' : '#6b7280', fontWeight: isSelected ? '600' : '400', marginTop: '6px' }}>
                                                            {cov.label}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Logo Option Section */}
                                        <div style={{ marginTop: '0.5rem' }}>
                                            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
                                                Logo
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                                                <div
                                                    onClick={() => updateDesign('logo', 'none')}
                                                    style={{
                                                        border: currentDesign.logo === 'none' ? '1.5px solid #111827' : '1px solid #e5e7eb',
                                                        borderRadius: '8px',
                                                        padding: '6px',
                                                        cursor: 'pointer',
                                                        textAlign: 'center',
                                                        background: currentDesign.logo === 'none' ? '#fafafa' : '#ffffff',
                                                    }}
                                                >
                                                    <div style={{ height: '54px', border: '1px solid #f1f3f5', borderRadius: '4px', position: 'relative' }}>
                                                        <svg width="100%" height="100%">
                                                            <line x1="0" y1="54" x2="100%" y2="0" stroke="#cbd5e1" strokeWidth="1" />
                                                        </svg>
                                                    </div>
                                                    <span style={{ fontSize: '0.76rem', color: '#4b5563', marginTop: '4px', display: 'block' }}>No logo</span>
                                                </div>

                                                <div
                                                    onClick={() => updateDesign('logo', 'use_logo')}
                                                    style={{
                                                        border: currentDesign.logo === 'use_logo' ? '1.5px solid #111827' : '1px solid #e5e7eb',
                                                        borderRadius: '8px',
                                                        padding: '6px',
                                                        cursor: 'pointer',
                                                        textAlign: 'center',
                                                        background: currentDesign.logo === 'use_logo' ? '#fafafa' : '#ffffff',
                                                    }}
                                                >
                                                    <div style={{
                                                        height: '54px',
                                                        border: '1px solid #f1f3f5',
                                                        borderRadius: '4px',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        background: '#f9fafb',
                                                        color: '#2563eb',
                                                        fontSize: '0.68rem',
                                                        padding: '4px',
                                                    }}>
                                                        <ExternalLink size={12} />
                                                        <span style={{ lineHeight: '1.2', marginTop: '2px' }}>Upload in gallery settings</span>
                                                    </div>
                                                    <span style={{ fontSize: '0.76rem', color: '#4b5563', marginTop: '4px', display: 'block' }}>Use logo</span>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* 2. GRID SUB-TAB (MATCHING SCREENSHOT 2) */}
                                {designSubTab === 'grid' && (
                                    <>
                                        {/* Grid style: Horizontal vs Vertical */}
                                        <div>
                                            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
                                                Grid style
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                                                {[
                                                    { id: 'horizontal', label: 'Horizontal' },
                                                    { id: 'vertical', label: 'Vertical' },
                                                ].map((g) => {
                                                    const isSelected = currentDesign.gridStyle === g.id;
                                                    return (
                                                        <div
                                                            key={g.id}
                                                            onClick={() => updateDesign('gridStyle', g.id)}
                                                            style={{
                                                                border: isSelected ? '1.5px solid #111827' : '1px solid #e5e7eb',
                                                                borderRadius: '8px',
                                                                padding: '10px',
                                                                cursor: 'pointer',
                                                                textAlign: 'center',
                                                                background: isSelected ? '#fafafa' : '#ffffff',
                                                            }}
                                                        >
                                                            {/* Visual diagram card matching screenshot 2 */}
                                                            <div style={{ height: '54px', display: 'flex', flexDirection: g.id === 'horizontal' ? 'column' : 'row', gap: '4px', padding: '4px', background: '#fafbfc', borderRadius: '4px' }}>
                                                                {g.id === 'horizontal' ? (
                                                                    <>
                                                                        <div style={{ display: 'flex', gap: '4px', flex: 1 }}>
                                                                            <div style={{ width: '40%', background: '#94a3b8', borderRadius: '2px' }} />
                                                                            <div style={{ width: '60%', background: '#94a3b8', borderRadius: '2px' }} />
                                                                        </div>
                                                                        <div style={{ display: 'flex', gap: '4px', flex: 1 }}>
                                                                            <div style={{ width: '70%', background: '#94a3b8', borderRadius: '2px' }} />
                                                                            <div style={{ width: '30%', background: '#94a3b8', borderRadius: '2px' }} />
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                                                                            <div style={{ height: '60%', background: '#94a3b8', borderRadius: '2px' }} />
                                                                            <div style={{ height: '40%', background: '#94a3b8', borderRadius: '2px' }} />
                                                                        </div>
                                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                                                                            <div style={{ height: '40%', background: '#94a3b8', borderRadius: '2px' }} />
                                                                            <div style={{ height: '60%', background: '#94a3b8', borderRadius: '2px' }} />
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </div>
                                                            <span style={{ fontSize: '0.8rem', fontWeight: isSelected ? '600' : '400', color: isSelected ? '#111827' : '#4b5563', marginTop: '6px', display: 'block' }}>
                                                                {g.label}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Thumbnail size: Standard vs Large */}
                                        <div>
                                            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
                                                Thumbnail size
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                                                {[
                                                    { id: 'standard', label: 'Standard', cols: 3 },
                                                    { id: 'large', label: 'Large', cols: 2 },
                                                ].map((t) => {
                                                    const isSelected = currentDesign.thumbnailSize === t.id;
                                                    return (
                                                        <div
                                                            key={t.id}
                                                            onClick={() => updateDesign('thumbnailSize', t.id)}
                                                            style={{
                                                                border: isSelected ? '1.5px solid #111827' : '1px solid #e5e7eb',
                                                                borderRadius: '8px',
                                                                padding: '10px',
                                                                cursor: 'pointer',
                                                                textAlign: 'center',
                                                                background: isSelected ? '#fafafa' : '#ffffff',
                                                            }}
                                                        >
                                                            <div style={{
                                                                height: '54px',
                                                                display: 'grid',
                                                                gridTemplateColumns: `repeat(${t.cols}, 1fr)`,
                                                                gap: '3px',
                                                                padding: '4px',
                                                                background: '#fafbfc',
                                                                borderRadius: '4px',
                                                            }}>
                                                                {Array.from({ length: t.cols * 2 }).map((_, i) => (
                                                                    <div key={i} style={{ background: '#94a3b8', borderRadius: '2px' }} />
                                                                ))}
                                                            </div>
                                                            <span style={{ fontSize: '0.8rem', fontWeight: isSelected ? '600' : '400', color: isSelected ? '#111827' : '#4b5563', marginTop: '6px', display: 'block' }}>
                                                                {t.label}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Grid spacing: Compact vs Wide */}
                                        <div>
                                            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
                                                Grid spacing
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                                                {[
                                                    { id: 'compact', label: 'Compact', gap: '2px' },
                                                    { id: 'wide', label: 'Wide', gap: '8px' },
                                                ].map((s) => {
                                                    const isSelected = currentDesign.gridSpacing === s.id;
                                                    return (
                                                        <div
                                                            key={s.id}
                                                            onClick={() => updateDesign('gridSpacing', s.id)}
                                                            style={{
                                                                border: isSelected ? '1.5px solid #111827' : '1px solid #e5e7eb',
                                                                borderRadius: '8px',
                                                                padding: '10px',
                                                                cursor: 'pointer',
                                                                textAlign: 'center',
                                                                background: isSelected ? '#fafafa' : '#ffffff',
                                                            }}
                                                        >
                                                            <div style={{
                                                                height: '54px',
                                                                display: 'grid',
                                                                gridTemplateColumns: 'repeat(2, 1fr)',
                                                                gap: s.gap,
                                                                padding: '4px',
                                                                background: '#fafbfc',
                                                                borderRadius: '4px',
                                                            }}>
                                                                {Array.from({ length: 4 }).map((_, i) => (
                                                                    <div key={i} style={{ background: '#94a3b8', borderRadius: '2px' }} />
                                                                ))}
                                                            </div>
                                                            <span style={{ fontSize: '0.8rem', fontWeight: isSelected ? '600' : '400', color: isSelected ? '#111827' : '#4b5563', marginTop: '6px', display: 'block' }}>
                                                                {s.label}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* 3. FONTS SUB-TAB (MATCHING SCREENSHOT 3) */}
                                {designSubTab === 'fonts' && (
                                    <>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                                            {[
                                                { id: 'simple', name: 'Simple', h: 'Heading', b: 'Body text', hFont: 'sans-serif', hWeight: '700' },
                                                { id: 'classic', name: 'Classic', h: 'HEADING', b: 'Body text', hFont: 'serif', hWeight: '400' },
                                                { id: 'minimal', name: 'Minimal', h: 'Heading', b: 'Body text', hFont: 'sans-serif', hWeight: '300' },
                                                { id: 'soft', name: 'Soft', h: 'Heading', b: 'Body text', hFont: 'serif', hWeight: '500' },
                                                { id: 'bold', name: 'Bold', h: 'HEADING', b: 'Body text', hFont: 'sans-serif', hWeight: '900' },
                                            ].map((f) => {
                                                const isSelected = currentDesign.fontPreset === f.id;
                                                return (
                                                    <div
                                                        key={f.id}
                                                        onClick={() => updateDesign('fontPreset', f.id)}
                                                        style={{
                                                            border: isSelected ? '1.5px solid #111827' : '1px solid #e5e7eb',
                                                            borderRadius: '8px',
                                                            padding: '16px 12px',
                                                            cursor: 'pointer',
                                                            background: isSelected ? '#fafafa' : '#ffffff',
                                                            textAlign: 'left',
                                                            boxShadow: isSelected ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
                                                        }}
                                                    >
                                                        <div style={{
                                                            fontSize: '1.05rem',
                                                            fontFamily: f.hFont,
                                                            fontWeight: f.hWeight,
                                                            color: '#111827',
                                                            marginBottom: '2px',
                                                        }}>
                                                            {f.h}
                                                        </div>
                                                        <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>
                                                            {f.b}
                                                        </div>
                                                        <div style={{ fontSize: '0.76rem', color: '#9ca3af', marginTop: '10px' }}>
                                                            {f.name}
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                            {/* + Select Custom Card */}
                                            <div
                                                onClick={() => setShowCustomFontModal(true)}
                                                style={{
                                                    border: '1.5px dashed #3b82f6',
                                                    borderRadius: '8px',
                                                    padding: '16px 12px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    background: '#eff6ff',
                                                    color: '#2563eb',
                                                }}
                                            >
                                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', fontWeight: '600' }}>
                                                    <Plus size={16} /> Select
                                                </div>
                                                <div style={{ fontSize: '0.76rem', color: '#6b7280', marginTop: '8px' }}>Custom</div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* 4. COLOR SUB-TAB (MATCHING SCREENSHOT 4) */}
                                {designSubTab === 'color' && (
                                    <>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                                            {Object.entries(colorPresets).map(([key, col]) => {
                                                const isSelected = currentDesign.colorPreset === key;
                                                return (
                                                    <div
                                                        key={key}
                                                        onClick={() => updateDesign('colorPreset', key)}
                                                        style={{
                                                            border: isSelected ? '1.5px solid #111827' : '1px solid #e5e7eb',
                                                            borderRadius: '8px',
                                                            padding: '14px 10px',
                                                            cursor: 'pointer',
                                                            background: isSelected ? '#fafafa' : '#ffffff',
                                                            textAlign: 'center',
                                                            boxShadow: isSelected ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
                                                        }}
                                                    >
                                                        {/* Swatch Preview with 2 circles matching screenshot 4 */}
                                                        <div style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            gap: '8px',
                                                            marginBottom: '8px',
                                                        }}>
                                                            <div style={{
                                                                width: '26px',
                                                                height: '26px',
                                                                borderRadius: '50%',
                                                                background: col.circle1,
                                                                border: '1px solid #d1d5db',
                                                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                                            }} />
                                                            <div style={{
                                                                width: '26px',
                                                                height: '26px',
                                                                borderRadius: '50%',
                                                                background: col.circle2,
                                                                border: '1px solid #d1d5db',
                                                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                                            }} />
                                                        </div>
                                                        <div style={{ fontSize: '0.82rem', fontWeight: isSelected ? '600' : '400', color: '#111827' }}>
                                                            {col.title}
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                            {/* + Select Custom Color Card */}
                                            <div
                                                onClick={() => setShowCustomColorModal(true)}
                                                style={{
                                                    border: '1.5px dashed #3b82f6',
                                                    borderRadius: '8px',
                                                    padding: '14px 10px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    background: '#eff6ff',
                                                    color: '#2563eb',
                                                }}
                                            >
                                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.88rem', fontWeight: '600' }}>
                                                    <Plus size={16} /> Select
                                                </div>
                                                <div style={{ fontSize: '0.76rem', color: '#6b7280', marginTop: '8px' }}>Custom</div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* RIGHT LIVE PREVIEW CANVAS AREA */}
                        <div style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            padding: '1.5rem',
                            overflowY: 'auto',
                        }}>
                            {/* Device Mode Toggle Bar (Desktop vs Mobile) */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                background: '#e2e8f0',
                                borderRadius: '9999px',
                                padding: '3px',
                                marginBottom: '1.5rem',
                            }}>
                                <button
                                    onClick={() => updateDesign('deviceMode', 'desktop')}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '5px 14px',
                                        borderRadius: '9999px',
                                        border: 'none',
                                        background: currentDesign.deviceMode === 'desktop' ? '#ffffff' : 'transparent',
                                        color: currentDesign.deviceMode === 'desktop' ? '#111827' : '#64748b',
                                        fontSize: '0.78rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        boxShadow: currentDesign.deviceMode === 'desktop' ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
                                    }}
                                >
                                    <Monitor size={14} />
                                    <span>Desktop</span>
                                </button>

                                <button
                                    onClick={() => updateDesign('deviceMode', 'mobile')}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '5px 14px',
                                        borderRadius: '9999px',
                                        border: 'none',
                                        background: currentDesign.deviceMode === 'mobile' ? '#ffffff' : 'transparent',
                                        color: currentDesign.deviceMode === 'mobile' ? '#111827' : '#64748b',
                                        fontSize: '0.78rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        boxShadow: currentDesign.deviceMode === 'mobile' ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
                                    }}
                                >
                                    <Smartphone size={14} />
                                    <span>Mobile</span>
                                </button>
                            </div>

                            {/* Rendered Live Canvas */}
                            {renderClientGalleryCanvas(false)}
                        </div>
                    </div>
                )}

                {/* =========================================================================
                    TAB 2: MEDIA TAB
                   ========================================================================= */}
                {detailTab === 'media' && (
                    <div style={{ flex: 1, padding: '1.75rem 2.5rem', display: 'flex', gap: '2.5rem' }}>
                        {/* Left Column: Gallery Cover & Sets */}
                        <div style={{ width: '220px', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#6b7280', letterSpacing: '0.06em', marginBottom: '0.65rem' }}>
                                GALLERY COVER
                            </div>
                            <div
                                onClick={() => triggerToast('Change cover', 'Click any photo below to set as cover')}
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
                                <img src={selectedGallery.plantCover || plantCoverImg} alt="Gallery cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0, 0, 0, 0.35)', opacity: 0, transition: 'opacity 0.15s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: '0.75rem', fontWeight: '600' }}
                                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
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
                                    onClick={() => {
                                        const setName = prompt('Enter new set name:', 'Reception');
                                        if (setName && setName.trim()) {
                                            const newSet = { id: `set-${Date.now()}`, name: setName.trim(), items: [] };
                                            const updated = { ...selectedGallery, sets: [...selectedGallery.sets, newSet] };
                                            setSelectedGallery(updated);
                                            setGalleries((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
                                            setSelectedSetId(newSet.id);
                                            triggerToast('Set created', `"${setName}" added`);
                                        }
                                    }}
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 10px', border: 'none', background: 'transparent', color: '#4b5563', fontSize: '0.82rem', cursor: 'pointer', textAlign: 'left', marginTop: '4px' }}
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
                                        onClick={handleUploadFiles}
                                        style={{ background: 'transparent', border: 'none', color: '#2563eb', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}
                                    >
                                        + Upload from computer
                                    </button>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <button
                                            onClick={handleUploadFiles}
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
                                                onClick={() => {
                                                    const updated = { ...selectedGallery, plantCover: item.url, coverImage: item.url };
                                                    setSelectedGallery(updated);
                                                    setGalleries((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
                                                    triggerToast('Cover updated', 'Set photo as gallery cover');
                                                }}
                                            >
                                                <img src={item.url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                )}

                {/* =========================================================================
                    TAB 3: SETTINGS TAB
                   ========================================================================= */}
                {detailTab === 'settings' && (
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
                                    value={selectedGallery.settings?.downloadPin || '4829'}
                                    onChange={(e) => {
                                        const updated = { ...selectedGallery, settings: { ...selectedGallery.settings, downloadPin: e.target.value } };
                                        setSelectedGallery(updated);
                                    }}
                                    style={{ width: '140px', padding: '8px 12px', fontSize: '1rem', fontWeight: '700', letterSpacing: '0.15em', borderRadius: '6px', border: '1px solid #cbd5e1' }}
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
                                        checked={selectedGallery.settings?.requireEmail || false}
                                        onChange={(e) => {
                                            const updated = { ...selectedGallery, settings: { ...selectedGallery.settings, requireEmail: e.target.checked } };
                                            setSelectedGallery(updated);
                                        }}
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
                                        checked={selectedGallery.settings?.allowHighRes !== false}
                                        onChange={(e) => {
                                            const updated = { ...selectedGallery, settings: { ...selectedGallery.settings, allowHighRes: e.target.checked } };
                                            setSelectedGallery(updated);
                                        }}
                                    />
                                    <label htmlFor="allowHighRes" style={{ fontSize: '0.84rem', color: '#374151', cursor: 'pointer' }}>
                                        Allow single-photo and full collection original print-ready downloads
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* =========================================================================
                    TAB 4: STORE TAB
                   ========================================================================= */}
                {detailTab === 'store' && (
                    <div style={{ flex: 1, padding: '2rem 3rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827', margin: 0 }}>
                                    Client Print Store
                                </h2>
                                <p style={{ fontSize: '0.82rem', color: '#6b7280', margin: '4px 0 0 0' }}>
                                    Sell high-quality prints, fine art frames, and linen albums fulfilled automatically by professional labs.
                                </p>
                            </div>
                            <span style={{ background: '#ecfdf5', color: '#059669', padding: '4px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: '600' }}>
                                Store Active
                            </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                            {[
                                { title: 'Fine Art Prints', price: '$25.00+', markup: '300% markup' },
                                { title: 'Linen Album (10x10)', price: '$350.00', markup: '$180 profit' },
                                { title: 'Canvas Gallery Wrap', price: '$120.00+', markup: '250% markup' },
                                { title: 'Digital Download Bundle', price: '$95.00', markup: '100% profit' },
                            ].map((item, idx) => (
                                <div key={idx} style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                                    <ShoppingBag size={20} color="#2563eb" />
                                    <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#111827', margin: '8px 0 4px 0' }}>{item.title}</h3>
                                    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#111827' }}>{item.price}</div>
                                    <div style={{ fontSize: '0.74rem', color: '#059669', fontWeight: '600', marginTop: '2px' }}>{item.markup}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* =========================================================================
                    TAB 5: ACTIVITY TAB
                   ========================================================================= */}
                {detailTab === 'activity' && (
                    <div style={{ flex: 1, padding: '2rem 3rem', maxWidth: '880px' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827', marginBottom: '1.5rem' }}>
                            Gallery Analytics & Activity
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                            <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.25rem' }}>
                                <div style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600' }}>Total Views</div>
                                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#111827', marginTop: '4px' }}>142</div>
                            </div>
                            <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.25rem' }}>
                                <div style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600' }}>Unique Visitors</div>
                                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#111827', marginTop: '4px' }}>38</div>
                            </div>
                            <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.25rem' }}>
                                <div style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600' }}>Downloads</div>
                                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#111827', marginTop: '4px' }}>56</div>
                            </div>
                            <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.25rem' }}>
                                <div style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600' }}>Favorites</div>
                                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#111827', marginTop: '4px' }}>
                                    {Object.values(favorites).filter(Boolean).length || 29}
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity Log */}
                        <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.25rem' }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#111827', marginBottom: '1rem' }}>
                                Live Client Event Stream
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {(selectedGallery.activity || [
                                    { id: '1', text: 'Gallery published by owner', time: '10 mins ago', type: 'publish' },
                                    { id: '2', text: 'PIN 4829 used for full download', time: '2 hours ago', type: 'download' },
                                    { id: '3', text: 'Client opened mobile view', time: 'Yesterday', type: 'view' },
                                ]).map((act) => (
                                    <div key={act.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#f8fafc', borderRadius: '6px', fontSize: '0.82rem' }}>
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
                )}

                {/* =========================================================================
                    FULLSCREEN INTERACTIVE CLIENT PREVIEW MODAL
                   ========================================================================= */}
                {showFullscreenPreview && (
                    <div style={{
                        position: 'fixed',
                        inset: 0,
                        background: '#0f172a',
                        zIndex: 9000,
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        {/* Top Bar with Device Mode Selector & Close */}
                        <div style={{
                            height: '52px',
                            background: '#1e293b',
                            borderBottom: '1px solid #334155',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0 1.5rem',
                            color: '#ffffff',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Eye size={16} color="#38bdf8" />
                                <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Client Live Preview</span>
                                <span style={{ fontSize: '0.72rem', background: '#334155', padding: '2px 8px', borderRadius: '10px' }}>
                                    {selectedGallery.name}
                                </span>
                            </div>

                            {/* Device Mode Toggle inside Preview */}
                            <div style={{ display: 'flex', alignItems: 'center', background: '#0f172a', borderRadius: '9999px', padding: '2px' }}>
                                <button
                                    onClick={() => setPreviewDeviceMode('desktop')}
                                    style={{
                                        background: previewDeviceMode === 'desktop' ? '#334155' : 'transparent',
                                        color: '#ffffff',
                                        border: 'none',
                                        borderRadius: '9999px',
                                        padding: '4px 12px',
                                        fontSize: '0.75rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                    }}
                                >
                                    <Monitor size={12} /> Desktop
                                </button>
                                <button
                                    onClick={() => setPreviewDeviceMode('mobile')}
                                    style={{
                                        background: previewDeviceMode === 'mobile' ? '#334155' : 'transparent',
                                        color: '#ffffff',
                                        border: 'none',
                                        borderRadius: '9999px',
                                        padding: '4px 12px',
                                        fontSize: '0.75rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                    }}
                                >
                                    <Smartphone size={12} /> Mobile
                                </button>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <button
                                    onClick={() => setShowShareModal(true)}
                                    style={{
                                        background: '#38bdf8',
                                        color: '#0f172a',
                                        border: 'none',
                                        borderRadius: '6px',
                                        padding: '5px 12px',
                                        fontSize: '0.78rem',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                    }}
                                >
                                    <Share2 size={13} />
                                    <span>Share</span>
                                </button>

                                <button
                                    onClick={() => setShowFullscreenPreview(false)}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#94a3b8',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        fontSize: '0.82rem',
                                        padding: '4px 8px',
                                    }}
                                >
                                    <X size={18} />
                                    <span>Close</span>
                                </button>
                            </div>
                        </div>

                        {/* Scrollable Viewport */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: previewDeviceMode === 'mobile' ? '2rem 0' : '0' }}>
                            {renderClientGalleryCanvas(true, previewDeviceMode)}
                        </div>
                    </div>
                )}

                {/* =========================================================================
                    LIGHTBOX MODAL FOR FULL SCREEN PHOTO VIEWING
                   ========================================================================= */}
                {lightboxIndex !== null && (
                    <div style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.95)',
                        zIndex: 10000,
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '1rem 1.5rem',
                            color: '#ffffff',
                        }}>
                            <span style={{ fontSize: '0.85rem' }}>
                                {lightboxIndex + 1} of {allGalleryItems.length} • {allGalleryItems[lightboxIndex]?.title || 'Photograph'}
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                <button
                                    onClick={() => {
                                        const currentId = allGalleryItems[lightboxIndex]?.id;
                                        setFavorites((prev) => ({ ...prev, [currentId]: !prev[currentId] }));
                                    }}
                                    style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer' }}
                                    title="Favorite"
                                >
                                    <Heart size={20} fill={favorites[allGalleryItems[lightboxIndex]?.id] ? '#ef4444' : 'none'} color={favorites[allGalleryItems[lightboxIndex]?.id] ? '#ef4444' : '#ffffff'} />
                                </button>

                                <button
                                    onClick={() => triggerToast('High-Res Ready', `PIN verified: ${selectedGallery.settings?.downloadPin || '4829'}`)}
                                    style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer' }}
                                    title="Download"
                                >
                                    <Download size={20} />
                                </button>

                                <button
                                    onClick={() => setLightboxIndex(null)}
                                    style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer' }}
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                            <button
                                onClick={() => setLightboxIndex((curr) => (curr > 0 ? curr - 1 : allGalleryItems.length - 1))}
                                style={{
                                    position: 'absolute',
                                    left: '20px',
                                    background: 'rgba(255,255,255,0.1)',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '44px',
                                    height: '44px',
                                    fontSize: '1.5rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                ‹
                            </button>

                            <img
                                src={allGalleryItems[lightboxIndex]?.url}
                                alt="Full size"
                                style={{ maxWidth: '90%', maxHeight: '82vh', objectFit: 'contain', borderRadius: '4px' }}
                            />

                            <button
                                onClick={() => setLightboxIndex((curr) => (curr < allGalleryItems.length - 1 ? curr + 1 : 0))}
                                style={{
                                    position: 'absolute',
                                    right: '20px',
                                    background: 'rgba(255,255,255,0.1)',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '44px',
                                    height: '44px',
                                    fontSize: '1.5rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                ›
                            </button>
                        </div>
                    </div>
                )}

                {/* =========================================================================
                    COMPREHENSIVE SHARE & PUBLISH MODAL
                   ========================================================================= */}
                {showShareModal && (
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
                                    onClick={() => setShowShareModal(false)}
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
                                            onClick={() => {
                                                setShowShareModal(false);
                                                setShowFullscreenPreview(true);
                                            }}
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
                                        {/* Mock vector QR pattern */}
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
                                        onClick={() => triggerToast('QR Code saved', 'PNG ready for print materials')}
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
                )}

                {/* CUSTOM COLOR PALETTE MODAL */}
                {showCustomColorModal && (
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
                                <button onClick={() => setShowCustomColorModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
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
                                        setShowCustomColorModal(false);
                                        triggerToast('Custom colors set', 'Applied tailored color tokens');
                                    }}
                                    style={{ background: '#111827', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '8px', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', marginTop: '6px' }}
                                >
                                    Apply Colors
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* CUSTOM FONT MODAL */}
                {showCustomFontModal && (
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
                                <button onClick={() => setShowCustomFontModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                                    <X size={16} />
                                </button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {['Cormorant Garamond', 'Cinzel Luxury', 'Montserrat Urban', 'Outfit Minimal', 'Lora Romantic'].map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => {
                                            setShowCustomFontModal(false);
                                            triggerToast('Font applied', `Switched heading to "${f}"`);
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
                )}

                {/* TOAST NOTIFICATION */}
                {toast.show && (
                    <div style={{
                        position: 'fixed',
                        bottom: '24px',
                        left: '260px',
                        background: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        minWidth: '220px',
                        zIndex: 2000,
                    }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                            <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                                <Check size={12} color="#ffffff" strokeWidth={3} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#111827' }}>{toast.title}</div>
                                <div style={{ fontSize: '0.74rem', color: '#6b7280', marginTop: '1px' }}>{toast.subtitle}</div>
                            </div>
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

    // =========================================================================
    // 6. GALLERIES DIRECTORY & DESIGN TEMPLATES SHOWCASE VIEW
    // =========================================================================
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
                        onClick={() => triggerToast('Gallery settings', 'Opening global gallery configuration')}
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
                        onClick={() => setShowCreateModal(true)}
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
                            if (name) triggerToast('Folder created', `Folder "${name}" added`);
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
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {/* Templates Banner & Category Pills */}
                            <div style={{
                                background: 'linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%)',
                                border: '1px solid #e2e8f0',
                                borderRadius: '12px',
                                padding: '1.5rem 1.75rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: '1rem',
                            }}>
                                <div>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#eff6ff', color: '#2563eb', padding: '3px 10px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>
                                        <Sparkles size={12} />
                                        <span>Intuitive Ready-to-Publish Templates</span>
                                    </div>
                                    <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#111827', margin: '0 0 4px 0' }}>
                                        Curated Gallery Design Templates
                                    </h2>
                                    <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0, maxWidth: '580px' }}>
                                        Every template comes with curated cover compositions, responsive masonry, refined font pairings, and harmonious color palettes. Preview, customize, publish, and share directly with your clients.
                                    </p>
                                </div>

                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                    {['ALL', 'Editorial', 'Fine Art', 'Modern', 'Minimalist'].map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setTemplateFilterCategory(cat)}
                                            style={{
                                                padding: '5px 12px',
                                                borderRadius: '9999px',
                                                border: templateFilterCategory === cat ? '1px solid #111827' : '1px solid #cbd5e1',
                                                background: templateFilterCategory === cat ? '#111827' : '#ffffff',
                                                color: templateFilterCategory === cat ? '#ffffff' : '#475569',
                                                fontSize: '0.76rem',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Templates Grid Cards */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.5rem' }}>
                                {filteredTemplates.map((template) => (
                                    <div
                                        key={template.id}
                                        style={{
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '12px',
                                            overflow: 'hidden',
                                            background: '#ffffff',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-3px)';
                                            e.currentTarget.style.boxShadow = '0 12px 24px -4px rgba(0,0,0,0.1)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                                        }}
                                    >
                                        {/* Card Thumbnail with Badge */}
                                        <div style={{ height: '180px', position: 'relative', overflow: 'hidden', background: '#f1f5f9' }}>
                                            <img
                                                src={template.coverImage}
                                                alt={template.name}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                            <div style={{
                                                position: 'absolute',
                                                top: '12px',
                                                left: '12px',
                                                background: 'rgba(255, 255, 255, 0.92)',
                                                backdropFilter: 'blur(4px)',
                                                padding: '3px 8px',
                                                borderRadius: '12px',
                                                fontSize: '0.7rem',
                                                fontWeight: '700',
                                                color: '#111827',
                                            }}>
                                                {template.badge}
                                            </div>

                                            <div style={{
                                                position: 'absolute',
                                                bottom: '10px',
                                                right: '10px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                background: 'rgba(0,0,0,0.6)',
                                                backdropFilter: 'blur(4px)',
                                                color: '#ffffff',
                                                padding: '3px 8px',
                                                borderRadius: '4px',
                                                fontSize: '0.68rem',
                                                fontWeight: '600',
                                                textTransform: 'uppercase',
                                            }}>
                                                <span>{template.coverLayout} layout</span>
                                            </div>
                                        </div>

                                        {/* Card Details */}
                                        <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '700', color: '#111827' }}>
                                                    {template.name}
                                                </h3>
                                                <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: '500' }}>
                                                    {template.category}
                                                </span>
                                            </div>

                                            <p style={{ fontSize: '0.78rem', color: '#6b7280', margin: '4px 0 12px 0', lineHeight: '1.45', flex: 1 }}>
                                                {template.description}
                                            </p>

                                            {/* Design System Metadata Chips */}
                                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                                                <span style={{ background: '#f1f5f9', color: '#475569', fontSize: '0.68rem', padding: '2px 7px', borderRadius: '4px', fontWeight: '500' }}>
                                                    Grid: {template.gridStyle}
                                                </span>
                                                <span style={{ background: '#f1f5f9', color: '#475569', fontSize: '0.68rem', padding: '2px 7px', borderRadius: '4px', fontWeight: '500' }}>
                                                    Font: {template.fontPreset}
                                                </span>
                                                <span style={{ background: '#f1f5f9', color: '#475569', fontSize: '0.68rem', padding: '2px 7px', borderRadius: '4px', fontWeight: '500' }}>
                                                    Color: {template.colorPreset}
                                                </span>
                                            </div>

                                            {/* 3 Action Buttons: Preview | Use Template | Publish & Share */}
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                                                <button
                                                    onClick={() => handlePreviewTemplate(template)}
                                                    style={{
                                                        background: '#ffffff',
                                                        border: '1px solid #d1d5db',
                                                        borderRadius: '6px',
                                                        padding: '7px 12px',
                                                        fontSize: '0.78rem',
                                                        fontWeight: '600',
                                                        color: '#374151',
                                                        cursor: 'pointer',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '5px',
                                                    }}
                                                >
                                                    <Eye size={13} />
                                                    <span>Preview</span>
                                                </button>

                                                <button
                                                    onClick={() => handleCreateFromTemplate(template, false)}
                                                    style={{
                                                        background: '#111827',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        padding: '7px 12px',
                                                        fontSize: '0.78rem',
                                                        fontWeight: '600',
                                                        color: '#ffffff',
                                                        cursor: 'pointer',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '5px',
                                                    }}
                                                >
                                                    <Plus size={13} />
                                                    <span>Use Template</span>
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => handleCreateFromTemplate(template, true)}
                                                style={{
                                                    background: 'transparent',
                                                    border: 'none',
                                                    color: '#2563eb',
                                                    fontSize: '0.76rem',
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                    marginTop: '8px',
                                                    textAlign: 'center',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '4px',
                                                }}
                                            >
                                                <Share2 size={12} />
                                                <span>Publish & Share directly</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
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

                            {/* MAIN GALLERIES VIEW (EMPTY OR GRID) */}
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
                                        onClick={() => setShowCreateModal(true)}
                                        style={{ background: 'transparent', border: 'none', color: '#2563eb', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}
                                    >
                                        + Create gallery
                                    </button>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 280px))', gap: '1.5rem' }}>
                                    {filteredGalleries.map((gal) => {
                                        const totalItems = gal.sets?.reduce((acc, s) => acc + (s.items?.length || 0), 0) || 0;
                                        return (
                                            <div
                                                key={gal.id}
                                                onClick={() => {
                                                    setSelectedGallery(gal);
                                                    setSelectedSetId(gal.sets?.[0]?.id || 'set-highlights');
                                                    setView('detail');
                                                    setDetailTab('design');
                                                }}
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
                                                            setSelectedGallery(gal);
                                                            setShowFullscreenPreview(true);
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
                                                                if (confirm(`Delete gallery "${gal.name}"?`)) {
                                                                    setGalleries(galleries.filter((item) => item.id !== gal.id));
                                                                    triggerToast('Gallery deleted', `${gal.name} was removed`);
                                                                }
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
                                                                        setSelectedGallery(gal);
                                                                        setShowShareModal(true);
                                                                    }}
                                                                    style={{ background: 'transparent', border: 'none', color: '#2563eb', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}
                                                                    title="Share link"
                                                                >
                                                                    <Share2 size={14} />
                                                                </button>
                                                            )}

                                                            <button
                                                                onClick={(e) => toggleStar(e, gal.id)}
                                                                style={{ background: 'transparent', border: 'none', color: gal.starred ? '#eab308' : '#9ca3af', cursor: 'pointer', padding: '2px' }}
                                                            >
                                                                <Star size={15} fill={gal.starred ? '#eab308' : 'none'} />
                                                            </button>
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

            {/* CREATE GALLERY MODAL */}
            {showCreateModal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.45)',
                    backdropFilter: 'blur(2px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '1.5rem',
                }}>
                    <div style={{
                        background: '#ffffff',
                        borderRadius: '12px',
                        width: '100%',
                        maxWidth: '460px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.25)',
                        overflow: 'hidden',
                        padding: '1.75rem',
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom: '1.5rem' }}>
                            <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '700', color: '#111827' }}>
                                Create gallery
                            </h2>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                style={{ position: 'absolute', right: 0, background: 'transparent', border: 'none', cursor: 'pointer', color: '#4b5563', padding: '4px' }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateGallery} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.84rem', fontWeight: '500', color: '#1f2937', marginBottom: '6px' }}>
                                    <span>Project *</span>
                                    <Info size={14} color="#6b7280" />
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <select
                                        value={newGalleryProject}
                                        onChange={(e) => {
                                            setNewGalleryProject(e.target.value);
                                            setNewGalleryName(e.target.value);
                                        }}
                                        style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: 'none', background: '#f9fafb', fontSize: '0.85rem', color: '#111827', appearance: 'none', outline: 'none', cursor: 'pointer' }}
                                    >
                                        <option value="21">21</option>
                                        <option value="Test project">Test project</option>
                                        {projects.map((p) => (
                                            <option key={p.id} value={p.name || p.title}>{p.name || p.title}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={14} color="#6b7280" style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                                </div>
                            </div>

                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                    <label style={{ fontSize: '0.84rem', fontWeight: '500', color: '#1f2937' }}>
                                        Gallery name *
                                    </label>
                                    <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>{newGalleryName.length}/50</span>
                                </div>
                                <input
                                    value={newGalleryName}
                                    maxLength={50}
                                    onChange={(e) => setNewGalleryName(e.target.value)}
                                    required
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: 'none', background: '#f9fafb', fontSize: '0.85rem', color: '#111827', outline: 'none' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '500', color: '#1f2937', marginBottom: '6px' }}>
                                    Starting Design Template
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <select
                                        value={newGalleryTemplate}
                                        onChange={(e) => setNewGalleryTemplate(e.target.value)}
                                        style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: 'none', background: '#f9fafb', fontSize: '0.85rem', color: '#111827', appearance: 'none', outline: 'none', cursor: 'pointer' }}
                                    >
                                        {designTemplates.map((t) => (
                                            <option key={t.id} value={t.id}>{t.name} ({t.category})</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={14} color="#6b7280" style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '500', color: '#1f2937', marginBottom: '6px' }}>
                                    Shoot date
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        value={newGalleryShootDate}
                                        onChange={(e) => setNewGalleryShootDate(e.target.value)}
                                        style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: 'none', background: '#f9fafb', fontSize: '0.85rem', color: '#111827', outline: 'none' }}
                                    />
                                    <Calendar size={14} color="#9ca3af" style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    style={{ background: 'transparent', border: 'none', color: '#111827', fontSize: '0.88rem', fontWeight: '600', cursor: 'pointer' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{ background: '#111827', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '9px 24px', fontSize: '0.88rem', fontWeight: '600', cursor: 'pointer' }}
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* TOAST NOTIFICATION */}
            {toast.show && (
                <div style={{
                    position: 'fixed',
                    bottom: '24px',
                    left: '260px',
                    background: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    minWidth: '220px',
                    zIndex: 2000,
                }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                            <Check size={12} color="#ffffff" strokeWidth={3} />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#111827' }}>{toast.title}</div>
                            <div style={{ fontSize: '0.74rem', color: '#6b7280', marginTop: '1px' }}>{toast.subtitle}</div>
                        </div>
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
