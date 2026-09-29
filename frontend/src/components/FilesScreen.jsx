import React, { useState } from 'react';
import {
    FileText,
    ChevronDown,
    MoreVertical,
    Plus,
    X,
    Check,
    Download,
    Eye,
    Trash2,
    Send,
} from 'lucide-react';

const INITIAL_FILES = [
    {
        id: 'file-1',
        name: 'Sample Invoice',
        lastEdited: '-',
        sentDate: 'Sep 15, 2026',
        status: 'SENT',
        project: 'Test project',
        client: 'Test contact',
        actions: 'Invoice, Pay',
        type: 'Invoice',
    },
];

export default function FilesScreen({
    onOpenCreateProject,
    onNavigateToPipeline,
    onSelectProject,
}) {
    const [files, setFiles] = useState(INITIAL_FILES);
    const [fileTypeFilter, setFileTypeFilter] = useState('All Files');
    const [statusFilter, setStatusFilter] = useState('All statuses');
    const [dateFilter, setDateFilter] = useState('This month');

    // Dropdown toggles
    const [showTypeMenu, setShowTypeMenu] = useState(false);
    const [showStatusMenu, setShowStatusMenu] = useState(false);
    const [showDateMenu, setShowDateMenu] = useState(false);
    const [activeRowMenuId, setActiveRowMenuId] = useState(null);

    // Create file modal state
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newFileName, setNewFileName] = useState('');
    const [newFileType, setNewFileType] = useState('Invoice');
    const [newFileProject, setNewFileProject] = useState('Test project');
    const [newFileClient, setNewFileClient] = useState('Test contact');

    // Toast notice
    const [toastMessage, setToastMessage] = useState(null);
    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage((curr) => (curr === msg ? null : curr)), 3000);
    };

    // Filter logic
    const filteredFiles = files.filter((f) => {
        if (fileTypeFilter !== 'All Files' && f.type !== fileTypeFilter && f.name !== fileTypeFilter) return false;
        if (statusFilter !== 'All statuses' && f.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
        return true;
    });

    const handleCreateFile = (e) => {
        e.preventDefault();
        if (!newFileName.trim()) return;

        const newFile = {
            id: `file-${Date.now()}`,
            name: newFileName.trim(),
            lastEdited: 'Just now',
            sentDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            status: 'DRAFT',
            project: newFileProject.trim() || 'Untitled project',
            client: newFileClient.trim() || 'New client',
            actions: newFileType,
            type: newFileType,
        };

        setFiles([newFile, ...files]);
        setNewFileName('');
        setShowCreateModal(false);
        showToast(`Created file "${newFile.name}"!`);
    };

    const handleDeleteFile = (id) => {
        setFiles((prev) => prev.filter((f) => f.id !== id));
        setActiveRowMenuId(null);
        showToast('File deleted');
    };

    return (
        <div style={{
            flex: 1,
            width: '100%',
            overflowY: 'auto',
            background: '#ffffff',
            padding: '2rem 3rem 4rem 3rem',
            boxSizing: 'border-box',
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
            position: 'relative',
        }}>
            <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
                
                {/* Header Title & Create Button */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '0.4rem',
                }}>
                    <div>
                        <h1 style={{
                            fontSize: '1.85rem',
                            fontWeight: '800',
                            color: '#111827',
                            margin: '0 0 0.5rem 0',
                            letterSpacing: '-0.02em',
                        }}>
                            Files
                        </h1>
                        <p style={{
                            fontSize: '0.84rem',
                            color: '#4b5563',
                            margin: 0,
                        }}>
                            Create, manage and sort your files by type, status and date.{' '}
                            <span
                                onClick={() => showToast('Opening Files documentation')}
                                style={{ color: '#111827', textDecoration: 'underline', cursor: 'pointer' }}
                            >
                                Learn more
                            </span>
                        </p>
                    </div>

                    {/* Create File Button */}
                    <button
                        onClick={() => setShowCreateModal(true)}
                        style={{
                            background: '#111827',
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
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                        }}
                    >
                        Create file
                    </button>
                </div>

                {/* Filter Controls Bar */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginTop: '1.5rem',
                    flexWrap: 'wrap',
                }}>
                    {/* 1. All Files Dropdown */}
                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={() => {
                                setShowTypeMenu(!showTypeMenu);
                                setShowStatusMenu(false);
                                setShowDateMenu(false);
                            }}
                            style={{
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                background: '#ffffff',
                                padding: '6px 12px',
                                fontSize: '0.82rem',
                                fontWeight: '500',
                                color: '#1f2937',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                cursor: 'pointer',
                            }}
                        >
                            <FileText size={14} color="#4b5563" />
                            <span>{fileTypeFilter}</span>
                            <ChevronDown size={14} color="#6b7280" />
                        </button>

                        {showTypeMenu && (
                            <div style={{
                                position: 'absolute',
                                top: '36px',
                                left: 0,
                                width: '160px',
                                background: '#ffffff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                                zIndex: 50,
                                padding: '4px 0',
                            }}>
                                {['All Files', 'Invoice', 'Contract', 'Proposal', 'Questionnaire'].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => {
                                            setFileTypeFilter(type);
                                            setShowTypeMenu(false);
                                        }}
                                        style={{
                                            width: '100%',
                                            textAlign: 'left',
                                            padding: '6px 12px',
                                            fontSize: '0.8rem',
                                            border: 'none',
                                            background: fileTypeFilter === type ? '#f3f4f6' : 'transparent',
                                            color: fileTypeFilter === type ? '#2563eb' : '#374151',
                                            fontWeight: fileTypeFilter === type ? '600' : '400',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 2. All statuses Dropdown */}
                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={() => {
                                setShowStatusMenu(!showStatusMenu);
                                setShowTypeMenu(false);
                                setShowDateMenu(false);
                            }}
                            style={{
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                background: '#ffffff',
                                padding: '6px 12px',
                                fontSize: '0.82rem',
                                fontWeight: '500',
                                color: '#1f2937',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                cursor: 'pointer',
                            }}
                        >
                            <span>{statusFilter}</span>
                            <ChevronDown size={14} color="#6b7280" />
                        </button>

                        {showStatusMenu && (
                            <div style={{
                                position: 'absolute',
                                top: '36px',
                                left: 0,
                                width: '150px',
                                background: '#ffffff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                                zIndex: 50,
                                padding: '4px 0',
                            }}>
                                {['All statuses', 'Draft', 'Sent', 'Paid', 'Completed'].map((st) => (
                                    <button
                                        key={st}
                                        onClick={() => {
                                            setStatusFilter(st);
                                            setShowStatusMenu(false);
                                        }}
                                        style={{
                                            width: '100%',
                                            textAlign: 'left',
                                            padding: '6px 12px',
                                            fontSize: '0.8rem',
                                            border: 'none',
                                            background: statusFilter === st ? '#f3f4f6' : 'transparent',
                                            color: statusFilter === st ? '#2563eb' : '#374151',
                                            fontWeight: statusFilter === st ? '600' : '400',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {st}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 3. This month Dropdown */}
                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={() => {
                                setShowDateMenu(!showDateMenu);
                                setShowTypeMenu(false);
                                setShowStatusMenu(false);
                            }}
                            style={{
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                background: '#ffffff',
                                padding: '6px 12px',
                                fontSize: '0.82rem',
                                fontWeight: '500',
                                color: '#1f2937',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                cursor: 'pointer',
                            }}
                        >
                            <span>{dateFilter}</span>
                            <ChevronDown size={14} color="#6b7280" />
                        </button>

                        {showDateMenu && (
                            <div style={{
                                position: 'absolute',
                                top: '36px',
                                left: 0,
                                width: '150px',
                                background: '#ffffff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                                zIndex: 50,
                                padding: '4px 0',
                            }}>
                                {['This month', 'Last 30 days', 'This year', 'All time'].map((d) => (
                                    <button
                                        key={d}
                                        onClick={() => {
                                            setDateFilter(d);
                                            setShowDateMenu(false);
                                        }}
                                        style={{
                                            width: '100%',
                                            textAlign: 'left',
                                            padding: '6px 12px',
                                            fontSize: '0.8rem',
                                            border: 'none',
                                            background: dateFilter === d ? '#f3f4f6' : 'transparent',
                                            color: dateFilter === d ? '#2563eb' : '#374151',
                                            fontWeight: dateFilter === d ? '600' : '400',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* File Count */}
                <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '1.25rem', marginBottom: '0.65rem' }}>
                    {filteredFiles.length} file{filteredFiles.length === 1 ? '' : 's'}
                </div>

                {/* Files Table */}
                <div style={{ width: '100%', overflowX: 'auto' }}>
                    {/* Header Columns */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(160px, 1.8fr) minmax(90px, 1fr) minmax(100px, 1fr) minmax(80px, 0.8fr) minmax(130px, 1.3fr) minmax(120px, 1.2fr) minmax(110px, 1.1fr) 40px',
                        padding: '0.6rem 1rem',
                        fontSize: '0.72rem',
                        fontWeight: '600',
                        color: '#6b7280',
                        letterSpacing: '0.04em',
                        borderBottom: '1px solid #f1f3f5',
                    }}>
                        <div>FILE NAME</div>
                        <div>LAST EDITED</div>
                        <div>SENT DATE</div>
                        <div>STATUS</div>
                        <div>PROJECT</div>
                        <div>CLIENTS</div>
                        <div>ACTIONS</div>
                        <div />
                    </div>

                    {/* Table Body / Rows */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                        {filteredFiles.map((file) => (
                            <div
                                key={file.id}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'minmax(160px, 1.8fr) minmax(90px, 1fr) minmax(100px, 1fr) minmax(80px, 0.8fr) minmax(130px, 1.3fr) minmax(120px, 1.2fr) minmax(110px, 1.1fr) 40px',
                                    alignItems: 'center',
                                    padding: '0.85rem 1rem',
                                    background: '#ffffff',
                                    borderRadius: '8px',
                                    border: '1px solid #f0f1f3',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                                    transition: 'all 0.15s ease',
                                    position: 'relative',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = '#d1d5db';
                                    e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.04)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = '#f0f1f3';
                                    e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.02)';
                                }}
                            >
                                {/* File Name */}
                                <div
                                    onClick={() => showToast(`Opening file: ${file.name}`)}
                                    style={{
                                        fontSize: '0.85rem',
                                        fontWeight: '600',
                                        color: '#111827',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {file.name}
                                </div>

                                {/* Last Edited */}
                                <div style={{ fontSize: '0.82rem', color: '#6b7280' }}>
                                    {file.lastEdited}
                                </div>

                                {/* Sent Date */}
                                <div style={{ fontSize: '0.82rem', color: '#374151' }}>
                                    {file.sentDate}
                                </div>

                                {/* Status */}
                                <div>
                                    <span style={{
                                        display: 'inline-block',
                                        background: file.status === 'SENT' ? '#eff6ff' : file.status === 'PAID' ? '#ecfdf5' : '#f3f4f6',
                                        color: file.status === 'SENT' ? '#3b82f6' : file.status === 'PAID' ? '#10b981' : '#6b7280',
                                        padding: '2px 8px',
                                        borderRadius: '9999px',
                                        fontSize: '0.68rem',
                                        fontWeight: '700',
                                        letterSpacing: '0.04em',
                                    }}>
                                        {file.status}
                                    </span>
                                </div>

                                {/* Project */}
                                <div
                                    onClick={onNavigateToPipeline}
                                    style={{
                                        fontSize: '0.84rem',
                                        color: '#111827',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {file.project}
                                </div>

                                {/* Clients */}
                                <div style={{ fontSize: '0.84rem', color: '#4b5563' }}>
                                    {file.client}
                                </div>

                                {/* Actions */}
                                <div style={{ fontSize: '0.82rem', color: '#4b5563' }}>
                                    {file.actions}
                                </div>

                                {/* Three Dots Options */}
                                <div style={{ position: 'relative', textAlign: 'right' }}>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveRowMenuId(activeRowMenuId === file.id ? null : file.id);
                                        }}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            cursor: 'pointer',
                                            padding: '4px',
                                            color: '#6b7280',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <MoreVertical size={16} />
                                    </button>

                                    {activeRowMenuId === file.id && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '26px',
                                            right: 0,
                                            width: '140px',
                                            background: '#ffffff',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                                            zIndex: 50,
                                            padding: '4px 0',
                                            textAlign: 'left',
                                        }}>
                                            <button
                                                onClick={() => {
                                                    showToast(`Viewing ${file.name}`);
                                                    setActiveRowMenuId(null);
                                                }}
                                                style={{ width: '100%', padding: '6px 12px', background: 'transparent', border: 'none', fontSize: '0.8rem', color: '#111827', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                                            >
                                                <Eye size={13} /> View
                                            </button>
                                            <button
                                                onClick={() => {
                                                    showToast(`Downloading ${file.name}`);
                                                    setActiveRowMenuId(null);
                                                }}
                                                style={{ width: '100%', padding: '6px 12px', background: 'transparent', border: 'none', fontSize: '0.8rem', color: '#111827', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                                            >
                                                <Download size={13} /> Download
                                            </button>
                                            <button
                                                onClick={() => {
                                                    showToast(`Resent ${file.name}`);
                                                    setActiveRowMenuId(null);
                                                }}
                                                style={{ width: '100%', padding: '6px 12px', background: 'transparent', border: 'none', fontSize: '0.8rem', color: '#111827', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                                            >
                                                <Send size={13} /> Resend
                                            </button>
                                            <button
                                                onClick={() => handleDeleteFile(file.id)}
                                                style={{ width: '100%', padding: '6px 12px', background: 'transparent', border: 'none', fontSize: '0.8rem', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                                            >
                                                <Trash2 size={13} /> Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Create File Modal */}
            {showCreateModal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
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
                        maxWidth: '460px',
                        width: '100%',
                        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)',
                        overflow: 'hidden',
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '1rem 1.5rem',
                            borderBottom: '1px solid #e5e7eb',
                        }}>
                            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: '#111827' }}>
                                Create new file
                            </h3>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280' }}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateFile} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
                                    File Name
                                </label>
                                <input
                                    placeholder="e.g. Wedding Photography Agreement"
                                    value={newFileName}
                                    onChange={(e) => setNewFileName(e.target.value)}
                                    autoFocus
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        borderRadius: '6px',
                                        border: '1px solid #d1d5db',
                                        fontSize: '0.85rem',
                                        boxSizing: 'border-box',
                                        outline: 'none',
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
                                    File Type
                                </label>
                                <select
                                    value={newFileType}
                                    onChange={(e) => setNewFileType(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        borderRadius: '6px',
                                        border: '1px solid #d1d5db',
                                        fontSize: '0.85rem',
                                        boxSizing: 'border-box',
                                        outline: 'none',
                                        background: '#ffffff',
                                    }}
                                >
                                    <option value="Invoice">Invoice</option>
                                    <option value="Contract">Contract</option>
                                    <option value="Proposal">Proposal</option>
                                    <option value="Questionnaire">Questionnaire</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
                                    Associated Project
                                </label>
                                <input
                                    placeholder="Project name"
                                    value={newFileProject}
                                    onChange={(e) => setNewFileProject(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        borderRadius: '6px',
                                        border: '1px solid #d1d5db',
                                        fontSize: '0.85rem',
                                        boxSizing: 'border-box',
                                        outline: 'none',
                                    }}
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '0.5rem' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    style={{
                                        background: '#f3f4f6',
                                        border: 'none',
                                        borderRadius: '6px',
                                        padding: '8px 16px',
                                        fontSize: '0.82rem',
                                        fontWeight: '600',
                                        color: '#374151',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{
                                        background: '#111827',
                                        color: '#ffffff',
                                        border: 'none',
                                        borderRadius: '6px',
                                        padding: '8px 16px',
                                        fontSize: '0.82rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Create file
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toastMessage && (
                <div style={{
                    position: 'fixed',
                    bottom: '72px',
                    right: '24px',
                    background: '#111827',
                    color: '#ffffff',
                    padding: '9px 16px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: '500',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                }}>
                    <Check size={14} color="#10b981" />
                    <span>{toastMessage}</span>
                </div>
            )}
        </div>
    );
}
