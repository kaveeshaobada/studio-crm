import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchProjects, updateProjectStage } from '../api/projects';
import { DndContext, closestCorners, useDroppable, PointerSensor, KeyboardSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import AnalyticsPanel from '../components/AnalyticsPanel';
import ClientDirectoryModal from '../components/ClientDirectoryModal';
import CreateProjectModal from '../components/CreateProjectModal';
import ProjectWorkspace from '../components/ProjectWorkspace';
import {
    Wand2,
    Home,
    Briefcase,
    Inbox,
    Image,
    FileText,
    Calendar,
    Tag,
    Layers,
    DollarSign,
    Zap,
    Wrench,
    BarChart3,
    User,
    LifeBuoy,
    Lock,
    Gem,
    Bell,
    Sparkles,
    Search,
    Plus,
    ChevronDown,
    ChevronUp,
    ChevronRight,
    ChevronLeft,
    FolderPlus,
    UserPlus,
    Receipt,
    SlidersHorizontal,
    ArrowUpDown,
    LayoutGrid,
    Columns,
    X,
} from 'lucide-react';

// Exactly the 10 kanban column headers requested by user
const STAGES = [
    { key: 'NEW', label: 'New', barColor: '#8b5cf6', group: 'Opportunities' },
    { key: 'DISCOVERY', label: 'Discovery', barColor: '#8b5cf6', group: 'Opportunities' },
    { key: 'PROPOSAL', label: 'Proposal', barColor: '#8b5cf6', group: 'Opportunities' },
    { key: 'CONTRACT_SIGNED', label: 'Contract signed', barColor: '#c084fc', group: 'Projects' },
    { key: 'KICK_OFF', label: 'Kick off 🎉', barColor: '#10b981', group: 'Projects' },
    { key: 'ONBOARDING', label: 'Onboarding', barColor: '#10b981', group: 'Projects' },
    { key: 'PLANNING', label: 'Planning', barColor: '#10b981', group: 'Projects' },
    { key: 'DELIVERY', label: 'Delivery', barColor: '#10b981', group: 'Projects' },
    { key: 'COMPLETED', label: 'Completed', barColor: '#10b981', group: 'Projects' },
    { key: 'ARCHIVED', label: 'Archived', barColor: '#94a3b8', group: 'Projects' },
];

// Backend enum mapping for drag-and-drop mutations
const STAGE_TO_BACKEND_MAP = {
    NEW: 'LEAD',
    DISCOVERY: 'LEAD',
    PROPOSAL: 'QUOTED',
    CONTRACT_SIGNED: 'QUOTED',
    KICK_OFF: 'BOOKED',
    ONBOARDING: 'BOOKED',
    PLANNING: 'IN_PROGRESS',
    DELIVERY: 'DELIVERED',
    COMPLETED: 'PAID',
    ARCHIVED: 'PAID',
};

// Initial projects matching the user screenshot
const INITIAL_KANBAN_PROJECTS = [
    {
        id: 'p-discovery-21',
        title: '21',
        stage: 'DISCOVERY',
        dateRange: 'Sep 17, 2026 - Sep 23, 2026',
        leadSource: 'Client Referral',
        projectType: 'Music Video',
        clientName: 'Kaveesha Obadakumbura',
    },
    {
        id: 'p-proposal-test',
        title: 'Test project',
        stage: 'PROPOSAL',
        leadSource: 'Unknown',
        projectType: 'Wedding',
        clientName: 'Test User',
    },
    {
        id: 'p-signed-1',
        title: 'Radiant Renovations',
        stage: 'CONTRACT_SIGNED',
        dateRange: 'Oct 01, 2026 - Oct 12, 2026',
        leadSource: 'Lead form',
        projectType: 'Commercial Shoot',
        clientName: 'Hazel Brook',
    },
    {
        id: 'p-signed-2',
        title: 'Stellar Systems',
        stage: 'CONTRACT_SIGNED',
        leadSource: 'Lead form',
        projectType: 'Corporate Video',
        clientName: 'Forrest Banks',
    },
];

function Column({ stageInfo, projects, onSelectProject, isGroupStart }) {
    const { setNodeRef } = useDroppable({ id: stageInfo.key });

    return (
        <div
            style={{
                width: '260px',
                minWidth: '260px',
                flex: '0 0 260px',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Stage Group Badge (Opportunities vs Projects) */}
            <div style={{ minHeight: '24px', marginBottom: '0.45rem' }}>
                {isGroupStart && (
                    <span
                        style={{
                            display: 'inline-block',
                            background: stageInfo.group === 'Opportunities' ? '#ede9fe' : '#dcfce7',
                            color: stageInfo.group === 'Opportunities' ? '#7c3aed' : '#15803d',
                            fontSize: '0.72rem',
                            fontWeight: '600',
                            padding: '2px 8px',
                            borderRadius: '4px',
                        }}
                    >
                        {stageInfo.group}
                    </span>
                )}
            </div>

            {/* Column Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.1rem 0.2rem 0.5rem 0.2rem' }}>
                <div style={{
                    width: '3px',
                    height: '14px',
                    borderRadius: '2px',
                    backgroundColor: stageInfo.barColor,
                    marginRight: '2px',
                }} />
                <span style={{ fontWeight: '700', fontSize: '0.92rem', color: '#111827' }}>
                    {stageInfo.label}
                </span>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '400', marginLeft: '0.25rem' }}>
                    {projects.length}
                </span>
            </div>

            {/* Rounded Droppable Column Slot Container */}
            <div
                ref={setNodeRef}
                style={{
                    background: '#f1f3f5',
                    borderRadius: '12px',
                    padding: '8px',
                    minHeight: '520px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.65rem',
                    border: '1px solid #e5e7eb',
                }}
            >
                <SortableContext
                    items={projects.map((p) => p.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {projects.map((project) => (
                        <Card
                            key={project.id}
                            project={project}
                            onSelectProject={onSelectProject}
                        />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
}

function Card({ project, onSelectProject }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: project.id,
    });

    const style = {
        background: '#ffffff',
        border: isDragging ? '1px solid #4f46e5' : '1px solid #e5e7eb',
        borderRadius: '10px',
        padding: '1rem 1.1rem',
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.6 : 1,
        boxShadow: isDragging ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : '0 1px 2px rgba(0, 0, 0, 0.04)',
        cursor: 'pointer',
        userSelect: 'none',
    };

    const clientName = project.client?.name || project.clientName || 'Miranda Cruz';
    const leadSource = project.leadSource || 'Unknown';
    const projectType = project.projectType || project.serviceType || 'Consulting';

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
                fontSize: '1rem',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '0.45rem',
                lineHeight: '1.3',
            }}>
                {project.title}
            </h4>

            {/* Date line if available */}
            {project.dateRange && (
                <div style={{ fontSize: '0.78rem', color: '#6b7280', marginBottom: '0.4rem', fontWeight: '500' }}>
                    Date: <span style={{ color: '#374151' }}>{project.dateRange}</span>
                </div>
            )}

            {/* Field Metadata Rows */}
            <div style={{ fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <div>
                    <span style={{ color: '#9ca3af', fontWeight: '400' }}>Lead source: </span>
                    <span style={{ color: '#1f2937', fontWeight: '600' }}>{leadSource}</span>
                </div>
                <div>
                    <span style={{ color: '#9ca3af', fontWeight: '400' }}>Project type: </span>
                    <span style={{ color: '#1f2937', fontWeight: '600' }}>{projectType}</span>
                </div>
                <div>
                    <span style={{ color: '#9ca3af', fontWeight: '400' }}>Contacts: </span>
                    <span style={{ color: '#1f2937', fontWeight: '600' }}>{clientName}</span>
                </div>
            </div>
        </div>
    );
}

export default function Dashboard() {
    const { logout } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('pipeline'); // 'pipeline' | 'analytics'

    // Sidebar Pin / Hover state
    const [isPinned, setIsPinned] = useState(() => {
        return localStorage.getItem('studio_sidebar_pinned') === 'true';
    });
    const [isHovered, setIsHovered] = useState(false);
    const [projectsSubmenuOpen, setProjectsSubmenuOpen] = useState(true);

    const isExpanded = isPinned || isHovered;

    const handleLockExpand = (e) => {
        e.stopPropagation();
        setIsPinned(true);
        localStorage.setItem('studio_sidebar_pinned', 'true');
    };

    const handleMinimize = (e) => {
        e.stopPropagation();
        setIsPinned(false);
        setIsHovered(false);
        localStorage.setItem('studio_sidebar_pinned', 'false');
    };

    const [activeProjectDetail, setActiveProjectDetail] = useState(null);
    const [showNewProjectModal, setShowNewProjectModal] = useState(false);
    const [showClientDirectory, setShowClientDirectory] = useState(false);

    // Interactive + New Dropdown state
    const [showPlusNewMenu, setShowPlusNewMenu] = useState(false);

    // Active Sort & Filter state
    const [sortOption, setSortOption] = useState('default');
    const [showSortMenu, setShowSortMenu] = useState(false);

    const [filterStage, setFilterStage] = useState('ALL');
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Dynamic Tab Navigation State
    const [tabs, setTabs] = useState([
        { id: 'main', label: 'Main View' }
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

    const loadProjects = () => {
        fetchProjects()
            .then((data) => {
                if (data && data.length > 0) {
                    // Map existing database projects to the 10 stages intelligently
                    const mapped = data.map((p) => {
                        let targetStage = p.stage;
                        if (p.stage === 'LEAD') {
                            targetStage = p.title.toLowerCase().includes('21') ? 'DISCOVERY' : 'NEW';
                        } else if (p.stage === 'QUOTED') {
                            targetStage = p.title.toLowerCase().includes('test') ? 'PROPOSAL' : 'CONTRACT_SIGNED';
                        } else if (p.stage === 'BOOKED') {
                            targetStage = 'KICK_OFF';
                        } else if (p.stage === 'IN_PROGRESS') {
                            targetStage = 'PLANNING';
                        } else if (p.stage === 'DELIVERED') {
                            targetStage = 'DELIVERY';
                        } else if (p.stage === 'PAID') {
                            targetStage = 'COMPLETED';
                        }

                        return {
                            ...p,
                            stage: targetStage,
                            leadSource: p.leadSource || 'Unknown',
                            projectType: p.serviceType || 'Music Video',
                            clientName: p.client?.name || p.clientName || 'Kaveesha Obadakumbura',
                        };
                    });

                    // Merge with the initial screenshot projects if needed so the user sees their exact layout
                    const has21 = mapped.some(p => p.title === '21');
                    if (!has21) {
                        setProjects([...INITIAL_KANBAN_PROJECTS, ...mapped]);
                    } else {
                        setProjects(mapped);
                    }
                } else {
                    setProjects(INITIAL_KANBAN_PROJECTS);
                }
            })
            .catch(() => {
                setProjects(INITIAL_KANBAN_PROJECTS);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadProjects();
    }, []);

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

        // Map to valid backend enum
        const backendStage = STAGE_TO_BACKEND_MAP[newStage] || 'LEAD';

        // Check if project exists on backend before updating
        if (!projectId.startsWith('p-')) {
            updateProjectStage(projectId, backendStage).catch(() => {
                moveProjectToStage(projectId, previousStage);
            });
        }
    }

    const handleAddTab = (e) => {
        e.preventDefault();
        if (newTabName.trim()) {
            const newTab = {
                id: `tab_${Date.now()}`,
                label: newTabName.trim(),
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
            p.client?.name?.toLowerCase().includes(query) ||
            p.clientName?.toLowerCase().includes(query)
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
        <div style={{ width: '100%', minHeight: '100vh', display: 'flex', background: '#ffffff', position: 'relative' }}>
            {/* Sidebar Flow Spacer (keeps the workspace layout stable when pinned) */}
            <div
                style={{
                    width: isPinned ? '220px' : '60px',
                    minWidth: isPinned ? '220px' : '60px',
                    flexShrink: 0,
                    transition: 'width 0.28s cubic-bezier(0.16, 1, 0.3, 1), min-width 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
            />

            {/* Left Vertical Dark Navigation Sidebar - Smooth Hover Expand & Pin Lock */}
            <aside
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    height: '100vh',
                    width: isExpanded ? '220px' : '60px',
                    background: '#000000',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '0.9rem 0 1rem 0',
                    transition: 'width 0.28s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.28s ease',
                    boxShadow: (!isPinned && isHovered) ? '6px 0 25px rgba(0, 0, 0, 0.5)' : 'none',
                    zIndex: 50,
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    willChange: 'width',
                }}
            >
                {/* Top Header Row: Logo & Action Button */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    height: '36px',
                    padding: '0 10px',
                    marginBottom: '0.8rem',
                }}>
                    {/* Brand Logo Container (Centered on X=30px axis when minimized) */}
                    <div style={{
                        width: '40px',
                        minWidth: '40px',
                        height: '36px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontWeight: '900',
                        fontSize: '0.78rem',
                        lineHeight: '1.05',
                        letterSpacing: '0.04em',
                        cursor: 'pointer',
                        userSelect: 'none',
                        flexShrink: 0,
                    }} title="Studio CRM">
                        <span>HY</span>
                        <span>BK</span>
                    </div>

                    {/* Prominent Action Button: Lock Expand (Hovered) or Minimize (Pinned) */}
                    {isExpanded && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            opacity: isExpanded ? 1 : 0,
                            transition: 'opacity 0.2s ease',
                        }}>
                            {isPinned ? (
                                <button
                                    onClick={handleMinimize}
                                    style={{
                                        background: '#2563eb',
                                        border: '1px solid #3b82f6',
                                        color: '#ffffff',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '30px',
                                        height: '30px',
                                        borderRadius: '6px',
                                        boxShadow: '0 2px 8px rgba(37, 99, 235, 0.4)',
                                        transition: 'all 0.18s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = '#1d4ed8';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = '#2563eb';
                                    }}
                                    title="Minimize sidebar"
                                >
                                    <ChevronLeft size={18} strokeWidth={2.5} />
                                </button>
                            ) : (
                                <button
                                    onClick={handleLockExpand}
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.18)',
                                        border: '1px solid rgba(255, 255, 255, 0.35)',
                                        color: '#ffffff',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '30px',
                                        height: '30px',
                                        borderRadius: '6px',
                                        transition: 'all 0.18s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)';
                                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.35)';
                                    }}
                                    title="Lock sidebar expanded"
                                >
                                    <Lock size={15} strokeWidth={2.2} />
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Onboarding progress card */}
                <div style={{ padding: '0 10px', width: '100%', marginBottom: '0.8rem' }}>
                    {isExpanded ? (
                        <div style={{
                            padding: '0.65rem 0.75rem',
                            borderRadius: '8px',
                            background: 'rgba(255, 255, 255, 0.06)',
                            cursor: 'pointer',
                            width: '100%',
                            transition: 'background 0.2s ease',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                                <span style={{ color: '#ffffff', fontSize: '0.8rem', fontWeight: '600', whiteSpace: 'nowrap' }}>Set up your account</span>
                                <ChevronRight size={13} color="#9ca3af" />
                            </div>
                            <div style={{ width: '100%', height: '3px', background: 'rgba(255, 255, 255, 0.12)', borderRadius: '2px', overflow: 'hidden', marginBottom: '0.35rem' }}>
                                <div style={{ width: '28%', height: '100%', background: '#10b981', borderRadius: '2px' }} />
                            </div>
                            <span style={{ color: '#9ca3af', fontSize: '0.72rem' }}>2/7 completed</span>
                        </div>
                    ) : (
                        <div style={{
                            padding: '0.45rem 0.2rem',
                            borderRadius: '8px',
                            background: 'rgba(255, 255, 255, 0.06)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.3rem',
                            cursor: 'pointer',
                            width: '40px',
                            margin: '0 auto',
                        }} title="Setup: 2/7 completed">
                            <ChevronRight size={12} color="#9ca3af" />
                            <div style={{ width: '28px', height: '3px', background: 'rgba(255, 255, 255, 0.12)', borderRadius: '2px', overflow: 'hidden' }}>
                                <div style={{ width: '28%', height: '100%', background: '#10b981', borderRadius: '2px' }} />
                            </div>
                            <span style={{ color: '#9ca3af', fontSize: '0.68rem', fontWeight: '600' }}>2/7</span>
                        </div>
                    )}
                </div>

                {/* Vertical Navigation Menu */}
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', width: '100%' }}>
                    {/* Setup */}
                    <div style={{ padding: '0 10px', width: '100%' }}>
                        <button
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                width: '100%',
                                height: '40px',
                                background: 'transparent',
                                border: 'none',
                                color: '#9ca3af',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                padding: 0,
                                transition: 'background 0.2s ease, color 0.2s ease',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.background = 'transparent'; }}
                            title="Setup"
                        >
                            <div style={{ width: '40px', minWidth: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Wand2 size={20} strokeWidth={1.9} />
                            </div>
                            <span style={{
                                whiteSpace: 'nowrap',
                                fontSize: '0.84rem',
                                fontWeight: '500',
                                opacity: isExpanded ? 1 : 0,
                                transform: isExpanded ? 'translateX(0)' : 'translateX(-8px)',
                                transition: 'opacity 0.22s cubic-bezier(0.16, 1, 0.3, 1), transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                                pointerEvents: isExpanded ? 'auto' : 'none',
                                overflow: 'hidden',
                            }}>Setup</span>
                        </button>
                    </div>

                    {/* Home */}
                    <div style={{ padding: '0 10px', width: '100%' }}>
                        <button
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                width: '100%',
                                height: '40px',
                                background: 'transparent',
                                border: 'none',
                                color: '#9ca3af',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                padding: 0,
                                transition: 'background 0.2s ease, color 0.2s ease',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.background = 'transparent'; }}
                            title="Home"
                        >
                            <div style={{ width: '40px', minWidth: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Home size={20} strokeWidth={1.9} />
                            </div>
                            <span style={{
                                whiteSpace: 'nowrap',
                                fontSize: '0.84rem',
                                fontWeight: '500',
                                opacity: isExpanded ? 1 : 0,
                                transform: isExpanded ? 'translateX(0)' : 'translateX(-8px)',
                                transition: 'opacity 0.22s cubic-bezier(0.16, 1, 0.3, 1), transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                                pointerEvents: isExpanded ? 'auto' : 'none',
                                overflow: 'hidden',
                            }}>Home</span>
                        </button>
                    </div>

                    {/* Projects (Expanded Accordion Box vs Minimized Tile) */}
                    {isExpanded ? (
                        <div style={{
                            margin: '0.2rem 10px',
                            border: '1px solid rgba(255, 255, 255, 0.22)',
                            borderRadius: '8px',
                            background: '#181818',
                            overflow: 'hidden',
                        }}>
                            <button
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    height: '40px',
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#ffffff',
                                    cursor: 'pointer',
                                    padding: '0 10px 0 0',
                                }}
                                onClick={() => setProjectsSubmenuOpen(!projectsSubmenuOpen)}
                            >
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={{ width: '40px', minWidth: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Briefcase size={21} strokeWidth={2} color="#ffffff" />
                                    </div>
                                    <span style={{ fontSize: '0.84rem', fontWeight: '600', whiteSpace: 'nowrap' }}>Projects</span>
                                </div>
                                {projectsSubmenuOpen ? <ChevronUp size={14} color="#9ca3af" /> : <ChevronDown size={14} color="#9ca3af" />}
                            </button>

                            {projectsSubmenuOpen && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', padding: '0.1rem 0.4rem 0.4rem 2.4rem' }}>
                                    <button
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            width: '100%',
                                            textAlign: 'left',
                                            padding: '0.35rem 0.6rem',
                                            borderRadius: '6px',
                                            background: activeTab === 'pipeline' ? 'rgba(255, 255, 255, 0.14)' : 'transparent',
                                            border: 'none',
                                            color: '#ffffff',
                                            fontSize: '0.8rem',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            whiteSpace: 'nowrap',
                                        }}
                                        onClick={() => setActiveTab('pipeline')}
                                    >
                                        Pipeline
                                    </button>
                                    <button
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            width: '100%',
                                            textAlign: 'left',
                                            padding: '0.35rem 0.6rem',
                                            borderRadius: '6px',
                                            background: 'transparent',
                                            border: 'none',
                                            color: '#9ca3af',
                                            fontSize: '0.8rem',
                                            fontWeight: '500',
                                            cursor: 'pointer',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        All files
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div style={{ padding: '0 10px', width: '100%', display: 'flex', justifyContent: 'center' }}>
                            <button
                                style={{
                                    background: activeTab === 'pipeline' ? '#262626' : 'transparent',
                                    border: activeTab === 'pipeline' ? '1px solid rgba(255, 255, 255, 0.16)' : '1px solid transparent',
                                    color: activeTab === 'pipeline' ? '#ffffff' : '#9ca3af',
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s ease',
                                    padding: 0,
                                }}
                                title="Projects"
                                onClick={() => setActiveTab('pipeline')}
                            >
                                <Briefcase size={21} strokeWidth={2} />
                            </button>
                        </div>
                    )}

                    {/* Inbox */}
                    <div style={{ padding: '0 10px', width: '100%' }}>
                        <button
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                width: '100%',
                                height: '40px',
                                background: 'transparent',
                                border: 'none',
                                color: '#9ca3af',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                padding: 0,
                                transition: 'background 0.2s ease, color 0.2s ease',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.background = 'transparent'; }}
                            title="Inbox"
                        >
                            <div style={{ width: '40px', minWidth: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Inbox size={20} strokeWidth={1.9} />
                            </div>
                            <span style={{
                                whiteSpace: 'nowrap',
                                fontSize: '0.84rem',
                                fontWeight: '500',
                                opacity: isExpanded ? 1 : 0,
                                transform: isExpanded ? 'translateX(0)' : 'translateX(-8px)',
                                transition: 'opacity 0.22s cubic-bezier(0.16, 1, 0.3, 1), transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                                pointerEvents: isExpanded ? 'auto' : 'none',
                                overflow: 'hidden',
                            }}>Inbox</span>
                        </button>
                    </div>

                    {/* Galleries */}
                    <div style={{ padding: '0 10px', width: '100%' }}>
                        <button
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                width: '100%',
                                height: '40px',
                                background: 'transparent',
                                border: 'none',
                                color: '#9ca3af',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                padding: 0,
                                transition: 'background 0.2s ease, color 0.2s ease',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.background = 'transparent'; }}
                            title="Galleries"
                        >
                            <div style={{ width: '40px', minWidth: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Image size={20} strokeWidth={1.9} />
                            </div>
                            <span style={{
                                whiteSpace: 'nowrap',
                                fontSize: '0.84rem',
                                fontWeight: '500',
                                opacity: isExpanded ? 1 : 0,
                                transform: isExpanded ? 'translateX(0)' : 'translateX(-8px)',
                                transition: 'opacity 0.22s cubic-bezier(0.16, 1, 0.3, 1), transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                                pointerEvents: isExpanded ? 'auto' : 'none',
                                overflow: 'hidden',
                            }}>Galleries</span>
                        </button>
                    </div>

                    {/* Forms */}
                    <div style={{ padding: '0 10px', width: '100%' }}>
                        <button
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                width: '100%',
                                height: '40px',
                                background: 'transparent',
                                border: 'none',
                                color: '#9ca3af',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                padding: 0,
                                transition: 'background 0.2s ease, color 0.2s ease',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.background = 'transparent'; }}
                            title="Forms"
                        >
                            <div style={{ width: '40px', minWidth: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <FileText size={20} strokeWidth={1.9} />
                            </div>
                            <span style={{
                                whiteSpace: 'nowrap',
                                fontSize: '0.84rem',
                                fontWeight: '500',
                                opacity: isExpanded ? 1 : 0,
                                transform: isExpanded ? 'translateX(0)' : 'translateX(-8px)',
                                transition: 'opacity 0.22s cubic-bezier(0.16, 1, 0.3, 1), transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                                pointerEvents: isExpanded ? 'auto' : 'none',
                                overflow: 'hidden',
                            }}>Forms</span>
                        </button>
                    </div>

                    {/* Calendar */}
                    <div style={{ padding: '0 10px', width: '100%' }}>
                        <button
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                width: '100%',
                                height: '40px',
                                background: 'transparent',
                                border: 'none',
                                color: '#9ca3af',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                padding: 0,
                                transition: 'background 0.2s ease, color 0.2s ease',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.background = 'transparent'; }}
                            title="Calendar"
                        >
                            <div style={{ width: '40px', minWidth: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Calendar size={20} strokeWidth={1.9} />
                            </div>
                            <span style={{
                                whiteSpace: 'nowrap',
                                fontSize: '0.84rem',
                                fontWeight: '500',
                                opacity: isExpanded ? 1 : 0,
                                transform: isExpanded ? 'translateX(0)' : 'translateX(-8px)',
                                transition: 'opacity 0.22s cubic-bezier(0.16, 1, 0.3, 1), transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                                pointerEvents: isExpanded ? 'auto' : 'none',
                                overflow: 'hidden',
                            }}>Calendar</span>
                        </button>
                    </div>

                    {/* Services */}
                    <div style={{ padding: '0 10px', width: '100%' }}>
                        <button
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                width: '100%',
                                height: '40px',
                                background: 'transparent',
                                border: 'none',
                                color: '#9ca3af',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                padding: 0,
                                transition: 'background 0.2s ease, color 0.2s ease',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.background = 'transparent'; }}
                            title="Services"
                        >
                            <div style={{ width: '40px', minWidth: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Tag size={20} strokeWidth={1.9} />
                            </div>
                            <span style={{
                                whiteSpace: 'nowrap',
                                fontSize: '0.84rem',
                                fontWeight: '500',
                                opacity: isExpanded ? 1 : 0,
                                transform: isExpanded ? 'translateX(0)' : 'translateX(-8px)',
                                transition: 'opacity 0.22s cubic-bezier(0.16, 1, 0.3, 1), transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                                pointerEvents: isExpanded ? 'auto' : 'none',
                                overflow: 'hidden',
                            }}>Services</span>
                        </button>
                    </div>

                    {/* Templates */}
                    <div style={{ padding: '0 10px', width: '100%' }}>
                        <button
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                width: '100%',
                                height: '40px',
                                background: 'transparent',
                                border: 'none',
                                color: '#9ca3af',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                padding: 0,
                                transition: 'background 0.2s ease, color 0.2s ease',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.background = 'transparent'; }}
                            title="Templates"
                        >
                            <div style={{ width: '40px', minWidth: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Layers size={20} strokeWidth={1.9} />
                            </div>
                            <span style={{
                                whiteSpace: 'nowrap',
                                fontSize: '0.84rem',
                                fontWeight: '500',
                                opacity: isExpanded ? 1 : 0,
                                transform: isExpanded ? 'translateX(0)' : 'translateX(-8px)',
                                transition: 'opacity 0.22s cubic-bezier(0.16, 1, 0.3, 1), transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                                pointerEvents: isExpanded ? 'auto' : 'none',
                                overflow: 'hidden',
                            }}>Templates</span>
                            <div style={{
                                marginLeft: 'auto',
                                marginRight: '10px',
                                opacity: isExpanded ? 1 : 0,
                                transition: 'opacity 0.2s ease',
                                pointerEvents: isExpanded ? 'auto' : 'none',
                                display: 'flex',
                                alignItems: 'center',
                            }}>
                                <ChevronDown size={14} color="#9ca3af" />
                            </div>
                        </button>
                    </div>

                    {/* Finance */}
                    <div style={{ padding: '0 10px', width: '100%' }}>
                        <button
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                width: '100%',
                                height: '40px',
                                background: 'transparent',
                                border: 'none',
                                color: '#9ca3af',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                padding: 0,
                                transition: 'background 0.2s ease, color 0.2s ease',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.background = 'transparent'; }}
                            title="Finance"
                        >
                            <div style={{ width: '40px', minWidth: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <DollarSign size={20} strokeWidth={1.9} />
                            </div>
                            <span style={{
                                whiteSpace: 'nowrap',
                                fontSize: '0.84rem',
                                fontWeight: '500',
                                opacity: isExpanded ? 1 : 0,
                                transform: isExpanded ? 'translateX(0)' : 'translateX(-8px)',
                                transition: 'opacity 0.22s cubic-bezier(0.16, 1, 0.3, 1), transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                                pointerEvents: isExpanded ? 'auto' : 'none',
                                overflow: 'hidden',
                            }}>Finance</span>
                            <div style={{
                                marginLeft: 'auto',
                                marginRight: '10px',
                                opacity: isExpanded ? 1 : 0,
                                transition: 'opacity 0.2s ease',
                                pointerEvents: isExpanded ? 'auto' : 'none',
                                display: 'flex',
                                alignItems: 'center',
                            }}>
                                <ChevronDown size={14} color="#9ca3af" />
                            </div>
                        </button>
                    </div>

                    {/* Automations */}
                    <div style={{ padding: '0 10px', width: '100%' }}>
                        <button
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                width: '100%',
                                height: '40px',
                                background: 'transparent',
                                border: 'none',
                                color: '#9ca3af',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                padding: 0,
                                transition: 'background 0.2s ease, color 0.2s ease',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.background = 'transparent'; }}
                            title="Automations"
                        >
                            <div style={{ width: '40px', minWidth: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Zap size={20} strokeWidth={1.9} />
                            </div>
                            <span style={{
                                whiteSpace: 'nowrap',
                                fontSize: '0.84rem',
                                fontWeight: '500',
                                opacity: isExpanded ? 1 : 0,
                                transform: isExpanded ? 'translateX(0)' : 'translateX(-8px)',
                                transition: 'opacity 0.22s cubic-bezier(0.16, 1, 0.3, 1), transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                                pointerEvents: isExpanded ? 'auto' : 'none',
                                overflow: 'hidden',
                            }}>Automations</span>
                        </button>
                    </div>

                    {/* Tools */}
                    <div style={{ padding: '0 10px', width: '100%' }}>
                        <button
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                width: '100%',
                                height: '40px',
                                background: 'transparent',
                                border: 'none',
                                color: '#9ca3af',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                padding: 0,
                                transition: 'background 0.2s ease, color 0.2s ease',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.background = 'transparent'; }}
                            title="Tools"
                        >
                            <div style={{ width: '40px', minWidth: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Wrench size={20} strokeWidth={1.9} />
                            </div>
                            <span style={{
                                whiteSpace: 'nowrap',
                                fontSize: '0.84rem',
                                fontWeight: '500',
                                opacity: isExpanded ? 1 : 0,
                                transform: isExpanded ? 'translateX(0)' : 'translateX(-8px)',
                                transition: 'opacity 0.22s cubic-bezier(0.16, 1, 0.3, 1), transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                                pointerEvents: isExpanded ? 'auto' : 'none',
                                overflow: 'hidden',
                            }}>Tools</span>
                            <div style={{
                                marginLeft: 'auto',
                                marginRight: '10px',
                                opacity: isExpanded ? 1 : 0,
                                transition: 'opacity 0.2s ease',
                                pointerEvents: isExpanded ? 'auto' : 'none',
                                display: 'flex',
                                alignItems: 'center',
                            }}>
                                <ChevronDown size={14} color="#9ca3af" />
                            </div>
                        </button>
                    </div>

                    {/* Reports */}
                    <div style={{ padding: '0 10px', width: '100%' }}>
                        <button
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                width: '100%',
                                height: '40px',
                                background: activeTab === 'analytics' ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                                border: 'none',
                                color: activeTab === 'analytics' ? '#ffffff' : '#9ca3af',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                padding: 0,
                                transition: 'background 0.2s ease, color 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                                if (activeTab !== 'analytics') {
                                    e.currentTarget.style.color = '#ffffff';
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (activeTab !== 'analytics') {
                                    e.currentTarget.style.color = '#9ca3af';
                                    e.currentTarget.style.background = 'transparent';
                                }
                            }}
                            title="Reports"
                            onClick={() => setActiveTab('analytics')}
                        >
                            <div style={{ width: '40px', minWidth: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <BarChart3 size={20} strokeWidth={1.9} />
                            </div>
                            <span style={{
                                whiteSpace: 'nowrap',
                                fontSize: '0.84rem',
                                fontWeight: activeTab === 'analytics' ? '600' : '500',
                                opacity: isExpanded ? 1 : 0,
                                transform: isExpanded ? 'translateX(0)' : 'translateX(-8px)',
                                transition: 'opacity 0.22s cubic-bezier(0.16, 1, 0.3, 1), transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                                pointerEvents: isExpanded ? 'auto' : 'none',
                                overflow: 'hidden',
                            }}>Reports</span>
                        </button>
                    </div>

                    {/* Contacts */}
                    <div style={{ padding: '0 10px', width: '100%' }}>
                        <button
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                width: '100%',
                                height: '40px',
                                background: 'transparent',
                                border: 'none',
                                color: '#9ca3af',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                padding: 0,
                                transition: 'background 0.2s ease, color 0.2s ease',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.background = 'transparent'; }}
                            title="Contacts"
                            onClick={() => setShowClientDirectory(true)}
                        >
                            <div style={{ width: '40px', minWidth: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <User size={20} strokeWidth={1.9} />
                            </div>
                            <span style={{
                                whiteSpace: 'nowrap',
                                fontSize: '0.84rem',
                                fontWeight: '500',
                                opacity: isExpanded ? 1 : 0,
                                transform: isExpanded ? 'translateX(0)' : 'translateX(-8px)',
                                transition: 'opacity 0.22s cubic-bezier(0.16, 1, 0.3, 1), transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                                pointerEvents: isExpanded ? 'auto' : 'none',
                                overflow: 'hidden',
                            }}>Contacts</span>
                        </button>
                    </div>
                </nav>

                {/* Bottom Section: Resources & Settings */}
                <div style={{
                    marginTop: 'auto',
                    paddingTop: '0.8rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                    width: '100%',
                }}>
                    {/* Resources */}
                    <div style={{ padding: '0 10px', width: '100%' }}>
                        <button
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                width: '100%',
                                height: '40px',
                                background: 'transparent',
                                border: 'none',
                                color: '#9ca3af',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                padding: 0,
                                transition: 'background 0.2s ease, color 0.2s ease',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.background = 'transparent'; }}
                            title="Resources"
                        >
                            <div style={{ width: '40px', minWidth: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <LifeBuoy size={20} strokeWidth={1.9} />
                            </div>
                            <span style={{
                                whiteSpace: 'nowrap',
                                fontSize: '0.84rem',
                                fontWeight: '500',
                                opacity: isExpanded ? 1 : 0,
                                transform: isExpanded ? 'translateX(0)' : 'translateX(-8px)',
                                transition: 'opacity 0.22s cubic-bezier(0.16, 1, 0.3, 1), transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                                pointerEvents: isExpanded ? 'auto' : 'none',
                                overflow: 'hidden',
                            }}>Resources</span>
                        </button>
                    </div>

                    {/* Settings / Account Avatar */}
                    <div style={{ padding: '0 10px', width: '100%' }}>
                        <button
                            onClick={logout}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                width: '100%',
                                height: '40px',
                                background: 'transparent',
                                border: 'none',
                                color: '#ffffff',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                padding: 0,
                                transition: 'background 0.2s ease',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                            title="Account & Settings (Click to Logout)"
                        >
                            <div style={{ width: '40px', minWidth: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <div style={{
                                    width: '26px',
                                    height: '26px',
                                    borderRadius: '50%',
                                    background: '#0284c7',
                                    color: '#ffffff',
                                    fontSize: '0.74rem',
                                    fontWeight: '700',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    K
                                </div>
                            </div>
                            <span style={{
                                whiteSpace: 'nowrap',
                                fontSize: '0.84rem',
                                fontWeight: '500',
                                opacity: isExpanded ? 1 : 0,
                                transform: isExpanded ? 'translateX(0)' : 'translateX(-8px)',
                                transition: 'opacity 0.22s cubic-bezier(0.16, 1, 0.3, 1), transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                                pointerEvents: isExpanded ? 'auto' : 'none',
                                overflow: 'hidden',
                            }}>Settings</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Workspace Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: '#ffffff' }}>
                {/* Top Header Bar */}
                <header style={{
                    height: '56px',
                    background: '#ffffff',
                    borderBottom: '1px solid #f1f3f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 2rem',
                }}>
                    {/* Left: Capsule Search input */}
                    <div style={{ position: 'relative', width: '190px' }}>
                        <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                        <input
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                height: '34px',
                                paddingLeft: '32px',
                                paddingRight: '12px',
                                background: '#f3f4f6',
                                border: 'none',
                                borderRadius: '9999px',
                                fontSize: '0.82rem',
                                color: '#1f2937',
                                outline: 'none',
                            }}
                        />
                    </div>

                    {/* Right: See pricing, Notifications Bell, AI Badge, + New Button */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
                        {/* See Pricing */}
                        <button style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            background: 'transparent',
                            border: 'none',
                            color: '#0d9488',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                        }}>
                            <Gem size={14} color="#0d9488" />
                            <span>See pricing</span>
                        </button>

                        {/* Bell Icon with '1' badge */}
                        <div style={{ position: 'relative' }}>
                            <button style={{ background: 'transparent', border: 'none', color: '#374151', padding: '0.35rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Notifications">
                                <Bell size={18} />
                            </button>
                            <span style={{
                                position: 'absolute',
                                top: '0px',
                                right: '0px',
                                width: '14px',
                                height: '14px',
                                borderRadius: '50%',
                                background: '#2563eb',
                                color: '#ffffff',
                                fontSize: '0.6rem',
                                fontWeight: '700',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                1
                            </span>
                        </div>

                        {/* AI / Automation Hexagon Badge */}
                        <div style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '6px',
                            background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 2px 4px rgba(99, 102, 241, 0.2)',
                        }} title="AI Assistant">
                            <Sparkles size={13} color="#ffffff" />
                        </div>

                        {/* + New Pill Button */}
                        <div style={{ position: 'relative' }}>
                            <button
                                onClick={() => setShowPlusNewMenu(!showPlusNewMenu)}
                                style={{
                                    background: '#eff2fe',
                                    color: '#4338ca',
                                    border: 'none',
                                    borderRadius: '9999px',
                                    padding: '6px 14px',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                }}
                            >
                                <Plus size={14} /> New
                            </button>

                            {showPlusNewMenu && (
                                <div style={{
                                    position: 'absolute',
                                    right: 0,
                                    top: '38px',
                                    width: '180px',
                                    background: '#ffffff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                    zIndex: 100,
                                    padding: '0.4rem 0',
                                }}>
                                    <button
                                        style={{ width: '100%', padding: '0.6rem 1rem', textAlign: 'left', background: 'transparent', border: 'none', fontSize: '0.85rem', color: '#111827', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.6rem' }}
                                        onClick={() => {
                                            setShowNewProjectModal(true);
                                            setShowPlusNewMenu(false);
                                        }}
                                    >
                                        <FolderPlus size={16} color="#6366f1" /> New Project
                                    </button>
                                    <button
                                        style={{ width: '100%', padding: '0.6rem 1rem', textAlign: 'left', background: 'transparent', border: 'none', fontSize: '0.85rem', color: '#111827', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.6rem' }}
                                        onClick={() => {
                                            setShowClientDirectory(true);
                                            setShowPlusNewMenu(false);
                                        }}
                                    >
                                        <UserPlus size={16} color="#10b981" /> New Contact
                                    </button>
                                    <button
                                        style={{ width: '100%', padding: '0.6rem 1rem', textAlign: 'left', background: 'transparent', border: 'none', fontSize: '0.85rem', color: '#111827', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.6rem' }}
                                        onClick={() => {
                                            setShowNewProjectModal(true);
                                            setShowPlusNewMenu(false);
                                        }}
                                    >
                                        <Receipt size={16} color="#f59e0b" /> New Invoice
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Sub-Header / Page Title Area */}
                <div style={{ padding: '1.5rem 2rem 0.5rem 2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                        <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#111827', margin: 0, letterSpacing: '-0.02em' }}>
                            Projects
                        </h1>

                        {/* Top Action Buttons strictly matching HoneyBook screenshot */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <button
                                style={{
                                    background: '#ffffff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '6px',
                                    padding: '7px 14px',
                                    color: '#111827',
                                    fontSize: '0.82rem',
                                    fontWeight: '600',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    cursor: 'pointer',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                                }}
                            >
                                <span style={{ color: '#ea4335', fontWeight: '800', fontSize: '0.85rem' }}>M</span>
                                <span>Import from Gmail</span>
                            </button>

                            <button
                                onClick={() => setShowNewProjectModal(true)}
                                style={{
                                    background: '#000000',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '8px 16px',
                                    fontSize: '0.82rem',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                }}
                            >
                                <span>Create new</span>
                                <ChevronDown size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Tab Navigation Line with ⌂ Main View */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.65rem' }}>
                        {tabs.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setActiveViewTabId(t.id)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: activeViewTabId === t.id ? '#111827' : '#6b7280',
                                    fontWeight: activeViewTabId === t.id ? '600' : '500',
                                    fontSize: '0.88rem',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.45rem',
                                    position: 'relative',
                                    paddingBottom: '0.65rem',
                                    marginBottom: '-0.7rem',
                                    borderBottom: activeViewTabId === t.id ? '2.5px solid #2563eb' : '2.5px solid transparent',
                                    cursor: 'pointer',
                                }}
                            >
                                {t.id === 'main' ? <Home size={14} color={activeViewTabId === t.id ? '#111827' : '#6b7280'} /> : null}
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
                                    style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem', border: '1px solid #cbd5e1', borderRadius: '4px', outline: 'none' }}
                                />
                                <button type="submit" style={{ padding: '0.2rem 0.5rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}>Save</button>
                                <button type="button" onClick={() => setShowAddTabInput(false)} style={{ padding: '0.2rem 0.4rem', background: 'transparent', border: 'none', fontSize: '0.75rem', color: '#64748b', cursor: 'pointer' }}><X size={12} /></button>
                            </form>
                        ) : (
                            <button
                                onClick={() => setShowAddTabInput(true)}
                                style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px' }}
                                title="Add view tab"
                            >
                                <Plus size={16} />
                            </button>
                        )}
                    </div>

                    {/* Filter & View Toolbar */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', marginBottom: '1.2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', position: 'relative' }}>
                            {/* Sort Popover Button (⇅) */}
                            <div style={{ position: 'relative' }}>
                                <button
                                    style={{
                                        background: '#eff2fe',
                                        border: '1px solid #e0e7ff',
                                        borderRadius: '6px',
                                        padding: '5px 8px',
                                        color: '#4f46e5',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                    title="Sort projects"
                                    onClick={() => {
                                        setShowSortMenu(!showSortMenu);
                                        setShowFilterMenu(false);
                                    }}
                                >
                                    <ArrowUpDown size={14} color="#4f46e5" />
                                </button>

                                {showSortMenu && (
                                    <div style={{
                                        position: 'absolute',
                                        left: 0,
                                        top: '36px',
                                        width: '180px',
                                        background: '#ffffff',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                        zIndex: 50,
                                        padding: '0.3rem 0',
                                    }}>
                                        {[
                                            { id: 'default', label: 'Default view' },
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
                                                    color: sortOption === opt.id ? '#2563eb' : '#334155',
                                                    fontWeight: sortOption === opt.id ? '700' : '400',
                                                    cursor: 'pointer',
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
                                        background: 'transparent',
                                        border: 'none',
                                        borderRadius: '6px',
                                        padding: '5px 8px',
                                        color: '#4b5563',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                    title="Filter projects by stage"
                                    onClick={() => {
                                        setShowFilterMenu(!showFilterMenu);
                                        setShowSortMenu(false);
                                    }}
                                >
                                    <SlidersHorizontal size={14} color="#4b5563" />
                                </button>

                                {showFilterMenu && (
                                    <div style={{
                                        position: 'absolute',
                                        left: 0,
                                        top: '36px',
                                        width: '190px',
                                        background: '#ffffff',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                        zIndex: 50,
                                        padding: '0.3rem 0',
                                    }}>
                                        <button
                                            style={{
                                                width: '100%',
                                                padding: '0.5rem 0.8rem',
                                                textAlign: 'left',
                                                background: filterStage === 'ALL' ? '#f1f5f9' : 'transparent',
                                                border: 'none',
                                                fontSize: '0.8rem',
                                                color: filterStage === 'ALL' ? '#2563eb' : '#334155',
                                                fontWeight: filterStage === 'ALL' ? '700' : '400',
                                                cursor: 'pointer',
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
                                                    color: filterStage === s.key ? '#2563eb' : '#334155',
                                                    fontWeight: filterStage === s.key ? '700' : '400',
                                                    cursor: 'pointer',
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

                        {/* Right: Customize & View Mode Toggle */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                            <button style={{
                                background: '#f3f4f6',
                                border: '1px solid #e5e7eb',
                                borderRadius: '6px',
                                padding: '6px 14px',
                                color: '#374151',
                                fontSize: '0.8rem',
                                fontWeight: '600',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                cursor: 'pointer',
                            }}>
                                <SlidersHorizontal size={13} color="#4b5563" /> Customize
                            </button>

                            <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: '6px', padding: '2px', border: '1px solid #e5e7eb' }}>
                                <button style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '4px', padding: '3px 7px', display: 'flex', alignItems: 'center', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }} title="Kanban Board View">
                                    <LayoutGrid size={13} color="#374151" />
                                </button>
                                <button style={{ background: 'transparent', border: 'none', borderRadius: '4px', padding: '3px 7px', display: 'flex', alignItems: 'center', cursor: 'pointer' }} title="List View">
                                    <Columns size={13} color="#9ca3af" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Kanban Main Workspace Grid */}
                <main style={{ flex: 1, padding: '0 2rem 2rem 2rem', overflowX: 'auto' }}>
                    {activeTab === 'pipeline' ? (
                        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', minWidth: 'max-content', paddingBottom: '1rem' }}>
                                {STAGES.map((stageInfo, idx) => {
                                    const colProjects = processedProjects.filter((p) => p.stage === stageInfo.key);
                                    const isGroupStart = idx === 0 || STAGES[idx - 1].group !== stageInfo.group;

                                    return (
                                        <Column
                                            key={stageInfo.key}
                                            stageInfo={stageInfo}
                                            projects={colProjects}
                                            onSelectProject={(proj) => setActiveProjectDetail(proj)}
                                            isGroupStart={isGroupStart}
                                        />
                                    );
                                })}
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
}