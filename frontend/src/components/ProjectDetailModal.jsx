import React, { useState, useEffect } from 'react';
import { updateProjectStage } from '../api/projects';
import { fetchQuotes } from '../api/quotes';
import { fetchInvoices, recordPayment } from '../api/invoices';
import { fetchAttachments, createAttachment, deleteAttachment } from '../api/attachments';
import { fetchNotes, createNote, togglePinNote, deleteNote } from '../api/notes';
import CreateQuoteModal from './CreateQuoteModal';

const STAGES = ['LEAD', 'QUOTED', 'BOOKED', 'IN_PROGRESS', 'DELIVERED', 'PAID'];

export default function ProjectDetailModal({ project, onClose, onProjectUpdated }) {
    const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'quotes' | 'invoices' | 'assets' | 'notes' | 'client'
    const [currentStage, setCurrentStage] = useState(project.stage);
    const [updatingStage, setUpdatingStage] = useState(false);
    const [showCreateQuoteModal, setShowCreateQuoteModal] = useState(false);

    // Tab Data States
    const [quotes, setQuotes] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [attachments, setAttachments] = useState([]);
    const [notes, setNotes] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [tabError, setTabError] = useState(null);

    // Form states inside tabs
    const [newAssetName, setNewAssetName] = useState('');
    const [newAssetUrl, setNewAssetUrl] = useState('');
    const [newAssetType, setNewAssetType] = useState('DELIVERABLE');
    const [newAssetVisible, setNewAssetVisible] = useState(true);
    const [submittingAsset, setSubmittingAsset] = useState(false);

    const [newNoteContent, setNewNoteContent] = useState('');
    const [newNotePinned, setNewNotePinned] = useState(false);
    const [submittingNote, setSubmittingNote] = useState(false);

    const [paymentAmount, setPaymentAmount] = useState('');
    const [payingInvoiceId, setPayingInvoiceId] = useState(null);

    useEffect(() => {
        if (project?.id) {
            loadAllProjectData();
        }
    }, [project.id]);

    async function loadAllProjectData() {
        setLoadingData(true);
        setTabError(null);
        try {
            const [quotesData, invoicesData, attachmentsData, notesData] = await Promise.all([
                fetchQuotes(project.id).catch(() => []),
                fetchInvoices(project.id).catch(() => []),
                fetchAttachments(project.id).catch(() => []),
                fetchNotes(project.id).catch(() => [])
            ]);
            setQuotes(quotesData);
            setInvoices(invoicesData);
            setAttachments(attachmentsData);
            setNotes(notesData);
        } catch (err) {
            setTabError('Failed to load project details');
        } finally {
            setLoadingData(false);
        }
    }

    async function handleStageChange(newStage) {
        setUpdatingStage(true);
        try {
            await updateProjectStage(project.id, newStage);
            setCurrentStage(newStage);
            if (onProjectUpdated) onProjectUpdated(project.id, newStage);
        } catch (err) {
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

    // Asset handlers
    async function handleAddAsset(e) {
        e.preventDefault();
        if (!newAssetName.trim() || !newAssetUrl.trim()) return;
        setSubmittingAsset(true);
        try {
            const created = await createAttachment({
                name: newAssetName,
                url: newAssetUrl,
                type: newAssetType,
                isClientVisible: newAssetVisible,
                projectId: project.id
            });
            setAttachments([created, ...attachments]);
            setNewAssetName('');
            setNewAssetUrl('');
            setNewAssetType('DELIVERABLE');
            setNewAssetVisible(true);
        } catch (err) {
            alert(err.response?.data?.error || err.message);
        } finally {
            setSubmittingAsset(false);
        }
    }

    async function handleDeleteAsset(id) {
        if (!window.confirm('Delete this asset link?')) return;
        try {
            await deleteAttachment(id);
            setAttachments(attachments.filter(a => a.id !== id));
        } catch (err) {
            alert('Failed to delete asset');
        }
    }

    // Note handlers
    async function handleAddNote(e) {
        e.preventDefault();
        if (!newNoteContent.trim()) return;
        setSubmittingNote(true);
        try {
            const created = await createNote({
                content: newNoteContent,
                isPinned: newNotePinned,
                projectId: project.id
            });
            const updatedNotes = await fetchNotes(project.id);
            setNotes(updatedNotes);
            setNewNoteContent('');
            setNewNotePinned(false);
        } catch (err) {
            alert(err.response?.data?.error || err.message);
        } finally {
            setSubmittingNote(false);
        }
    }

    async function handleTogglePin(id) {
        try {
            await togglePinNote(id);
            const updatedNotes = await fetchNotes(project.id);
            setNotes(updatedNotes);
        } catch (err) {
            alert('Failed to update note pin');
        }
    }

    async function handleDeleteNote(id) {
        if (!window.confirm('Delete this team note?')) return;
        try {
            await deleteNote(id);
            setNotes(notes.filter(n => n.id !== id));
        } catch (err) {
            alert('Failed to delete note');
        }
    }

    // Invoice Payment Handler
    async function handleRecordPayment(invoiceId) {
        const cents = Math.round(parseFloat(paymentAmount) * 100);
        if (isNaN(cents) || cents <= 0) return alert('Enter a valid payment amount');

        try {
            const updated = await recordPayment(invoiceId, cents);
            setInvoices(invoices.map(inv => inv.id === invoiceId ? updated : inv));
            setPaymentAmount('');
            setPayingInvoiceId(null);
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to record payment');
        }
    }

    const formatCurrency = (cents) => {
        return (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    function getAssetTypeBadge(type) {
        switch (type) {
            case 'DELIVERABLE':
                return { bg: 'rgba(99, 102, 241, 0.15)', text: '#a5b4fc', label: 'Deliverable' };
            case 'BRIEF':
                return { bg: 'rgba(14, 165, 233, 0.15)', text: '#7dd3fc', label: 'Shoot Brief' };
            case 'CONTRACT':
                return { bg: 'rgba(16, 185, 129, 0.15)', text: '#6ee7b7', label: 'Contract / Legal' };
            default:
                return { bg: 'rgba(148, 163, 184, 0.15)', text: '#cbd5e1', label: 'General' };
        }
    }

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '16px'
        }}>
            <div style={{
                backgroundColor: '#11141b',
                border: '1px solid #232833',
                borderRadius: '14px',
                width: '100%',
                maxWidth: '920px',
                height: '85vh',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 24px 48px rgba(0,0,0,0.7)',
                overflow: 'hidden'
            }}>
                {/* Header Banner */}
                <div style={{
                    padding: '24px 28px',
                    backgroundColor: '#0a0c10',
                    borderBottom: '1px solid #232833',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                                <span style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    letterSpacing: '1px',
                                    padding: '3px 10px',
                                    borderRadius: '12px',
                                    backgroundColor: 'rgba(99, 102, 241, 0.15)',
                                    color: '#818cf8',
                                    textTransform: 'uppercase'
                                }}>
                                    {currentStage.replace('_', ' ')}
                                </span>
                                {project.client && (
                                    <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                                        👤 {project.client.name}
                                    </span>
                                )}
                            </div>

                            <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' }}>
                                {project.title}
                            </h1>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <button
                                onClick={copyPortalLink}
                                style={{
                                    padding: '8px 14px',
                                    backgroundColor: '#1e2430',
                                    border: '1px solid #2e3648',
                                    borderRadius: '6px',
                                    color: '#e2e8f0',
                                    fontSize: '0.82rem',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                            >
                                🔗 Share Client Portal
                            </button>

                            {/* Stage Switcher Dropdown */}
                            <select
                                value={currentStage}
                                disabled={updatingStage}
                                onChange={(e) => handleStageChange(e.target.value)}
                                style={{
                                    padding: '8px 12px',
                                    backgroundColor: '#6366f1',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontSize: '0.82rem',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                {STAGES.map(s => (
                                    <option key={s} value={s} style={{ backgroundColor: '#13161c', color: '#fff' }}>
                                        Stage: {s.replace('_', ' ')}
                                    </option>
                                ))}
                            </select>

                            <button
                                onClick={onClose}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#94a3b8',
                                    fontSize: '1.4rem',
                                    cursor: 'pointer',
                                    padding: '4px 8px',
                                    marginLeft: '4px'
                                }}
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    {/* Sub-Navigation Tabs */}
                    <div style={{
                        display: 'flex',
                        gap: '4px',
                        borderBottom: '1px solid #232833',
                        paddingBottom: '0',
                        overflowX: 'auto'
                    }}>
                        {[
                            { id: 'overview', label: '📊 Overview & Stream' },
                            { id: 'quotes', label: `📜 Quotes (${quotes.length})` },
                            { id: 'invoices', label: `💳 Invoices (${invoices.length})` },
                            { id: 'assets', label: `📁 Assets & Links (${attachments.length})` },
                            { id: 'notes', label: `📝 Notes & Log (${notes.length})` },
                            { id: 'client', label: '👤 Client Contact' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    padding: '10px 16px',
                                    backgroundColor: activeTab === tab.id ? '#1e2430' : 'transparent',
                                    border: 'none',
                                    borderBottom: activeTab === tab.id ? '2px solid #6366f1' : '2px solid transparent',
                                    borderRadius: '6px 6px 0 0',
                                    color: activeTab === tab.id ? '#ffffff' : '#94a3b8',
                                    fontSize: '0.85rem',
                                    fontWeight: activeTab === tab.id ? 600 : 500,
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    transition: 'all 0.15s ease'
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content Body */}
                <div style={{ padding: '24px 28px', overflowY: 'auto', flex: 1 }}>
                    {loadingData ? (
                        <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8', fontSize: '0.9rem' }}>
                            Loading project workspace details...
                        </div>
                    ) : tabError ? (
                        <div style={{ color: '#fca5a5', padding: '16px', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                            {tabError}
                        </div>
                    ) : (
                        <>
                            {/* OVERVIEW TAB */}
                            {activeTab === 'overview' && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div style={{ backgroundColor: '#161922', padding: '20px', borderRadius: '10px', border: '1px solid #232833' }}>
                                        <h3 style={{ fontSize: '0.95rem', color: '#e2e8f0', marginTop: 0, marginBottom: '14px' }}>
                                            Project Status Summary
                                        </h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #232833' }}>
                                                <span style={{ color: '#94a3b8' }}>Pipeline Stage:</span>
                                                <strong style={{ color: '#818cf8' }}>{currentStage.replace('_', ' ')}</strong>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #232833' }}>
                                                <span style={{ color: '#94a3b8' }}>Proposals / Quotes:</span>
                                                <strong style={{ color: '#f8fafc' }}>{quotes.length} Published</strong>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #232833' }}>
                                                <span style={{ color: '#94a3b8' }}>Invoices:</span>
                                                <strong style={{ color: '#f8fafc' }}>{invoices.length} Total</strong>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #232833' }}>
                                                <span style={{ color: '#94a3b8' }}>Assets & Deliverables:</span>
                                                <strong style={{ color: '#f8fafc' }}>{attachments.length} Attached</strong>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: '#94a3b8' }}>Team Notes:</span>
                                                <strong style={{ color: '#f8fafc' }}>{notes.length} Entries</strong>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ backgroundColor: '#161922', padding: '20px', borderRadius: '10px', border: '1px solid #232833' }}>
                                        <h3 style={{ fontSize: '0.95rem', color: '#e2e8f0', marginTop: 0, marginBottom: '14px' }}>
                                            Pinned Shoot Notes & Reminders
                                        </h3>
                                        {notes.filter(n => n.isPinned).length === 0 ? (
                                            <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0, fontStyle: 'italic' }}>
                                                No pinned notes. Switch to the Notes tab to pin call summaries or shoot dates.
                                            </p>
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                {notes.filter(n => n.isPinned).map(n => (
                                                    <div key={n.id} style={{ padding: '10px', backgroundColor: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '6px', fontSize: '0.83rem', color: '#f1f5f9' }}>
                                                        <div style={{ fontWeight: 600, color: '#f59e0b', marginBottom: '4px' }}>📌 Pinned Note</div>
                                                        {n.content}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* QUOTES TAB */}
                            {activeTab === 'quotes' && (
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                        <h3 style={{ fontSize: '1rem', color: '#e2e8f0', margin: 0 }}>Proposals & Itemized Quotes</h3>
                                        <button
                                            onClick={() => setShowCreateQuoteModal(true)}
                                            style={{
                                                padding: '8px 14px',
                                                backgroundColor: '#6366f1',
                                                color: '#ffffff',
                                                border: 'none',
                                                borderRadius: '6px',
                                                fontWeight: 500,
                                                fontSize: '0.82rem',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            + Create New Quote
                                        </button>
                                    </div>

                                    {quotes.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '36px', border: '1px dashed #232833', borderRadius: '8px', color: '#64748b', fontSize: '0.85rem' }}>
                                            No proposals created yet. Click "+ Create New Quote" to build itemized production pricing.
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {quotes.map(q => (
                                                <div key={q.id} style={{ backgroundColor: '#161922', border: '1px solid #232833', borderRadius: '8px', padding: '16px' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                                        <div>
                                                            <strong style={{ fontSize: '1rem', color: '#f8fafc' }}>{q.title}</strong>
                                                            {q.validUntil && (
                                                                <span style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                                                                    Valid until: {new Date(q.validUntil).toLocaleDateString()}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div style={{ textAlign: 'right' }}>
                                                            <span style={{
                                                                padding: '3px 8px',
                                                                borderRadius: '4px',
                                                                fontSize: '0.7rem',
                                                                fontWeight: 700,
                                                                backgroundColor: q.status === 'ACCEPTED' ? 'rgba(52, 211, 153, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                                                                color: q.status === 'ACCEPTED' ? '#34d399' : '#818cf8',
                                                                textTransform: 'uppercase'
                                                            }}>
                                                                {q.status}
                                                            </span>
                                                            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#6366f1', marginTop: '4px' }}>
                                                                {formatCurrency(q.totalAmount)}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {q.items && q.items.length > 0 && (
                                                        <div style={{ backgroundColor: '#0d0f14', padding: '10px 12px', borderRadius: '6px', fontSize: '0.8rem', color: '#cbd5e1' }}>
                                                            {q.items.map(item => (
                                                                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                                                                    <span>{item.description} ({item.quantity}x)</span>
                                                                    <span>{formatCurrency(item.amount)}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* INVOICES TAB */}
                            {activeTab === 'invoices' && (
                                <div>
                                    <h3 style={{ fontSize: '1rem', color: '#e2e8f0', marginTop: 0, marginBottom: '16px' }}>
                                        Invoices & Payment Schedules
                                    </h3>

                                    {invoices.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '36px', border: '1px dashed #232833', borderRadius: '8px', color: '#64748b', fontSize: '0.85rem' }}>
                                            No invoices generated yet. Invoices auto-generate when a client accepts a proposal quote on the portal.
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                            {invoices.map(inv => {
                                                const percent = Math.min(100, Math.round((inv.amountPaid / inv.totalAmount) * 100) || 0);

                                                return (
                                                    <div key={inv.id} style={{ backgroundColor: '#161922', border: '1px solid #232833', borderRadius: '8px', padding: '16px' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                                            <div>
                                                                <strong style={{ fontSize: '1rem', color: '#f8fafc' }}>{inv.invoiceNumber}</strong>
                                                                <span style={{ marginLeft: '10px', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', backgroundColor: inv.status === 'PAID' ? 'rgba(52, 211, 153, 0.15)' : 'rgba(245, 158, 11, 0.15)', color: inv.status === 'PAID' ? '#34d399' : '#f59e0b', fontWeight: 600 }}>
                                                                    {inv.status}
                                                                </span>
                                                            </div>
                                                            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>
                                                                {formatCurrency(inv.totalAmount)}
                                                            </div>
                                                        </div>

                                                        {/* Progress bar */}
                                                        <div style={{ marginBottom: '12px' }}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>
                                                                <span>Paid: {formatCurrency(inv.amountPaid)}</span>
                                                                <span>{percent}% Paid</span>
                                                            </div>
                                                            <div style={{ width: '100%', height: '6px', backgroundColor: '#0d0f14', borderRadius: '3px', overflow: 'hidden' }}>
                                                                <div style={{ width: `${percent}%`, height: '100%', backgroundColor: '#34d399', transition: 'width 0.3s ease' }} />
                                                            </div>
                                                        </div>

                                                        {inv.status !== 'PAID' && (
                                                            <div>
                                                                {payingInvoiceId === inv.id ? (
                                                                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                                                                        <input
                                                                            type="number"
                                                                            placeholder="Amount ($ USD)"
                                                                            value={paymentAmount}
                                                                            onChange={(e) => setPaymentAmount(e.target.value)}
                                                                            style={{ padding: '6px 10px', backgroundColor: '#0d0f14', border: '1px solid #2d3446', borderRadius: '6px', color: '#fff', fontSize: '0.82rem', flex: 1 }}
                                                                        />
                                                                        <button onClick={() => handleRecordPayment(inv.id)} style={{ padding: '6px 12px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }}>
                                                                            Confirm Payment
                                                                        </button>
                                                                        <button onClick={() => setPayingInvoiceId(null)} style={{ padding: '6px 10px', backgroundColor: 'transparent', color: '#94a3b8', border: 'none', fontSize: '0.8rem', cursor: 'pointer' }}>
                                                                            Cancel
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => setPayingInvoiceId(inv.id)}
                                                                        style={{ padding: '6px 12px', backgroundColor: '#1e2430', border: '1px solid #2e3648', color: '#34d399', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', marginTop: '6px' }}
                                                                    >
                                                                        + Record Payment
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ASSETS TAB */}
                            {activeTab === 'assets' && (
                                <div>
                                    <form onSubmit={handleAddAsset} style={{ backgroundColor: '#161922', padding: '16px', borderRadius: '8px', border: '1px solid #232833', marginBottom: '20px' }}>
                                        <h4 style={{ fontSize: '0.88rem', color: '#e2e8f0', marginTop: 0, marginBottom: '10px' }}>+ Add Deliverable or Asset Link</h4>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                                            <input
                                                type="text"
                                                placeholder="Asset Name (e.g. Vimeo 4K Cut)"
                                                value={newAssetName}
                                                onChange={(e) => setNewAssetName(e.target.value)}
                                                required
                                                style={{ padding: '8px 12px', backgroundColor: '#0d0f14', border: '1px solid #2d3446', borderRadius: '6px', color: '#fff', fontSize: '0.83rem' }}
                                            />
                                            <select
                                                value={newAssetType}
                                                onChange={(e) => setNewAssetType(e.target.value)}
                                                style={{ padding: '8px 12px', backgroundColor: '#0d0f14', border: '1px solid #2d3446', borderRadius: '6px', color: '#fff', fontSize: '0.83rem' }}
                                            >
                                                <option value="DELIVERABLE">Deliverable (Vimeo/Dropbox/Frame.io)</option>
                                                <option value="BRIEF">Shoot Brief / Moodboard</option>
                                                <option value="CONTRACT">Contract PDF</option>
                                                <option value="GENERAL">General File</option>
                                            </select>
                                        </div>
                                        <input
                                            type="url"
                                            placeholder="Asset URL (https://...)"
                                            value={newAssetUrl}
                                            onChange={(e) => setNewAssetUrl(e.target.value)}
                                            required
                                            style={{ width: '100%', padding: '8px 12px', backgroundColor: '#0d0f14', border: '1px solid #2d3446', borderRadius: '6px', color: '#fff', fontSize: '0.83rem', marginBottom: '10px' }}
                                        />
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <input type="checkbox" checked={newAssetVisible} onChange={(e) => setNewAssetVisible(e.target.checked)} style={{ accentColor: '#6366f1' }} />
                                                Visible on Client Portal
                                            </label>
                                            <button type="submit" disabled={submittingAsset} style={{ padding: '6px 14px', backgroundColor: '#6366f1', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer' }}>
                                                {submittingAsset ? 'Saving...' : 'Add Link'}
                                            </button>
                                        </div>
                                    </form>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {attachments.map(item => {
                                            const badge = getAssetTypeBadge(item.type);
                                            return (
                                                <div key={item.id} style={{ padding: '12px 16px', backgroundColor: '#161922', border: '1px solid #232833', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600, backgroundColor: badge.bg, color: badge.text, textTransform: 'uppercase' }}>
                                                            {badge.label}
                                                        </span>
                                                        <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ color: '#f1f5f9', fontWeight: 500, textDecoration: 'none', fontSize: '0.88rem' }}>
                                                            {item.name} ↗
                                                        </a>
                                                    </div>
                                                    <button onClick={() => handleDeleteAsset(item.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem' }}>
                                                        🗑
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* NOTES TAB */}
                            {activeTab === 'notes' && (
                                <div>
                                    <form onSubmit={handleAddNote} style={{ backgroundColor: '#161922', padding: '16px', borderRadius: '8px', border: '1px solid #232833', marginBottom: '20px' }}>
                                        <h4 style={{ fontSize: '0.88rem', color: '#e2e8f0', marginTop: 0, marginBottom: '10px' }}>+ Add Team Note / Log Entry</h4>
                                        <textarea
                                            rows={3}
                                            placeholder="Write internal studio notes, call summaries, or equipment lists..."
                                            value={newNoteContent}
                                            onChange={(e) => setNewNoteContent(e.target.value)}
                                            required
                                            style={{ width: '100%', padding: '8px 12px', backgroundColor: '#0d0f14', border: '1px solid #2d3446', borderRadius: '6px', color: '#fff', fontSize: '0.83rem', fontFamily: 'inherit', marginBottom: '10px', resize: 'vertical' }}
                                        />
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <input type="checkbox" checked={newNotePinned} onChange={(e) => setNewNotePinned(e.target.checked)} style={{ accentColor: '#f59e0b' }} />
                                                📌 Pin note to top
                                            </label>
                                            <button type="submit" disabled={submittingNote} style={{ padding: '6px 14px', backgroundColor: '#6366f1', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer' }}>
                                                {submittingNote ? 'Saving...' : 'Add Note'}
                                            </button>
                                        </div>
                                    </form>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {notes.map(n => (
                                            <div key={n.id} style={{ padding: '12px 16px', backgroundColor: n.isPinned ? 'rgba(245, 158, 11, 0.05)' : '#161922', border: n.isPinned ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid #232833', borderRadius: '8px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                                    <span style={{ fontSize: '0.78rem', color: '#818cf8', fontWeight: 600 }}>
                                                        👤 {n.authorName || 'Team Member'} • {new Date(n.createdAt).toLocaleDateString()}
                                                    </span>
                                                    <div style={{ display: 'flex', gap: '6px' }}>
                                                        <button onClick={() => handleTogglePin(n.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: n.isPinned ? 1 : 0.4 }}>📌</button>
                                                        <button onClick={() => handleDeleteNote(n.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>🗑</button>
                                                    </div>
                                                </div>
                                                <div style={{ fontSize: '0.85rem', color: '#f1f5f9', whiteSpace: 'pre-wrap' }}>
                                                    {n.content}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* CLIENT TAB */}
                            {activeTab === 'client' && (
                                <div style={{ backgroundColor: '#161922', padding: '24px', borderRadius: '10px', border: '1px solid #232833' }}>
                                    <h3 style={{ fontSize: '1.05rem', color: '#f8fafc', marginTop: 0, marginBottom: '16px' }}>Client Contact Details</h3>
                                    {project.client ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
                                            <div>
                                                <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Name</span>
                                                <strong style={{ color: '#f8fafc', fontSize: '1.1rem' }}>{project.client.name}</strong>
                                            </div>
                                            <div>
                                                <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</span>
                                                <span style={{ color: '#818cf8' }}>{project.client.email || 'No email specified'}</span>
                                            </div>
                                            <div>
                                                <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phone Number</span>
                                                <span style={{ color: '#e2e8f0' }}>{project.client.phone || 'No phone specified'}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <p style={{ color: '#64748b', margin: 0 }}>No client associated with this project yet.</p>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {showCreateQuoteModal && (
                <CreateQuoteModal
                    project={project}
                    onClose={() => setShowCreateQuoteModal(false)}
                    onQuoteCreated={() => {
                        setShowCreateQuoteModal(false);
                        loadAllProjectData();
                    }}
                />
            )}
        </div>
    );
}
        </div >
    );
}
