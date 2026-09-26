import { useState, useEffect, useCallback } from 'react';
import { updateProjectStage } from '../api/projects';
import { fetchQuotes } from '../api/quotes';
import { fetchInvoices } from '../api/invoices';
import { fetchAttachments } from '../api/attachments';
import { fetchNotes } from '../api/notes';
import CreateQuoteModal from './CreateQuoteModal';

const STAGES = [
    { key: 'LEAD', label: 'Lead' },
    { key: 'QUOTED', label: 'Proposal / Quoted' },
    { key: 'BOOKED', label: 'Booked' },
    { key: 'IN_PROGRESS', label: 'In progress' },
    { key: 'DELIVERED', label: 'Delivered' },
    { key: 'PAID', label: 'Completed' },
];

export default function ProjectWorkspace({ project, onClose, onProjectUpdated }) {
    const [activeTab, setActiveTab] = useState('activity'); // 'activity' | 'files' | 'galleries' | 'tasks' | 'financials' | 'notes' | 'details'
    const [currentStage, setCurrentStage] = useState(project.stage);
    const [updatingStage, setUpdatingStage] = useState(false);
    const [showCreateQuoteModal, setShowCreateQuoteModal] = useState(false);

    // Tab Data States
    const [quotes, setQuotes] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [attachments, setAttachments] = useState([]);
    const [notes, setNotes] = useState([]);

    // Form & Input States
    const [messageInput, setMessageInput] = useState('');
    const [leadSourceInput, setLeadSourceInput] = useState(project.leadSource || 'Unknown');
    const [tags, setTags] = useState(['Wedding', 'Client portal active']);
    const [tagInput, setTagInput] = useState('');

    const projectId = project?.id;

    const loadAllProjectData = useCallback(async () => {
        if (!projectId) return;
        try {
            const [quotesData, invoicesData, attachmentsData, notesData] = await Promise.all([
                fetchQuotes(projectId).catch(() => []),
                fetchInvoices(projectId).catch(() => []),
                fetchAttachments(projectId).catch(() => []),
                fetchNotes(projectId).catch(() => [])
            ]);
            setQuotes(quotesData);
            setInvoices(invoicesData);
            setAttachments(attachmentsData);
            setNotes(notesData);
        } catch {
            // ignore
        }
    }, [projectId]);

    useEffect(() => {
        if (!projectId) return;
        let isMounted = true;
        Promise.all([
            fetchQuotes(projectId).catch(() => []),
            fetchInvoices(projectId).catch(() => []),
            fetchAttachments(projectId).catch(() => []),
            fetchNotes(projectId).catch(() => [])
        ]).then(([quotesData, invoicesData, attachmentsData, notesData]) => {
            if (isMounted) {
                setQuotes(quotesData);
                setInvoices(invoicesData);
                setAttachments(attachmentsData);
                setNotes(notesData);
            }
        }).catch(() => {});
        return () => {
            isMounted = false;
        };
    }, [projectId]);


    async function handleStageChange(newStage) {
        setUpdatingStage(true);
        try {
            await updateProjectStage(project.id, newStage);
            setCurrentStage(newStage);
            if (onProjectUpdated) onProjectUpdated(project.id, newStage);
        } catch {
            alert('Failed to update project stage');
        } finally {
            setUpdatingStage(false);
        }
    }


    const copyPortalLink = () => {
        if (!project.portalToken) return;
        const portalUrl = `${window.location.origin}/portal/${project.portalToken}`;
        navigator.clipboard.writeText(portalUrl);
        alert(`Client Portal URL copied to clipboard:\n${portalUrl}`);
    };

    const openPortalInNewTab = () => {
        if (!project.portalToken) return;
        window.open(`/portal/${project.portalToken}`, '_blank');
    };

    const clientName = project.client?.name || 'Test contact';
    const clientInitials = clientName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase() || 'TC';

    const projectType = project.projectType || 'Wedding';
    const portalUrl = project.portalToken ? `${window.location.origin}/portal/${project.portalToken}` : 'https://clientportal.studio-crm.dev/p/sample';

    const handleAddTag = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            setTags([...tags, tagInput.trim()]);
            setTagInput('');
        }
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: '#f8fafc',
            color: '#0f172a',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto'
        }}>
            {/* Top Workspace Header Bar */}
            <header style={{
                height: '54px',
                backgroundColor: '#ffffff',
                borderBottom: '1px solid #e2e8f0',
                padding: '0 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                sticky: 'top',
                zIndex: 10
            }}>
                {/* Left: Back button & Search */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '4px 10px',
                            backgroundColor: '#f1f5f9',
                            border: '1px solid #cbd5e1',
                            borderRadius: '6px',
                            color: '#334155',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        ← Pipeline
                    </button>

                    <div style={{ position: 'relative', width: '220px' }}>
                        <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.8rem' }}>🔍</span>
                        <input
                            placeholder="Search"
                            style={{
                                width: '100%',
                                height: '32px',
                                paddingLeft: '30px',
                                background: '#f1f5f9',
                                border: 'none',
                                borderRadius: '16px',
                                fontSize: '0.8rem',
                                color: '#334155'
                            }}
                        />
                    </div>
                </div>

                {/* Right: Notifications, Pricing, + New */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#64748b', cursor: 'pointer' }}>💎 See pricing</span>
                    <button style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '1rem', padding: '0.3rem' }}>🔔</button>
                    <button className="btn-pill-purple" onClick={openPortalInNewTab}>
                        + New
                    </button>
                </div>
            </header>

            {/* Dark Banner / Cover Image Header matching Screenshot 2 */}
            <div style={{
                position: 'relative',
                height: '240px',
                backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.85)), url("https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1400&auto=format&fit=crop")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                padding: '24px 40px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                color: '#ffffff'
            }}>
                {/* Breadcrumbs */}
                <div style={{ fontSize: '0.82rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>Projects</span>
                    <span>&gt;</span>
                    <strong style={{ color: '#ffffff' }}>{project.title}</strong>
                </div>

                {/* Cover Image Bottom Right Button */}
                <button
                    style={{
                        position: 'absolute',
                        right: '24px',
                        bottom: '24px',
                        background: 'rgba(0, 0, 0, 0.5)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '6px',
                        color: '#ffffff',
                        padding: '6px 10px',
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                    }}
                    title="Change cover picture"
                >
                    🖼️
                </button>

                {/* Title & Subhead */}
                <div>
                    <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#ffffff', marginBottom: '4px', letterSpacing: '-0.02em' }}>
                        {project.title}
                    </h1>
                    <div style={{ fontSize: '0.9rem', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>✓</span>
                        <span>{projectType} • TBD</span>
                    </div>
                </div>
            </div>

            {/* Sub-header Action Bar below Banner */}
            <div style={{
                backgroundColor: '#ffffff',
                borderBottom: '1px solid #e2e8f0',
                padding: '12px 40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                {/* Left Participants info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                        Visible to you • 1 participant
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#38bdf8', color: '#fff', fontSize: '0.65rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            You
                        </div>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#cbd5e1', color: '#334155', fontSize: '0.65rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {clientInitials}
                        </div>
                        <button style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '20px', padding: '3px 10px', fontSize: '0.78rem', color: '#334155', fontWeight: '600' }}>
                            + Add
                        </button>
                    </div>
                </div>

                {/* Right Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button className="btn-secondary" style={{ fontSize: '0.82rem' }}>
                        📅 Schedule
                    </button>
                    <button className="btn-secondary" style={{ fontSize: '0.82rem' }}>
                        📎 Attach
                    </button>
                    <button className="btn-secondary" style={{ fontSize: '0.82rem', color: '#8b5cf6' }}>
                        ✨ AI actions v
                    </button>
                    <button className="btn-black" onClick={() => setShowCreateQuoteModal(true)}>
                        Create file
                    </button>
                </div>
            </div>

            {/* Navigation Tabs Bar */}
            <div style={{
                backgroundColor: '#ffffff',
                borderBottom: '1px solid #e2e8f0',
                padding: '0 40px',
                display: 'flex',
                gap: '24px'
            }}>
                {[
                    { id: 'activity', label: 'Activity' },
                    { id: 'files', label: `Files (${attachments.length})` },
                    { id: 'galleries', label: 'Galleries' },
                    { id: 'tasks', label: 'Tasks' },
                    { id: 'financials', label: `Financials (${quotes.length + invoices.length})` },
                    { id: 'notes', label: `Notes (${notes.length})` },
                    { id: 'details', label: 'Details' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: '12px 0',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderBottom: activeTab === tab.id ? '2.5px solid #6366f1' : '2.5px solid transparent',
                            color: activeTab === tab.id ? '#0f172a' : '#64748b',
                            fontSize: '0.88rem',
                            fontWeight: activeTab === tab.id ? '700' : '500',
                            cursor: 'pointer'
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Two Column Workspace Grid Layout */}
            <div style={{
                maxWidth: '1280px',
                width: '100%',
                margin: '0 auto',
                padding: '24px 40px',
                display: 'grid',
                gridTemplateColumns: '1fr 340px',
                gap: '28px',
                flex: 1
            }}>
                {/* Main Left Column */}
                <div>
                    {activeTab === 'activity' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {/* Send Message Card */}
                            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#38bdf8', color: '#fff', fontSize: '0.75rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    You
                                </div>
                                <input
                                    placeholder="Write a message to your team or client..."
                                    style={{ flex: 1, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.6rem 0.9rem', fontSize: '0.85rem' }}
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                />
                                <button className="btn-black" style={{ fontSize: '0.82rem', padding: '0.5rem 1rem' }}>
                                    Send message v
                                </button>
                            </div>

                            {/* Section: ACTIVE SMART FILES */}
                            <div>
                                <h3 style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                                    ACTIVE SMART FILES
                                </h3>
                                <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '12px' }}>
                                    Track the actions and questions your client still needs to complete
                                </p>

                                <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        {/* File Thumbnail Box */}
                                        <div style={{ width: '70px', height: '70px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', fontSize: '1.8rem' }}>
                                            📑
                                        </div>
                                        <div>
                                            <h4 style={{ fontSize: '0.98rem', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>
                                                {quotes.length > 0 ? quotes[0].title : 'Sample Invoice & Contract'}
                                            </h4>
                                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '8px' }}>
                                                Sent: Sep 15, 2026 at 1:37 PM
                                            </div>
                                            <div style={{ fontSize: '0.75rem', display: 'flex', gap: '12px', color: '#64748b' }}>
                                                <span>PAGES: <strong>1</strong></span>
                                                <span>ACTIONS: <strong>0 Completed</strong></span>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <button className="btn-secondary" style={{ fontSize: '0.8rem' }} onClick={openPortalInNewTab}>
                                            Preview as a client
                                        </button>
                                        <button style={{ background: 'transparent', border: 'none', fontSize: '1.1rem', color: '#94a3b8', cursor: 'pointer' }}>
                                            ⋮
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Section: RECENT ACTIVITY */}
                            <div>
                                <h3 style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                                    RECENT ACTIVITY
                                </h3>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem' }}>
                                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '700' }}>
                                            👤
                                        </div>
                                        <div style={{ flex: 1, color: '#334155' }}>
                                            <strong>{project.client?.name || 'Kaveesha Obadakumbura'}</strong> added <strong>{clientName}</strong> to this workspace
                                        </div>
                                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                            Tue, Sep 15, 2026
                                        </span>
                                    </div>

                                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem' }}>
                                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '700' }}>
                                            ✓
                                        </div>
                                        <div style={{ flex: 1, color: '#334155' }}>
                                            Project initialized in stage <strong>{currentStage}</strong>
                                        </div>
                                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                            Today
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Files Tab */}
                    {activeTab === 'files' && (
                        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1rem' }}>Project Files & Proposals</h3>
                            {attachments.length === 0 ? (
                                <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>No attachments uploaded yet.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {attachments.map(att => (
                                        <div key={att.id} style={{ padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <a href={att.url} target="_blank" rel="noreferrer" style={{ fontWeight: '600', color: '#4f46e5' }}>{att.name} ↗</a>
                                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{att.type}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Financials Tab */}
                    {activeTab === 'financials' && (
                        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1rem' }}>Financial Quotes & Invoices</h3>
                            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                                <button className="btn-black" onClick={() => setShowCreateQuoteModal(true)}>
                                    + Create New Proposal Quote
                                </button>
                            </div>

                            {quotes.length > 0 && (
                                <div>
                                    <h4 style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '8px' }}>Active Proposals</h4>
                                    {quotes.map(q => (
                                        <div key={q.id} style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '8px' }}>
                                            <strong>{q.title}</strong> — ${(q.totalAmount / 100).toFixed(2)} ({q.status})
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Sidebar matching Screenshot 2 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Card 1: Client Portal */}
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <h4 style={{ fontSize: '0.92rem', fontWeight: '700', color: '#0f172a' }}>
                                👤 Client portal
                            </h4>
                            <button
                                style={{ background: 'transparent', border: 'none', color: '#4f46e5', fontSize: '0.78rem', fontWeight: '600', cursor: 'pointer' }}
                                onClick={openPortalInNewTab}
                            >
                                View & edit
                            </button>
                        </div>

                        {/* Portal URL bar */}
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                            <input
                                readOnly
                                value={portalUrl}
                                style={{ flex: 1, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0.45rem 0.6rem', fontSize: '0.75rem', color: '#64748b' }}
                            />
                            <button onClick={copyPortalLink} className="btn-secondary" style={{ padding: '0.45rem', fontSize: '0.8rem' }} title="Copy link">
                                📋
                            </button>
                            <button onClick={openPortalInNewTab} className="btn-secondary" style={{ padding: '0.45rem', fontSize: '0.8rem' }} title="Send link">
                                ✈️
                            </button>
                        </div>

                        {/* Checkbox */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                            <input type="checkbox" defaultChecked id="portalLinkCheck" style={{ marginTop: '2px' }} />
                            <label htmlFor="portalLinkCheck" style={{ fontSize: '0.76rem', color: '#64748b', cursor: 'pointer' }}>
                                Include client portal links in files and emails
                            </label>
                        </div>
                    </div>

                    {/* Card 2: About this project */}
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
                            <h4 style={{ fontSize: '0.92rem', fontWeight: '700', color: '#0f172a' }}>
                                About this project
                            </h4>
                            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }} title="Only visible to you and your team">🔒</span>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '16px' }}>
                            Only visible to you and your team
                        </p>

                        {/* Stage Dropdown */}
                        <div style={{ marginBottom: '14px' }}>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: '#64748b', marginBottom: '0.3rem' }}>
                                Stage
                            </label>
                            <select
                                value={currentStage}
                                disabled={updatingStage}
                                onChange={(e) => handleStageChange(e.target.value)}
                                style={{ width: '100%', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0.5rem 0.7rem', fontSize: '0.82rem', color: '#334155', fontWeight: '600' }}
                            >
                                {STAGES.map((s) => (
                                    <option key={s.key} value={s.key}>
                                        {s.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Lead Source */}
                        <div style={{ marginBottom: '14px' }}>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: '#64748b', marginBottom: '0.3rem' }}>
                                Lead source
                            </label>
                            <input
                                value={leadSourceInput}
                                onChange={(e) => setLeadSourceInput(e.target.value)}
                                style={{ width: '100%', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0.45rem 0.7rem', fontSize: '0.82rem', color: '#334155' }}
                            />
                        </div>

                        {/* Tags */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: '#64748b', marginBottom: '0.3rem' }}>
                                Tags
                            </label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                                {tags.map((t, idx) => (
                                    <span key={idx} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '2px 8px', fontSize: '0.72rem', color: '#334155', fontWeight: '600' }}>
                                        {t}
                                    </span>
                                ))}
                            </div>
                            <input
                                placeholder="Add tags..."
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleAddTag}
                                style={{ width: '100%', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0.45rem 0.7rem', fontSize: '0.8rem' }}
                            />
                            <div style={{ marginTop: '6px' }}>
                                <button style={{ background: 'transparent', border: 'none', color: '#4f46e5', fontSize: '0.75rem', fontWeight: '500', cursor: 'pointer', padding: 0 }}>
                                    Manage company tags
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Proposal Quote Modal */}
            {showCreateQuoteModal && (
                <CreateQuoteModal
                    projectId={project.id}
                    onClose={() => setShowCreateQuoteModal(false)}
                    onQuoteCreated={() => {
                        loadAllProjectData();
                    }}
                />
            )}
        </div>
    );
}
