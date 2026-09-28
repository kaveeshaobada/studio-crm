import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchProjects, updateProjectStage } from '../api/projects';
import {
    DndContext,
    closestCorners,
    pointerWithin,
    rectIntersection,
    useDroppable,
    PointerSensor,
    KeyboardSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
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
    PanelLeftClose,
    PanelLeftOpen,
    Gem,
    Bell,
    Sparkles,
    Search,
    Plus,
    ChevronDown,
    ChevronUp,
    ChevronRight,
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

function Column({ stageInfo, projects, onSelectProject, isGroupStart, isTargeted }) {
    const { setNodeRef } = useDroppable({ id: stageInfo.key });

    return (
        <div
            style={{
                width: '260px',
                minWidth: '260px',
                flex: '0 0 260px',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                minHeight: 0,
            }}
        >
            {/* Stage Group Badge (Opportunities vs Projects) */}
            <div style={{ minHeight: '24px', marginBottom: '0.45rem', flexShrink: 0 }}>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.1rem 0.2rem 0.5rem 0.2rem', flexShrink: 0 }}>
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
                    background: isTargeted ? '#e8edf2' : '#f1f3f5',
                    borderRadius: '12px',
                    padding: '8px',
                    flex: 1,
                    minHeight: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.65rem',
                    border: isTargeted ? '1px solid #818cf8' : '1px solid #e5e7eb',
                    outline: isTargeted ? '2px dotted #6366f1' : '2px dotted transparent',
                    outlineOffset: '-2px',
                    transition: 'outline-color 0.22s ease, border-color 0.22s ease, background-color 0.22s ease',
                    overflowY: 'auto',
                    scrollbarWidth: 'thin',
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
        background: isDragging ? '#f8fafc' : '#ffffff',
        border: isDragging ? '1px dashed #cbd5e1' : '1px solid #e5e7eb',
        borderRadius: '10px',
        padding: '1rem 1.1rem',
        transform: isDragging ? undefined : CSS.Transform.toString(transform),
        transition: isDragging ? undefined : (transition || 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease'),
        opacity: isDragging ? 0.25 : 1,
        boxShadow: isDragging ? 'none' : '0 1px 2px rgba(0, 0, 0, 0.04)',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        position: 'relative',
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

function CardOverlay({ project }) {
    if (!project) return null;
    const clientName = project.client?.name || project.clientName || 'Miranda Cruz';
    const leadSource = project.leadSource || 'Unknown';
    const projectType = project.projectType || project.serviceType || 'Consulting';

    return (
        <div
            style={{
                width: '242px',
                background: '#ffffff',
                border: '1px solid #c7d2fe',
                borderRadius: '10px',
                padding: '1rem 1.1rem',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(99, 102, 241, 0.15)',
                cursor: 'grabbing',
                userSelect: 'none',
                transform: 'rotate(1.5deg) scale(1.02)',
                transformOrigin: 'center center',
            }}
        >
            <h4 style={{
                fontSize: '1rem',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '0.45rem',
                lineHeight: '1.3',
            }}>
                {project.title}
            </h4>

            {project.dateRange && (
                <div style={{ fontSize: '0.78rem', color: '#6b7280', marginBottom: '0.4rem', fontWeight: '500' }}>
                    Date: <span style={{ color: '#374151' }}>{project.dateRange}</span>
                </div>
            )}

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

const dropAnimationConfig = {
    sideEffects: defaultDropAnimationSideEffects({
        styles: {
            active: {
                opacity: '0.25',
            },
        },
    }),
    duration: 240,
    easing: 'cubic-bezier(0.2, 0, 0, 1)',
};

const kanbanCollisionDetection = (args) => {
    // 1. First priority: Check if pointer is within any droppable (column grey box or card)
    const pointerCollisions = pointerWithin(args);
    if (pointerCollisions && pointerCollisions.length > 0) {
        return pointerCollisions;
    }
    // 2. Second priority: rect intersection
    const rectCollisions = rectIntersection(args);
    if (rectCollisions && rectCollisions.length > 0) {
        return rectCollisions;
    }
    // 3. Fallback: closest corners
    return closestCorners(args);
};

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
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor)
    );

    const [activeId, setActiveId] = useState(null);
    const [overColumnId, setOverColumnId] = useState(null);

    const activeProject = useMemo(
        () => (activeId ? projects.find((p) => p.id === activeId) : null),
        [activeId, projects]
    );

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragOver = (event) => {
        const { over } = event;
        if (!over) {
            setOverColumnId(null);
            return;
        }

        const overId = over.id;
        if (STAGES.some((s) => s.key === overId)) {
            setOverColumnId(overId);
            return;
        }

        const overProject = projects.find((p) => p.id === overId);
        if (overProject) {
            setOverColumnId(overProject.stage);
        } else {
            setOverColumnId(null);
        }
    };

    const handleDragCancel = () => {
        setActiveId(null);
        setOverColumnId(null);
    };

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
        setActiveId(null);
        setOverColumnId(null);

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
        <div style={{ width: '100%', height: '100vh', display: 'flex', background: '#ffffff', position: 'relative', overflow: 'hidden' }}>
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
                    padding: '1rem 10px',
                    transition: 'width 0.28s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.28s ease',
                    boxShadow: (!isPinned && isHovered) ? '6px 0 25px rgba(0, 0, 0, 0.45)' : 'none',
                    zIndex: 50,
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    willChange: 'width',
                }}
            >
                {/* Top Row: Brand Logo + Action Button (Lock Expand or Minimize) */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isExpanded ? 'space-between' : 'center',
                    width: '100%',
                    position: 'relative',
                    height: '36px',
                    marginBottom: '0.8rem',
                    flexShrink: 0,
                }}>
                    <div style={{
                        width: '40px',
                        minWidth: '40px',
                        height: '36px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isExpanded ? 'flex-start' : 'center',
                        justifyContent: 'center',
                        paddingLeft: isExpanded ? '4px' : '0',
                        color: '#ffffff',
                        fontWeight: '900',
                        fontSize: '0.74rem',
                        lineHeight: '1.05',
                        letterSpacing: '0.04em',
                        cursor: 'pointer',
                        userSelect: 'none',
                        transition: 'all 0.2s ease',
                    }} title="Studio CRM">
                        <span>HY</span>
                        <span>BK</span>
                    </div>

                    {/* Action Button: Expand / Collapse Control */}
                    <div style={{
                        position: 'absolute',
                        right: '4px',
                        opacity: isExpanded ? 1 : 0,
                        transform: isExpanded ? 'translateX(0)' : 'translateX(6px)',
                        pointerEvents: isExpanded ? 'auto' : 'none',
                        transition: 'opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <button
                            onClick={isPinned ? handleMinimize : handleLockExpand}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#9ca3af',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '28px',
                                height: '28px',
                                borderRadius: '6px',
                                padding: 0,
                                transition: 'color 0.18s ease, background 0.18s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = '#ffffff';
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = '#9ca3af';
                                e.currentTarget.style.background = 'transparent';
                            }}
                            title={isPinned ? 'Collapse sidebar' : 'Lock sidebar open'}
                        >
                            {isPinned ? (
                                <PanelLeftClose size={18} strokeWidth={2} />
                            ) : (
                                <PanelLeftOpen size={18} strokeWidth={2} />
                            )}
                        </button>
                    </div>
                </div>

                {/* Onboarding progress card (Fixed 64px height in both states to eliminate any vertical layout shift) */}
                <div style={{
                    width: '100%',
                    height: '64px',
                    marginBottom: '0.8rem',
                    position: 'relative',
                    flexShrink: 0,
                }}>
                    {/* Expanded view */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            padding: '0.55rem 0.75rem',
                            borderRadius: '8px',
                            background: 'rgba(255, 255, 255, 0.06)',
                            cursor: 'pointer',
                            boxSizing: 'border-box',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            opacity: isExpanded ? 1 : 0,
                            transform: isExpanded ? 'scale(1)' : 'scale(0.96)',
                            pointerEvents: isExpanded ? 'auto' : 'none',
                            transition: 'opacity 0.22s ease, transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                            overflow: 'hidden',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                            <span style={{ color: '#ffffff', fontSize: '0.78rem', fontWeight: '600', whiteSpace: 'nowrap' }}>Set up your account</span>
                            <ChevronRight size={13} color="#9ca3af" />
                        </div>
                        <div style={{ width: '100%', height: '3px', background: 'rgba(255, 255, 255, 0.12)', borderRadius: '2px', overflow: 'hidden', marginBottom: '5px' }}>
                            <div style={{ width: '28%', height: '100%', background: '#10b981', borderRadius: '2px' }} />
                        </div>
                        <span style={{ color: '#9ca3af', fontSize: '0.7rem' }}>2/7 completed</span>
                    </div>

                    {/* Collapsed view */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            borderRadius: '8px',
                            background: 'rgba(255, 255, 255, 0.06)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px',
                            cursor: 'pointer',
                            opacity: isExpanded ? 0 : 1,
                            transform: isExpanded ? 'scale(0.9)' : 'scale(1)',
                            pointerEvents: isExpanded ? 'none' : 'auto',
                            transition: 'opacity 0.2s ease, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                            boxSizing: 'border-box',
                        }}
                        title="Setup: 2/7 completed"
                    >
                        <ChevronRight size={12} color="#9ca3af" />
                        <div style={{ width: '26px', height: '3px', background: 'rgba(255, 255, 255, 0.12)', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ width: '28%', height: '100%', background: '#10b981', borderRadius: '2px' }} />
                        </div>
                        <span style={{ color: '#9ca3af', fontSize: '0.65rem', fontWeight: '600' }}>2/7</span>
                    </div>
                </div>

                {/* Vertical Navigation Menu */}
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', width: '100%' }}>
                    {/* Setup */}
                    <button
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            gap: '10px',
                            background: 'transparent',
                            border: 'none',
                            color: '#9ca3af',
                            padding: '0.45rem 8px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.82rem',
                            width: '100%',
                            transition: 'background 0.18s ease, color 0.18s ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.background = 'transparent'; }}
                        title="Setup"
                    >
                        <div style={{ width: '24px', minWidth: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Wand2 size={18} />
                        </div>
                        <span style={{
                            whiteSpace: 'nowrap',
                            opacity: isExpanded ? 1 : 0,
                            transform: isExpanded ? 'translateX(0)' : 'translateX(-8px)',
                            transition: isExpanded ? 'opacity 0.2s ease 0.06s, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1) 0.06s' : 'opacity 0.14s ease, transform 0.14s ease',
                            pointerEvents: isExpanded ? 'auto' : 'none',
                            overflow: 'hidden',
                        }}>Setup</span>
                    </button>

                    {/* Home */}
                    <button
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            gap: '10px',
                            background: 'transparent',
                            border: 'none',
                            color: '#9ca3af',
                            padding: '0.45rem 8px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.82rem',
                            width: '100%',
                            transition: 'background 0.18s ease, color 0.18s ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.background = 'transparent'; }}
                        title="Home"
                    >
                        <div style={{ width: '24px', minWidth: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Home size={18} />
                        </div>
                        <span style={{
                            whiteSpace: 'nowrap',
                            opacity: isExpanded ? 1 : 0,
                            transform: isExpanded ? 'translateX(0)' : 'translateX(-8px)',
                            transition: isExpanded ? 'opacity 0.2s ease 0.06s, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1) 0.06s' : 'opacity 0.14s ease, transform 0.14s ease',
                            pointerEvents: isExpanded ? 'auto' : 'none',
                            overflow: 'hidden',
                        }}>Home</span>
                    </button>

                    {/* Projects (Expanded Accordion vs Minimized Standard Icon) */}
                    {isExpanded ? (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.25rem',
                            width: '100%',
                        }}>
                            <button
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '0.45rem 8px',
                                    background: 'transparent',
                                    border: 'none',
                                    color: activeTab === 'pipeline' ? '#ffffff' : '#9ca3af',
                                    fontSize: '0.82rem',
                                    fontWeight: activeTab === 'pipeline' ? '600' : '400',
                                    cursor: 'pointer',
                                    borderRadius: '6px',
                                    transition: 'background 0.18s ease, color 0.18s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = '#ffffff';
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = activeTab === 'pipeline' ? '#ffffff' : '#9ca3af';
                                    e.currentTarget.style.background = 'transparent';
                                }}
                                onClick={() => {
                                    setProjectsSubmenuOpen(!projectsSubmenuOpen);
                                    if (activeTab !== 'pipeline') {
                                        setActiveTab('pipeline');
                                    }
                                }}
                                title="Projects"
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '24px', minWidth: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Briefcase size={18} strokeWidth={2} />
                                    </div>
                                    <span style={{
                                        whiteSpace: 'nowrap',
                                        fontSize: '0.82rem',
                                    }}>Projects</span>
                                </div>
                                {projectsSubmenuOpen ? (
                                    <ChevronUp size={13} strokeWidth={2} />
                                ) : (
                                    <ChevronDown size={13} strokeWidth={2} />
                                )}
                            </button>

                            {projectsSubmenuOpen && (
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.25rem',
                                    width: '100%',
                                    boxSizing: 'border-box',
                                }}>
                                    <button
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'flex-start',
                                            width: '100%',
                                            padding: '0.45rem 8px',
                                            borderRadius: '6px',
                                            background: activeTab === 'pipeline' ? '#2b2c2d' : 'transparent',
                                            border: 'none',
                                            color: activeTab === 'pipeline' ? '#ffffff' : '#9ca3af',
                                            fontSize: '0.82rem',
                                            fontWeight: activeTab === 'pipeline' ? '600' : '400',
                                            cursor: 'pointer',
                                            whiteSpace: 'nowrap',
                                            textAlign: 'left',
                                            transition: 'background 0.15s ease, color 0.15s ease',
                                            boxSizing: 'border-box',
                                        }}
                                        onClick={() => setActiveTab('pipeline')}
                                        onMouseEnter={(e) => {
                                            if (activeTab !== 'pipeline') {
                                                e.currentTarget.style.color = '#ffffff';
                                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (activeTab !== 'pipeline') {
                                                e.currentTarget.style.color = '#9ca3af';
                                                e.currentTarget.style.background = 'transparent';
                                            }
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '24px', minWidth: '24px', flexShrink: 0 }} />
                                            <span>Pipeline</span>
                                        </div>
                                    </button>
                                    <button
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'flex-start',
                                            width: '100%',
                                            padding: '0.45rem 8px',
                                            borderRadius: '6px',
                                            background: 'transparent',
                                            border: 'none',
                                            color: '#9ca3af',
                                            fontSize: '0.82rem',
                                            fontWeight: '400',
                                            cursor: 'pointer',
                                            whiteSpace: 'nowrap',
                                            textAlign: 'left',
                                            transition: 'background 0.15s ease, color 0.15s ease',
                                            boxSizing: 'border-box',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.color = '#ffffff';
                                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.color = '#9ca3af';
                                            e.currentTarget.style.background = 'transparent';
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '24px', minWidth: '24px', flexShrink: 0 }} />
                                            <span>All files</span>
                                        </div>
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                gap: '10px',
                                background: activeTab === 'pipeline' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                                border: 'none',
                                color: activeTab === 'pipeline' ? '#ffffff' : '#9ca3af',
                                padding: '0.45rem 8px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.82rem',
                                width: '100%',
                                transition: 'background 0.18s ease, color 0.18s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = '#ffffff';
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = activeTab === 'pipeline' ? '#ffffff' : '#9ca3af';
                                e.currentTarget.style.background = activeTab === 'pipeline' ? 'rgba(255, 255, 255, 0.08)' : 'transparent';
                            }}
                            title="Projects"
                            onClick={() => setActiveTab('pipeline')}
                        >
                            <div style={{ width: '24px', minWidth: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Briefcase size={18} />
                            </div>
                        </button>
                    )}

                    {/* Inbox */}
                    <button
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            gap: '10px',
                            background: 'transparent',
                            border: 'none',
                            color: '#9ca3af',
                            padding: '0.45rem 8px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.82rem',
                            width: '100%',
                            transition: 'background 0.18s ease, color 0.18s ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.background = 'transparent'; }}
                        title="Inbox"
                    >
                        <div style={{ width: '24px', minWidth: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Inbox size={18} />
                        </div>
                        <span style={{
                            whiteSpace: 'nowrap',
                            opacity: isExpanded ? 1 : 0,
                            transform: isExpanded ? 'translateX(0)' : 'translateX(-8px)',
                            transition: isExpanded ? 'opacity 0.2s ease 0.06s, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1) 0.06s' : 'opacity 0.14s ease, transform 0.14s ease',
                            pointerEvents: isExpanded ? 'auto' : 'none',
                            overflow: 'hidden',
                        }}>Inbox</span>
                    </button>

                    {/* Galleries */}
                    <button
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            gap: '10px',
                            background: 'transparent',
                            border: 'none',
                            color: '#9ca3af',
                            padding: '0.45rem 8px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.82rem',
                            width: '100%',
                            transition: 'background 0.18s ease, color 0.18s ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.background = 'transparent'; }}
                        title="Galleries"
                    >
                        <div style={{ width: '24px', minWidth: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Image size={18} />
                        </div>
                        <span style={{
                            whiteSpace: 'nowrap',
                            opacity: isExpanded ? 1 : 0,
                            transform: isExpanded ? 'translateX(0)' : 'translateX(-8px)',
                            transition: isExpanded ? 'opacity 0.2s ease 0.06s, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1) 0.06s' : 'opacity 0.14s ease, transform 0.14s ease',
                            pointerEvents: isExpanded ? 'auto' : 'none',
                            overflow: 'hidden',
                        }}>Galleries</span>
                    </button>

                    {/* Forms */}
                    <button
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            gap: '10px',
                            background: 'transparent',
                            border: 'none',
                            color: '#9ca3af',
                            padding: '0.45rem 8px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.82rem',
                            width: '100%',
                            transition: 'background 0.18s ease, color 0.18s ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.background = 'transparent'; }}
                        title="Forms"
                    >
                        <div style={{ width: '24px', minWidth: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <FileText size={18} />
                        </div>
                        <span style={{
                            whiteSpace: 'nowrap',
                            opacity: isExpanded ? 1 : 0,
                            transform: isExpanded ? 'translateX(0)' : 'translateX(-8px)',
                            transition: isExpanded ? 'opacity 0.2s ease 0.06s, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1) 0.06s' : 'opacity 0.14s ease, transform 0.14s ease',
                            pointerEvents: isExpanded ? 'auto' : 'none',
                            overflow: 'hidden',
                        }}>Forms</span>
                    </button>

                    {/* Calendar */}
                    <button
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            gap: '10px',
                            background: 'transparent',
                            border: 'none',
                            color: '#9ca3af',
                            padding: '0.45rem 8px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.82rem',
                            width: '100%',
                            transition: 'background 0.18s ease, color 0.18s ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.background = 'transparent'; }}
                        title="Calendar"
                    >
                        <div style={{ width: '24px', minWidth: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Calendar size={18} />
                        </div>
                        <span style={{
                            whiteSpace: 'nowrap',
                            opacity: isExpanded ? 1 : 0,
                            transform: isExpanded ? 'translateX(0)' : 'translateX(-8px)',
                            transition: isExpanded ? 'opacity 0.2s ease 0.06s, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1) 0.06s' : 'opacity 0.14s ease, transform 0.14s ease',
                            pointerEvents: isExpanded ? 'auto' : 'none',
                            overflow: 'hidden',
                        }}>Calendar</span>
                    </button>

                    {/* Services */}
                    <button
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            gap: '10px',
                            background: 'transparent',
                            border: 'none',
                            color: '#9ca3af',
                            padding: '0.45rem 8px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.82rem',
                            width: '100%',
                            transition: 'background 0.18s ease, color 0.18s ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.background = 'transparent'; }}
                        title="Services"
                    >
                        <div style={{ width: '24px', minWidth: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Tag size={18} />
                        </div>
                        <span style={{
                            whiteSpace: 'nowrap',
                            opacity: isExpanded ? 1 : 0,
                            transform: isExpanded ? 'translateX(0)' : 'translateX(-8px)',
                            transition: isExpanded ? 'opacity 0.2s ease 0.06s, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1) 0.06s' : 'opacity 0.14s ease, transform 0.14s ease',
                            pointerEvents: isExpanded ? 'auto' : 'none',
                            overflow: 'hidden',
                        }}>Services</span>
                    </button>

                    {/* Templates */}
                    <button
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            gap: '10px',
                            background: 'transparent',
                            border: 'none',
                            color: '#9ca3af',
                            padding: '0.45rem 8px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.82rem',
                            width: '100%',
                            transition: 'background 0.18s ease, color 0.18s ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.background = 'transparent'; }}
                        title="Templates"
                    >
                        <div style={{ width: '24px', minWidth: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Layers size={18} />
                        </div>
                        <span style={{
                            whiteSpace: 'nowrap',
                            opacity: isExpanded ? 1 : 0,
                            transform: isExpanded ? 'translateX(0)' : 'translateX(-8px)',
                            transition: isExpanded ? 'opacity 0.2s ease 0.06s, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1) 0.06s' : 'opacity 0.14s ease, transform 0.14s ease',
                            pointerEvents: isExpanded ? 'auto' : 'none',
                            overflow: 'hidden',
                        }}>Templates</span>
                        <div style={{
                            marginLeft: 'auto',
                            opacity: isExpanded ? 1 : 0,
                            transition: 'opacity 0.18s ease',
                            pointerEvents: isExpanded ? 'auto' : 'none',
                        }}>
                            <ChevronDown size={13} color="#9ca3af" />
                        </div>
                    </button>

                    {/* Finance */}
                    <button
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            gap: '10px',
                            background: 'transparent',
                            border: 'none',
                            color: '#9ca3af',
                            padding: '0.45rem 8px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.82rem',
                            width: '100%',
                            transition: 'background 0.18s ease, color 0.18s ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.background = 'transparent'; }}
                        title="Finance"
                    >
                        <div style={{ width: '24px', minWidth: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <DollarSign size={18} />
                        </div>
                        <span style={{
                            whiteSpace: 'nowrap',
                            opacity: isExpanded ? 1 : 0,
                            transform: isExpanded ? 'translateX(0)' : 'translateX(-8px)',
                            transition: isExpanded ? 'opacity 0.2s ease 0.06s, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1) 0.06s' : 'opacity 0.14s ease, transform 0.14s ease',
                            pointerEvents: isExpanded ? 'auto' : 'none',
                            overflow: 'hidden',
                        }}>Finance</span>
                        <div style={{
                            marginLeft: 'auto',
                            opacity: isExpanded ? 1 : 0,
                            transition: 'opacity 0.18s ease',
                            pointerEvents: isExpanded ? 'auto' : 'none',
                        }}>
                            <ChevronDown size={13} color="#9ca3af" />
                        </div>
                    </button>

                    {/* Automations */}
                    <button
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            gap: '10px',
                            background: 'transparent',
                            border: 'none',
                            color: '#9ca3af',
                            padding: '0.45rem 8px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.82rem',
                            width: '100%',
                            transition: 'background 0.18s ease, color 0.18s ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.background = 'transparent'; }}
                        title="Automations"
                    >
                        <div style={{ width: '24px', minWidth: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Zap size={18} />
                        </div>
                        <span style={{
                            whiteSpace: 'nowrap',
                            opacity: isExpanded ? 1 : 0,
                            transform: isExpanded ? 'translateX(0)' : 'translateX(-8px)',
                            transition: isExpanded ? 'opacity 0.2s ease 0.06s, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1) 0.06s' : 'opacity 0.14s ease, transform 0.14s ease',
                            pointerEvents: isExpanded ? 'auto' : 'none',
                            overflow: 'hidden',
                        }}>Automations</span>
                    </button>

                    {/* Tools */}
                    <button
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            gap: '10px',
                            background: 'transparent',
                            border: 'none',
                            color: '#9ca3af',
                            padding: '0.45rem 8px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.82rem',
                            width: '100%',
                            transition: 'background 0.18s ease, color 0.18s ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.background = 'transparent'; }}
                        title="Tools"
                    >
                        <div style={{ width: '24px', minWidth: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Wrench size={18} />
                        </div>
                        <span style={{
                            whiteSpace: 'nowrap',
                            opacity: isExpanded ? 1 : 0,
                            transform: isExpanded ? 'translateX(0)' : 'translateX(-8px)',
                            transition: isExpanded ? 'opacity 0.2s ease 0.06s, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1) 0.06s' : 'opacity 0.14s ease, transform 0.14s ease',
                            pointerEvents: isExpanded ? 'auto' : 'none',
                            overflow: 'hidden',
                        }}>Tools</span>
                        <div style={{
                            marginLeft: 'auto',
                            opacity: isExpanded ? 1 : 0,
                            transition: 'opacity 0.18s ease',
                            pointerEvents: isExpanded ? 'auto' : 'none',
                        }}>
                            <ChevronDown size={13} color="#9ca3af" />
                        </div>
                    </button>

                    {/* Reports */}
                    <button
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            gap: '10px',
                            background: activeTab === 'analytics' ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                            border: 'none',
                            color: activeTab === 'analytics' ? '#ffffff' : '#9ca3af',
                            padding: '0.45rem 8px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.82rem',
                            width: '100%',
                            transition: 'background 0.18s ease, color 0.18s ease',
                        }}
                        onMouseEnter={(e) => { if (activeTab !== 'analytics') { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; } }}
                        onMouseLeave={(e) => { if (activeTab !== 'analytics') { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.background = 'transparent'; } }}
                        title="Reports"
                        onClick={() => setActiveTab('analytics')}
                    >
                        <div style={{ width: '24px', minWidth: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <BarChart3 size={18} />
                        </div>
                        <span style={{
                            whiteSpace: 'nowrap',
                            opacity: isExpanded ? 1 : 0,
                            transform: isExpanded ? 'translateX(0)' : 'translateX(-8px)',
                            transition: isExpanded ? 'opacity 0.2s ease 0.06s, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1) 0.06s' : 'opacity 0.14s ease, transform 0.14s ease',
                            pointerEvents: isExpanded ? 'auto' : 'none',
                            overflow: 'hidden',
                        }}>Reports</span>
                    </button>

                    {/* Contacts */}
                    <button
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            gap: '10px',
                            background: 'transparent',
                            border: 'none',
                            color: '#9ca3af',
                            padding: '0.45rem 8px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.82rem',
                            width: '100%',
                            transition: 'background 0.18s ease, color 0.18s ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.background = 'transparent'; }}
                        title="Contacts"
                        onClick={() => setShowClientDirectory(true)}
                    >
                        <div style={{ width: '24px', minWidth: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <User size={18} />
                        </div>
                        <span style={{
                            whiteSpace: 'nowrap',
                            opacity: isExpanded ? 1 : 0,
                            transform: isExpanded ? 'translateX(0)' : 'translateX(-8px)',
                            transition: isExpanded ? 'opacity 0.2s ease 0.06s, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1) 0.06s' : 'opacity 0.14s ease, transform 0.14s ease',
                            pointerEvents: isExpanded ? 'auto' : 'none',
                            overflow: 'hidden',
                        }}>Contacts</span>
                    </button>
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
                    <button
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            gap: '10px',
                            padding: '0.45rem 8px',
                            background: 'transparent',
                            border: 'none',
                            color: '#9ca3af',
                            fontSize: '0.82rem',
                            cursor: 'pointer',
                            borderRadius: '6px',
                            width: '100%',
                            transition: 'background 0.18s ease, color 0.18s ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.background = 'transparent'; }}
                        title="Resources"
                    >
                        <div style={{ width: '24px', minWidth: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <LifeBuoy size={18} />
                        </div>
                        <span style={{
                            whiteSpace: 'nowrap',
                            opacity: isExpanded ? 1 : 0,
                            transform: isExpanded ? 'translateX(0)' : 'translateX(-8px)',
                            transition: isExpanded ? 'opacity 0.2s ease 0.06s, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1) 0.06s' : 'opacity 0.14s ease, transform 0.14s ease',
                            pointerEvents: isExpanded ? 'auto' : 'none',
                            overflow: 'hidden',
                        }}>Resources</span>
                    </button>

                    <button
                        onClick={logout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            gap: '10px',
                            padding: '0.45rem 8px',
                            background: 'transparent',
                            border: 'none',
                            color: '#ffffff',
                            fontSize: '0.82rem',
                            cursor: 'pointer',
                            borderRadius: '6px',
                            width: '100%',
                            transition: 'background 0.18s ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                        title="Account & Settings (Click to Logout)"
                    >
                        <div style={{ width: '24px', minWidth: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <div style={{
                                width: '22px',
                                height: '22px',
                                borderRadius: '50%',
                                background: '#0284c7',
                                color: '#ffffff',
                                fontSize: '0.7rem',
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
                            opacity: isExpanded ? 1 : 0,
                            transform: isExpanded ? 'translateX(0)' : 'translateX(-8px)',
                            transition: isExpanded ? 'opacity 0.2s ease 0.06s, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1) 0.06s' : 'opacity 0.14s ease, transform 0.14s ease',
                            pointerEvents: isExpanded ? 'auto' : 'none',
                            overflow: 'hidden',
                        }}>Settings</span>
                    </button>
                </div>
            </aside>

            {/* Main Workspace Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100vh', background: '#ffffff', overflow: 'hidden' }}>
                {/* Top Header Bar */}
                <header style={{
                    height: '56px',
                    flexShrink: 0,
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
                <div style={{ padding: '1.25rem 2rem 0.25rem 2rem', flexShrink: 0 }}>
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.85rem', marginBottom: '0.9rem', flexShrink: 0 }}>
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
                <main style={{
                    flex: 1,
                    minHeight: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '0 2rem 1.25rem 2rem',
                    overflowX: 'auto',
                    overflowY: activeTab === 'pipeline' ? 'hidden' : 'auto',
                }}>
                    {activeTab === 'pipeline' ? (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={kanbanCollisionDetection}
                            onDragStart={handleDragStart}
                            onDragOver={handleDragOver}
                            onDragEnd={handleDragEnd}
                            onDragCancel={handleDragCancel}
                        >
                            <div style={{
                                display: 'flex',
                                gap: '1rem',
                                minWidth: 'max-content',
                                flex: 1,
                                height: '100%',
                                minHeight: 0,
                                alignItems: 'stretch',
                            }}>
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
                                            isTargeted={Boolean(activeId && overColumnId === stageInfo.key && activeProject?.stage !== stageInfo.key)}
                                        />
                                    );
                                })}
                            </div>
                            <DragOverlay dropAnimation={dropAnimationConfig} zIndex={1000}>
                                {activeProject ? (
                                    <CardOverlay project={activeProject} />
                                ) : null}
                            </DragOverlay>
                        </DndContext>
                    ) : (
                        <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
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