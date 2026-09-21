import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchProjects, updateProjectStage } from '../api/projects';
import { DndContext, closestCorners, useDroppable, PointerSensor, KeyboardSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import AnalyticsPanel from '../components/AnalyticsPanel';
import ClientDirectoryModal from '../components/ClientDirectoryModal';
import CreateProjectModal from '../components/CreateProjectModal';
import ProjectWorkspace from '../components/ProjectWorkspace';

const STAGES = [
    { key: 'LEAD', label: 'New lead', color: '#8b5cf6' },
    { key: 'QUOTED', label: 'Contract signed', color: '#a855f7' },
    { key: 'BOOKED', label: 'Invoice paid', color: '#22c55e' },
    { key: 'IN_PROGRESS', label: 'In progress', color: '#10b981' },
    { key: 'DELIVERED', label: 'Delivered', color: '#3b82f6' },
    { key: 'PAID', label: 'Completed', color: '#06b6d4' },
];

function Column({ stageInfo, projects, onSelectProject }) {
    const { setNodeRef } = useDroppable({ id: stageInfo.key });

    return (
        <div
            ref={setNodeRef}
            style={{
                width: '270px',
                minWidth: '270px',
                flex: '0 0 270px',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.8rem',
            }}
        >
            {/* Column Header matching HoneyBook UI strictly */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.2rem 0.4rem' }}>
                <span style={{ fontWeight: '800', color: stageInfo.color, fontSize: '1.1rem', lineHeight: 1 }}>|</span>
                <span style={{ fontWeight: '700', fontSize: '0.92rem', color: '#1e293b' }}>
                    {stageInfo.label}
                </span>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '500', marginLeft: '0.2rem' }}>
                    {projects.length}
                </span>
            </div>

            <SortableContext
                items={projects.map((p) => p.id)}
                strategy={verticalListSortingStrategy}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, minHeight: '150px' }}>
                    {projects.map((project) => (
                        <Card
                            key={project.id}
                            project={project}
                            onSelectProject={onSelectProject}
                        />
                    ))}
                </div>
            </SortableContext>
        </div>
    );
}

function Card({ project, onSelectProject }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: project.id,
    });

    const style = {
        background: '#ffffff',
        border: isDragging ? '1px solid #6366f1' : '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '1.1rem 1.2rem',
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.6 : 1,
        boxShadow: isDragging ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : '0 1px 3px rgba(0, 0, 0, 0.03)',
        cursor: 'pointer',
        userSelect: 'none',
    };

    const clientName = project.client?.name || 'Unassigned Client';
    const clientInitials = clientName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase() || 'KM';

    const leadSource = project.leadSource || 'Lead form';
    const serviceType = project.serviceType || 'Consulting';

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={() => onSelectProject(project)}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    onSelectProject(project);
                }
            }}
        >
            {/* Project Title */}
            <h4 style={{
                fontSize: '1.02rem',
                fontWeight: '700',
                color: '#0f172a',
                marginBottom: '0.65rem',
                lineHeight: '1.3',
                letterSpacing: '-0.01em',
            }}>
                {project.title}
            </h4>

            {/* Field Metadata Rows */}
            <div style={{ fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '0.9rem' }}>
                <div style={{ color: '#94a3b8' }}>
                    Lead source: <span style={{ color: '#334155', fontWeight: '600' }}>{leadSource}</span>
                </div>
                <div style={{ color: '#94a3b8' }}>
                    Service type: <span style={{ color: '#334155', fontWeight: '600' }}>{serviceType}</span>
                </div>
                <div style={{ color: '#94a3b8' }}>
                    Contacts: <span style={{ color: '#334155', fontWeight: '600' }}>{clientName}</span>
                </div>
            </div>

            {/* Bottom Avatar Badge Circle */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: '#e2e8f0',
                    color: '#475569',
                    fontSize: '0.68rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    letterSpacing: '-0.02em',
                }}>
                    {clientInitials}
                </div>
            </div>
        </div>
    );
}

export default function Dashboard() {
    const { user, logout } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('pipeline'); // 'pipeline' | 'analytics'

    const [activeProjectDetail, setActiveProjectDetail] = useState(null);
    const [showNewProjectModal, setShowNewProjectModal] = useState(false);
    const [showClientDirectory, setShowClientDirectory] = useState(false);

    // Interactive + New Dropdown state
    const [showPlusNewMenu, setShowPlusNewMenu] = useState(false);

    // Active Sort & Filter state
    const [sortOption, setSortOption] = useState('title-asc'); // 'title-asc' | 'title-desc' | 'date-newest' | 'date-oldest'
    const [showSortMenu, setShowSortMenu] = useState(false);

    const [filterStage, setFilterStage] = useState('ALL');
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Dynamic Tab Navigation State
    const [tabs, setTabs] = useState([
        { id: 'main', label: 'Main view', icon: '🏠' }
    ]);
    const [activeViewTabId, setActiveViewTabId] = useState('main');
    const [showAddTabInput, setShowAddTabInput] = useState(false);
    const [newTabName, setNewTabName] = useState('');

    // Configure sensors so clicks register instantly on cards without triggering unwanted drags
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor)
    );

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = () => {
        fetchProjects()
            .then(setProjects)
            .finally(() => setLoading(false));
    };

    function moveProjectToStage(projectId, newStage) {
        setProjects((prev) =>
            prev.map((p) => (p.id === projectId ? { ...p, stage: newStage } : p))
        );
    }

    function handleDragEnd(event) {
        const { active, over } = event;
        if (!over) return;

        const projectId = active.id;
        let newStage = over.id;

        const validStageKeys = STAGES.map((s) => s.key);
        if (!validStageKeys.includes(newStage)) {
            const overProject = projects.find((p) => p.id === over.id);
            if (!overProject) return;
            newStage = overProject.stage;
        }

        const project = projects.find((p) => p.id === projectId);
        if (!project || project.stage === newStage) return;

        const previousStage = project.stage;
        moveProjectToStage(projectId, newStage);

        updateProjectStage(projectId, newStage).catch(() => {
            moveProjectToStage(projectId, previousStage);
        });
    }

    const handleAddTab = (e) => {
        e.preventDefault();
        if (newTabName.trim()) {
            const newTab = {
                id: `tab_${Date.now()}`,
                label: newTabName.trim(),
                icon: '📊'
            };
            setTabs([...tabs, newTab]);
            setActiveViewTabId(newTab.id);
            setNewTabName('');
            setShowAddTabInput(false);
        }
    };

    // Filter and Sort Project Cards
    let processedProjects = [...projects];

    // Search query filter
    if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        processedProjects = processedProjects.filter(p =>
            p.title.toLowerCase().includes(query) ||
            p.client?.name?.toLowerCase().includes(query)
        );
    }

    // Stage filter
    if (filterStage !== 'ALL') {
        processedProjects = processedProjects.filter(p => p.stage === filterStage);
    }

    // Sorting
    if (sortOption === 'title-asc') {
        processedProjects.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === 'title-desc') {
        processedProjects.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortOption === 'date-newest') {
        processedProjects.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sortOption === 'date-oldest') {
        processedProjects.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    }

    if (loading) {
        return (
            <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', color: '#64748b' }}>
                Loading Workspace...
            </div>
        );
    }

    return (
        <div style={{ width: '100%', minHeight: '100vh', display: 'flex', background: '#f8fafc' }}>
            {/* Left Vertical Dark Navigation Sidebar matching HoneyBook layout */}
            <aside style={{
                width: '64px',
                minWidth: '64px',
                background: '#090b10',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '1rem 0',
                borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                zIndex: 20,
            }}>
                {/* Brand Logo Box */}
                <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    background: '#000000',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontWeight: '900',
                    fontSize: '0.62rem',
                    lineHeight: '1',
                    marginBottom: '1.8rem',
                    cursor: 'pointer',
                }} title="Studio CRM">
                    <span>HY</span>
                    <span style={{ fontSize: '0.55rem', color: '#94a3b8' }}>BK</span>
                </div>

                {/* Vertical Navigation Icons */}
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', width: '100%', alignItems: 'center' }}>
                    <button style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '1.1rem', padding: '0.4rem', borderRadius: '8px' }} title="Launchpad">🚀</button>
                    <button style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '1.1rem', padding: '0.4rem', borderRadius: '8px' }} title="Home">🏠</button>

                    {/* Active Projects Item */}
                    <button
                        style={{
                            background: '#1e2430',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: '#ffffff',
                            fontSize: '1.1rem',
                            padding: '0.5rem',
                            borderRadius: '10px',
                        }}
                        title="Projects"
                        onClick={() => setActiveTab('pipeline')}
                    >
                        💼
                    </button>

                    <button style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '1.1rem', padding: '0.4rem', borderRadius: '8px' }} title="Clients" onClick={() => setShowClientDirectory(true)}>👤</button>
                    <button style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '1.1rem', padding: '0.4rem', borderRadius: '8px' }} title="Calendar">📅</button>
                    <button style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '1.1rem', padding: '0.4rem', borderRadius: '8px' }} title="Proposals">📑</button>
                    <button style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '1.1rem', padding: '0.4rem', borderRadius: '8px' }} title="Templates">🗂️</button>
                    <button style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '1.1rem', padding: '0.4rem', borderRadius: '8px' }} title="Tasks">📋</button>
                    <button style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '1.1rem', padding: '0.4rem', borderRadius: '8px' }} title="Finances">💲</button>
                    <button style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '1.1rem', padding: '0.4rem', borderRadius: '8px' }} title="Analytics" onClick={() => setActiveTab('analytics')}>📊</button>
                </nav>

                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.9rem', alignItems: 'center' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>
                        💎
                    </div>
                    <button style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '1.1rem', padding: '0.4rem', borderRadius: '8px' }} title="Settings" onClick={logout}>⚙️</button>
                </div>
            </aside>

            {/* Main Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                {/* Top Header Bar */}
                <header style={{
                    height: '56px',
                    background: '#ffffff',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 1.5rem',
                }}>
                    {/* Left: Capsule Search input */}
                    <div style={{ position: 'relative', width: '240px' }}>
                        <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.85rem' }}>🔍</span>
                        <input
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                height: '34px',
                                paddingLeft: '32px',
                                background: '#f1f5f9',
                                border: 'none',
                                borderRadius: '20px',
                                fontSize: '0.82rem',
                                color: '#334155',
                            }}
                        />
                    </div>

                    {/* Right: Notifications, AI button, + New Dropdown */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', position: 'relative' }}>
                        <button style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '1.05rem', padding: '0.3rem' }} title="Notifications">🔔</button>
                        <button style={{ background: '#f1f5f9', border: 'none', color: '#8b5cf6', fontSize: '1.05rem', padding: '0.3rem 0.5rem', borderRadius: '8px' }} title="AI Assistant">🟣</button>

                        {/* Interactive + New Dropdown Menu Button */}
                        <div style={{ position: 'relative' }}>
                            <button
                                className="btn-pill-purple"
                                onClick={() => setShowPlusNewMenu(!showPlusNewMenu)}
                            >
                                + New ▾
                            </button>

                            {showPlusNewMenu && (
                                <div style={{
                                    position: 'absolute',
                                    right: 0,
                                    top: '40px',
                                    width: '180px',
                                    background: '#ffffff',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '10px',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                    zIndex: 100,
                                    padding: '0.4rem 0',
                                }}>
                                    <button
                                        style={{ width: '100%', padding: '0.6rem 1rem', textAlign: 'left', background: 'transparent', border: 'none', fontSize: '0.85rem', color: '#0f172a', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                        onClick={() => {
                                            setShowNewProjectModal(true);
                                            setShowPlusNewMenu(false);
                                        }}
                                    >
                                        📁 New Project
                                    </button>
                                    <button
                                        style={{ width: '100%', padding: '0.6rem 1rem', textAlign: 'left', background: 'transparent', border: 'none', fontSize: '0.85rem', color: '#0f172a', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                        onClick={() => {
                                            setShowClientDirectory(true);
                                            setShowPlusNewMenu(false);
                                        }}
                                    >
                                        👤 New Contact
                                    </button>
                                    <button
                                        style={{ width: '100%', padding: '0.6rem 1rem', textAlign: 'left', background: 'transparent', border: 'none', fontSize: '0.85rem', color: '#0f172a', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                        onClick={() => {
                                            setShowNewProjectModal(true);
                                            setShowPlusNewMenu(false);
                                        }}
                                    >
                                        📄 New Invoice
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Sub-Header / Page Title Area */}
                <div style={{ padding: '1.2rem 1.8rem 0.5rem 1.8rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a' }}>
                            Projects
                        </h1>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <button className="btn-ghost" style={{ fontSize: '0.85rem', color: '#334155', fontWeight: '600' }}>
                                ☁️ Import
                            </button>
                            <button className="btn-black" onClick={() => setShowNewProjectModal(true)}>
                                CREATE NEW
                            </button>
                        </div>
                    </div>

                    {/* Tab Navigation Line with Dynamic + Tab Support */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.6rem' }}>
                        {tabs.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setActiveViewTabId(t.id)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: activeViewTabId === t.id ? '#0f172a' : '#64748b',
                                    fontWeight: activeViewTabId === t.id ? '700' : '500',
                                    fontSize: '0.9rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    position: 'relative',
                                    paddingBottom: '0.6rem',
                                    marginBottom: '-0.65rem',
                                    borderBottom: activeViewTabId === t.id ? '2.5px solid #6366f1' : '2.5px solid transparent',
                                    cursor: 'pointer',
                                }}
                            >
                                <span>{t.icon}</span>
                                <span>{t.label}</span>
                            </button>
                        ))}

                        {showAddTabInput ? (
                            <form onSubmit={handleAddTab} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <input
                                    placeholder="Tab name"
                                    autoFocus
                                    value={newTabName}
                                    onChange={(e) => setNewTabName(e.target.value)}
                                    style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                                />
                                <button type="submit" style={{ padding: '0.2rem 0.5rem', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '0.75rem' }}>Save</button>
                                <button type="button" onClick={() => setShowAddTabInput(false)} style={{ padding: '0.2rem 0.4rem', background: 'transparent', border: 'none', fontSize: '0.75rem', color: '#64748b' }}>✕</button>
                            </form>
                        ) : (
                            <button
                                onClick={() => setShowAddTabInput(true)}
                                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.1rem', cursor: 'pointer' }}
                                title="Add view tab"
                            >
                                +
                            </button>
                        )}
                    </div>

                    {/* Filter & View Toolbar */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', marginBottom: '1.2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', position: 'relative' }}>
                            {/* Sort Popover Button (⇅) */}
                            <div style={{ position: 'relative' }}>
                                <button
                                    style={{
                                        background: sortOption !== 'title-asc' ? '#e0e7ff' : '#f1f5f9',
                                        border: sortOption !== 'title-asc' ? '1px solid #c7d2fe' : '1px solid #e2e8f0',
                                        borderRadius: '6px',
                                        padding: '0.35rem 0.7rem',
                                        color: sortOption !== 'title-asc' ? '#4f46e5' : '#475569',
                                        fontSize: '0.85rem',
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.3rem'
                                    }}
                                    title="Sort projects"
                                    onClick={() => {
                                        setShowSortMenu(!showSortMenu);
                                        setShowFilterMenu(false);
                                    }}
                                >
                                    ⇅ Sort
                                </button>

                                {showSortMenu && (
                                    <div style={{
                                        position: 'absolute',
                                        left: 0,
                                        top: '38px',
                                        width: '180px',
                                        background: '#ffffff',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                        zIndex: 50,
                                        padding: '0.3rem 0'
                                    }}>
                                        {[
                                            { id: 'title-asc', label: 'Alphabetical (A-Z)' },
                                            { id: 'title-desc', label: 'Alphabetical (Z-A)' },
                                            { id: 'date-newest', label: 'Newest First' },
                                            { id: 'date-oldest', label: 'Oldest First' },
                                        ].map((opt) => (
                                            <button
                                                key={opt.id}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.5rem 0.8rem',
                                                    textAlign: 'left',
                                                    background: sortOption === opt.id ? '#f1f5f9' : 'transparent',
                                                    border: 'none',
                                                    fontSize: '0.8rem',
                                                    color: sortOption === opt.id ? '#6366f1' : '#334155',
                                                    fontWeight: sortOption === opt.id ? '700' : '400',
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => {
                                                    setSortOption(opt.id);
                                                    setShowSortMenu(false);
                                                }}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Filter Popover Button (≡) */}
                            <div style={{ position: 'relative' }}>
                                <button
                                    style={{
                                        background: filterStage !== 'ALL' ? '#e0e7ff' : '#f1f5f9',
                                        border: filterStage !== 'ALL' ? '1px solid #c7d2fe' : '1px solid #e2e8f0',
                                        borderRadius: '6px',
                                        padding: '0.35rem 0.7rem',
                                        color: filterStage !== 'ALL' ? '#4f46e5' : '#475569',
                                        fontSize: '0.85rem',
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.3rem'
                                    }}
                                    title="Filter projects by stage"
                                    onClick={() => {
                                        setShowFilterMenu(!showFilterMenu);
                                        setShowSortMenu(false);
                                    }}
                                >
                                    ≡ Filter {filterStage !== 'ALL' && `(${filterStage})`}
                                </button>

                                {showFilterMenu && (
                                    <div style={{
                                        position: 'absolute',
                                        left: 0,
                                        top: '38px',
                                        width: '190px',
                                        background: '#ffffff',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                        zIndex: 50,
                                        padding: '0.3rem 0'
                                    }}>
                                        <button
                                            style={{
                                                width: '100%',
                                                padding: '0.5rem 0.8rem',
                                                textAlign: 'left',
                                                background: filterStage === 'ALL' ? '#f1f5f9' : 'transparent',
                                                border: 'none',
                                                fontSize: '0.8rem',
                                                color: filterStage === 'ALL' ? '#6366f1' : '#334155',
                                                fontWeight: filterStage === 'ALL' ? '700' : '400',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => {
                                                setFilterStage('ALL');
                                                setShowFilterMenu(false);
                                            }}
                                        >
                                            All Stages
                                        </button>
                                        {STAGES.map((s) => (
                                            <button
                                                key={s.key}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.5rem 0.8rem',
                                                    textAlign: 'left',
                                                    background: filterStage === s.key ? '#f1f5f9' : 'transparent',
                                                    border: 'none',
                                                    fontSize: '0.8rem',
                                                    color: filterStage === s.key ? '#6366f1' : '#334155',
                                                    fontWeight: filterStage === s.key ? '700' : '400',
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => {
                                                    setFilterStage(s.key);
                                                    setShowFilterMenu(false);
                                                }}
                                            >
                                                {s.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            {/* Avatars Stack */}
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.75rem', color: '#64748b', marginRight: '0.4rem', fontWeight: '500' }}>All</span>
                                <div style={{ display: 'flex', marginLeft: '-2px' }}>
                                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#fbbf24', border: '2px solid #fff', fontSize: '0.6rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#78350f' }}>AR</div>
                                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#38bdf8', border: '2px solid #fff', marginLeft: '-6px', fontSize: '0.6rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0369a1' }}>MC</div>
                                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#cbd5e1', border: '2px solid #fff', marginLeft: '-6px', fontSize: '0.65rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>+3</div>
                                </div>
                            </div>

                            <button style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0.35rem 0.75rem', color: '#334155', fontSize: '0.82rem', fontWeight: '600' }}>
                                🎛️ Customize
                            </button>

                            <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '6px', padding: '2px', border: '1px solid #e2e8f0' }}>
                                <button style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}>📋</button>
                                <button style={{ background: 'transparent', border: 'none', borderRadius: '4px', padding: '0.2rem 0.5rem', fontSize: '0.8rem', color: '#64748b' }}>📑</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Kanban Main Workspace Grid */}
                <main style={{ flex: 1, padding: '0 1.8rem 1.8rem 1.8rem', overflowX: 'auto' }}>
                    {activeTab === 'pipeline' ? (
                        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
                            <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-start', minWidth: 'max-content', paddingBottom: '1rem' }}>
                                {STAGES.map((stageInfo) => (
                                    <Column
                                        key={stageInfo.key}
                                        stageInfo={stageInfo}
                                        projects={processedProjects.filter((p) => p.stage === stageInfo.key)}
                                        onSelectProject={(proj) => setActiveProjectDetail(proj)}
                                    />
                                ))}
                            </div>
                        </DndContext>
                    ) : (
                        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                            <AnalyticsPanel />
                        </div>
                    )}
                </main>
            </div>

            {/* Full Screen Project Workspace Modal */}
            {activeProjectDetail && (
                <ProjectWorkspace
                    project={activeProjectDetail}
                    onClose={() => setActiveProjectDetail(null)}
                    onProjectUpdated={(projectId, newStage) => {
                        moveProjectToStage(projectId, newStage);
                    }}
                />
            )}

            {showNewProjectModal && (
                <CreateProjectModal
                    onClose={() => setShowNewProjectModal(false)}
                    onProjectCreated={(newProj) => {
                        setProjects((prev) => [newProj, ...prev]);
                    }}
                />
            )}

            {showClientDirectory && (
                <ClientDirectoryModal
                    onClose={() => setShowClientDirectory(false)}
                    onClientAdded={() => {
                        loadProjects();
                    }}
                />
            )}
        </div>
    );
}   );
}