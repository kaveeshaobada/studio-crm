import React, { useState } from 'react';
import brandAvatarImg from '../assets/brand_avatar.jpg';
import {
    SquarePen,
    Search,
    SlidersHorizontal,
    ArrowUpDown,
    ChevronRight,
    ChevronDown,
    X,
    Send,
    Check,
    PhoneCall,
    MessageSquare,
    Mail,
    Plus,
    Highlighter,
    AlignLeft,
    List,
    ListOrdered,
    Indent,
    Minus,
    Undo,
    Smile,
    Paperclip,
    Link2,
    Sparkles,
    Mic,
} from 'lucide-react';

export default function InboxScreen({ onOpenClientDirectory }) {
    // Current active filter tab: 'all' | 'unread' | 'sent' | 'drafts'
    const [activeTab, setActiveTab] = useState('all');

    // Conversations state (empty by default matching screenshot, with ability to compose)
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);

    // Search query in threads list
    const [searchFilter, setSearchFilter] = useState('');
    const [showSearchInput, setShowSearchInput] = useState(false);

    // Compose Modal state
    const [showComposeModal, setShowComposeModal] = useState(false);
    const [composeRecipient, setComposeRecipient] = useState('');
    const [composeSubject, setComposeSubject] = useState('');
    const [composeBody, setComposeBody] = useState('');

    // Business SMS modal state
    const [showSmsModal, setShowSmsModal] = useState(false);

    // Toast notification
    const [toastMessage, setToastMessage] = useState(null);
    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage((curr) => (curr === msg ? null : curr)), 3000);
    };

    // Formatting & Send Dropdown states
    const [showSendDropdown, setShowSendDropdown] = useState(false);
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isHighlit, setIsHighlit] = useState(false);

    const handleSendMessage = (e) => {
        if (e && e.preventDefault) e.preventDefault();

        const recipientName = composeRecipient.trim() || 'New Inquiry';
        const bodyText = composeBody.trim() || 'Hello, reaching out regarding our project.';

        const newConv = {
            id: `conv-${Date.now()}`,
            recipient: recipientName,
            subject: composeSubject.trim() || 'No Subject',
            snippet: bodyText,
            date: 'Just now',
            unread: false,
            type: 'sent',
            messages: [
                {
                    id: `msg-${Date.now()}`,
                    sender: 'You',
                    text: bodyText,
                    time: 'Just now',
                    isUser: true,
                },
            ],
        };

        setConversations([newConv, ...conversations]);
        setSelectedConversation(newConv);
        setShowComposeModal(false);
        setComposeRecipient('');
        setComposeSubject('');
        setComposeBody('');
        showToast('Message sent successfully!');
    };

    const handleSaveDraft = () => {
        const draftConv = {
            id: `draft-${Date.now()}`,
            recipient: composeRecipient.trim() || 'Untitled Draft',
            subject: composeSubject.trim() || '(No Subject)',
            snippet: composeBody.trim() || 'Draft message',
            date: 'Just now',
            unread: false,
            type: 'draft',
            messages: [
                {
                    id: `msg-${Date.now()}`,
                    sender: 'You',
                    text: composeBody.trim(),
                    time: 'Just now',
                    isUser: true,
                },
            ],
        };

        setConversations([draftConv, ...conversations]);
        setShowComposeModal(false);
        setComposeRecipient('');
        setComposeSubject('');
        setComposeBody('');
        showToast('Saved to drafts');
    };

    const filteredConversations = conversations.filter((c) => {
        if (activeTab === 'unread' && !c.unread) return false;
        if (activeTab === 'sent' && c.type !== 'sent') return false;
        if (activeTab === 'drafts' && c.type !== 'draft') return false;
        if (searchFilter.trim()) {
            const q = searchFilter.toLowerCase();
            return (
                c.recipient.toLowerCase().includes(q) ||
                c.subject.toLowerCase().includes(q) ||
                c.snippet.toLowerCase().includes(q)
            );
        }
        return true;
    });

    const emptyStateContent = {
        all: {
            title: "You're all caught up.",
            subtitle: "Every conversation you've sent or received will show up here.",
            maxWidth: '220px',
        },
        unread: {
            title: "Nothing unread. Nice.",
            subtitle: "New messages will show up here as they come in.",
            maxWidth: '220px',
        },
        sent: {
            title: "You haven't sent anything yet.",
            subtitle: "Replies and new messages you send will show up here.",
            maxWidth: '230px',
        },
        drafts: {
            title: "No drafts on this device.",
            subtitle: "Messages you start but don't send are saved here for 14 days. Drafts stay on the browser you wrote them in.",
            maxWidth: '260px',
        },
    };

    const currentEmptyState = emptyStateContent[activeTab] || emptyStateContent.all;

    return (
        <div style={{
            flex: 1,
            width: '100%',
            height: '100%',
            display: 'flex',
            background: '#ffffff',
            boxSizing: 'border-box',
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
            overflow: 'hidden',
        }}>
            {/* LEFT PANE: THREADS LIST */}
            <div style={{
                width: '340px',
                minWidth: '320px',
                borderRight: '1px solid #e5e7eb',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                background: '#ffffff',
                flexShrink: 0,
            }}>
                {/* Header: Inbox + Compose Button */}
                <div style={{
                    padding: '1.25rem 1.25rem 0.85rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <h2 style={{
                        margin: 0,
                        fontSize: '1.45rem',
                        fontWeight: '800',
                        color: '#111827',
                        letterSpacing: '-0.02em',
                    }}>
                        Inbox
                    </h2>

                    <button
                        onClick={() => setShowComposeModal(true)}
                        style={{
                            background: '#ffffff',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            color: '#1f2937',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                            transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#9ca3af';
                            e.currentTarget.style.background = '#f9fafb';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#d1d5db';
                            e.currentTarget.style.background = '#ffffff';
                        }}
                    >
                        <SquarePen size={14} color="#1f2937" />
                        <span>Compose</span>
                    </button>
                </div>

                {/* Segmented Control Tabs: All, Unread, Sent, Drafts */}
                <div style={{ padding: '0 1.25rem', marginBottom: '0.75rem' }}>
                    <div style={{
                        display: 'flex',
                        background: '#f3f4f6',
                        borderRadius: '8px',
                        padding: '3px',
                    }}>
                        {[
                            { id: 'all', label: 'All' },
                            { id: 'unread', label: 'Unread' },
                            { id: 'sent', label: 'Sent' },
                            { id: 'drafts', label: 'Drafts' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    flex: 1,
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '5px 0',
                                    fontSize: '0.76rem',
                                    fontWeight: activeTab === tab.id ? '600' : '500',
                                    background: activeTab === tab.id ? '#ffffff' : 'transparent',
                                    color: activeTab === tab.id ? '#111827' : '#6b7280',
                                    boxShadow: activeTab === tab.id ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search Bar / Filter Controls Row */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.4rem 1.25rem',
                    borderBottom: '1px solid #f1f3f5',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                            onClick={() => setShowSearchInput(!showSearchInput)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: showSearchInput ? '#2563eb' : '#6b7280',
                                cursor: 'pointer',
                                padding: '3px',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                            title="Search conversations"
                        >
                            <Search size={14} />
                        </button>
                        <button
                            onClick={() => showToast('Filtered by recent activity')}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#6b7280',
                                cursor: 'pointer',
                                padding: '3px',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                            title="Filter"
                        >
                            <SlidersHorizontal size={14} />
                        </button>
                    </div>

                    <div>
                        <button
                            onClick={() => showToast('Conversations refreshed')}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#9ca3af',
                                cursor: 'pointer',
                                padding: '3px',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                            title="Sort order"
                        >
                            <ArrowUpDown size={13} />
                        </button>
                    </div>
                </div>

                {/* Optional Search Input Slide */}
                {showSearchInput && (
                    <div style={{ padding: '0.5rem 1.25rem', borderBottom: '1px solid #f1f3f5' }}>
                        <input
                            placeholder="Search inbox..."
                            value={searchFilter}
                            onChange={(e) => setSearchFilter(e.target.value)}
                            autoFocus
                            style={{
                                width: '100%',
                                padding: '6px 10px',
                                fontSize: '0.8rem',
                                border: '1px solid #cbd5e1',
                                borderRadius: '6px',
                                outline: 'none',
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>
                )}

                {/* Conversation Items or Empty State */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    {filteredConversations.length === 0 ? (
                        /* Empty State matching active tab specification */
                        <div style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '2rem 1.5rem',
                            textAlign: 'center',
                        }}>
                            <div style={{
                                fontSize: '0.88rem',
                                fontWeight: '600',
                                color: '#1f2937',
                                marginBottom: '4px',
                            }}>
                                {currentEmptyState.title}
                            </div>
                            <div style={{
                                fontSize: '0.78rem',
                                color: '#6b7280',
                                lineHeight: '1.45',
                                maxWidth: currentEmptyState.maxWidth,
                            }}>
                                {currentEmptyState.subtitle}
                            </div>
                        </div>
                    ) : (
                        /* List of Conversations */
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {filteredConversations.map((conv) => {
                                const isSelected = selectedConversation?.id === conv.id;
                                return (
                                    <div
                                        key={conv.id}
                                        onClick={() => setSelectedConversation(conv)}
                                        style={{
                                            padding: '0.85rem 1.25rem',
                                            borderBottom: '1px solid #f1f3f5',
                                            cursor: 'pointer',
                                            background: isSelected ? '#f8fafc' : '#ffffff',
                                            transition: 'background 0.15s ease',
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isSelected) e.currentTarget.style.background = '#fafbfc';
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isSelected) e.currentTarget.style.background = '#ffffff';
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                                            <span style={{ fontSize: '0.84rem', fontWeight: '600', color: '#111827' }}>
                                                {conv.recipient}
                                            </span>
                                            <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>
                                                {conv.date}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '0.8rem', fontWeight: '500', color: '#374151', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {conv.subject}
                                        </div>
                                        <div style={{ fontSize: '0.76rem', color: '#6b7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>
                                            {conv.snippet}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT PANE: ACTIVE CONVERSATION OR PROMO HERO */}
            <div style={{
                flex: 1,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                background: '#fafbfc',
                overflowY: 'auto',
                position: 'relative',
            }}>
                {selectedConversation ? (
                    /* Conversation Thread View */
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#ffffff' }}>
                        {/* Header */}
                        <div style={{
                            padding: '1.25rem 2rem',
                            borderBottom: '1px solid #e5e7eb',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <div>
                                <h3 style={{ margin: '0 0 2px 0', fontSize: '1.1rem', fontWeight: '700', color: '#111827' }}>
                                    {selectedConversation.subject}
                                </h3>
                                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                                    With {selectedConversation.recipient}
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedConversation(null)}
                                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280' }}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Messages Body */}
                        <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {selectedConversation.messages.map((m) => (
                                <div
                                    key={m.id}
                                    style={{
                                        alignSelf: m.isUser ? 'flex-end' : 'flex-start',
                                        maxWidth: '70%',
                                        background: m.isUser ? '#2563eb' : '#f3f4f6',
                                        color: m.isUser ? '#ffffff' : '#1f2937',
                                        borderRadius: '12px',
                                        padding: '0.75rem 1.15rem',
                                        fontSize: '0.84rem',
                                        lineHeight: '1.45',
                                    }}
                                >
                                    <div>{m.text}</div>
                                    <div style={{ fontSize: '0.68rem', textAlign: 'right', marginTop: '4px', opacity: 0.8 }}>
                                        {m.time}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Quick Reply Bar */}
                        <div style={{ padding: '1rem 2rem', borderTop: '1px solid #e5e7eb', background: '#ffffff', display: 'flex', gap: '10px' }}>
                            <input
                                placeholder="Type a reply..."
                                style={{ flex: 1, padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.82rem', outline: 'none' }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && e.target.value.trim()) {
                                        const newMsg = {
                                            id: `msg-${Date.now()}`,
                                            sender: 'You',
                                            text: e.target.value.trim(),
                                            time: 'Just now',
                                            isUser: true,
                                        };
                                        setSelectedConversation({
                                            ...selectedConversation,
                                            messages: [...selectedConversation.messages, newMsg],
                                        });
                                        e.target.value = '';
                                    }
                                }}
                            />
                            <button
                                style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', padding: '0 16px', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer' }}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Default Center Empty Hero matching screenshot */
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '3rem 2rem',
                        textAlign: 'center',
                    }}>
                        {/* Custom Graphic: Speech bubble + Envelope with star sparkles */}
                        <div style={{
                            position: 'relative',
                            width: '130px',
                            height: '100px',
                            marginBottom: '1.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            {/* Star / Sparkle */}
                            <div style={{
                                position: 'absolute',
                                top: '0px',
                                left: '16px',
                                color: '#facc15',
                                fontSize: '1.25rem',
                                fontWeight: 'bold',
                            }}>
                                ✦
                            </div>

                            {/* Purple Chat Bubble */}
                            <div style={{
                                position: 'absolute',
                                top: '8px',
                                right: '12px',
                                width: '74px',
                                height: '44px',
                                background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)',
                                borderRadius: '14px 14px 4px 14px',
                                boxShadow: '0 4px 12px rgba(124, 58, 237, 0.25)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <div style={{ width: '40px', height: '4px', background: 'rgba(255, 255, 255, 0.3)', borderRadius: '2px' }} />
                            </div>

                            {/* Soft Blue Envelope */}
                            <div style={{
                                position: 'absolute',
                                bottom: '6px',
                                left: '12px',
                                width: '64px',
                                height: '44px',
                                background: '#cbd5e1',
                                borderRadius: '6px',
                                overflow: 'hidden',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
                                border: '1px solid #94a3b8',
                            }}>
                                {/* Envelope Flap */}
                                <svg width="64" height="44" viewBox="0 0 64 44" fill="none">
                                    <path d="M0 0L32 24L64 0V44H0V0Z" fill="#e2e8f0" />
                                    <path d="M0 0L32 24L64 0" stroke="#94a3b8" strokeWidth="1.5" />
                                    <path d="M0 44L26 20" stroke="#94a3b8" strokeWidth="1" />
                                    <path d="M64 44L38 20" stroke="#94a3b8" strokeWidth="1" />
                                    <path d="M0 0H64V44H0V0Z" stroke="#94a3b8" strokeWidth="1" />
                                </svg>
                            </div>
                        </div>

                        {/* Title */}
                        <h2 style={{
                            fontSize: '1.25rem',
                            fontWeight: '700',
                            color: '#111827',
                            margin: '0 0 0.55rem 0',
                            letterSpacing: '-0.01em',
                        }}>
                            One inbox for your SMS &amp; emails
                        </h2>

                        {/* Subtitle */}
                        <p style={{
                            fontSize: '0.84rem',
                            color: '#4b5563',
                            lineHeight: '1.55',
                            maxWidth: '430px',
                            margin: '0 0 1.25rem 0',
                        }}>
                            Stop switching between your messaging and email apps. Get a dedicated business &amp; SMS line and reply to leads faster, all from HoneyBook.
                        </p>

                        {/* Action Link */}
                        <button
                            onClick={() => setShowSmsModal(true)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#2563eb',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '4px 8px',
                            }}
                        >
                            <span>Explore Business Phone &amp; SMS</span>
                            <ChevronRight size={15} />
                        </button>
                    </div>
                )}
            </div>

            {/* COMPOSE MODAL MATCHING HONEYBOOK SCREENSHOT */}
            {showComposeModal && (
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
                        borderRadius: '10px',
                        maxWidth: '660px',
                        width: '100%',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.25), 0 10px 10px -5px rgba(0, 0, 0, 0.08)',
                        overflow: 'hidden',
                        border: '1px solid #e5e7eb',
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        {/* 1. Header: Avatar + Send to: + Circle Plus + Recipient Input + Close ✕ */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.65rem 1.25rem',
                            borderBottom: '1px solid #f1f3f5',
                            gap: '10px',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                                {/* User circular avatar */}
                                <img
                                    src={brandAvatarImg}
                                    alt="User"
                                    style={{
                                        width: '26px',
                                        height: '26px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        flexShrink: 0,
                                        border: '1px solid #e5e7eb',
                                    }}
                                />
                                <span style={{
                                    fontSize: '0.86rem',
                                    color: '#4b5563',
                                    fontWeight: '500',
                                    flexShrink: 0,
                                }}>
                                    Send to:
                                </span>

                                {/* Round Plus button */}
                                <button
                                    type="button"
                                    onClick={() => onOpenClientDirectory && onOpenClientDirectory()}
                                    title="Add from client directory"
                                    style={{
                                        width: '22px',
                                        height: '22px',
                                        borderRadius: '50%',
                                        background: '#f3f4f6',
                                        border: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        color: '#374151',
                                        flexShrink: 0,
                                        transition: 'background 0.15s ease',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = '#e5e7eb'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = '#f3f4f6'}
                                >
                                    <Plus size={13} />
                                </button>

                                {/* Recipient Input */}
                                <input
                                    placeholder=""
                                    value={composeRecipient}
                                    onChange={(e) => setComposeRecipient(e.target.value)}
                                    autoFocus
                                    style={{
                                        flex: 1,
                                        border: 'none',
                                        outline: 'none',
                                        fontSize: '0.86rem',
                                        color: '#111827',
                                        background: 'transparent',
                                    }}
                                />
                            </div>

                            {/* Close Button */}
                            <button
                                type="button"
                                onClick={() => setShowComposeModal(false)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#4b5563',
                                    padding: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '4px',
                                    transition: 'color 0.15s ease',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#111827'}
                                onMouseLeave={(e) => e.currentTarget.style.color = '#4b5563'}
                                title="Close"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* 2. Subject Row */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0.65rem 1.25rem',
                            borderBottom: '1px solid #f1f3f5',
                            gap: '8px',
                        }}>
                            <span style={{
                                fontSize: '0.86rem',
                                color: '#4b5563',
                                fontWeight: '500',
                                flexShrink: 0,
                            }}>
                                Subject:
                            </span>
                            <input
                                placeholder=""
                                value={composeSubject}
                                onChange={(e) => setComposeSubject(e.target.value)}
                                style={{
                                    flex: 1,
                                    border: 'none',
                                    outline: 'none',
                                    fontSize: '0.86rem',
                                    color: '#111827',
                                    background: 'transparent',
                                }}
                            />
                        </div>

                        {/* 3. Message Body Area with Signature */}
                        <div style={{
                            padding: '1rem 1.25rem',
                            minHeight: '170px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            flex: 1,
                            background: '#ffffff',
                        }}>
                            <textarea
                                placeholder="Type your message..."
                                value={composeBody}
                                onChange={(e) => setComposeBody(e.target.value)}
                                rows={5}
                                style={{
                                    width: '100%',
                                    border: 'none',
                                    outline: 'none',
                                    fontSize: '0.86rem',
                                    fontWeight: isBold ? '700' : '400',
                                    fontStyle: isItalic ? 'italic' : 'normal',
                                    textDecoration: isUnderline ? 'underline' : 'none',
                                    background: isHighlit ? '#fef08a' : 'transparent',
                                    color: '#111827',
                                    resize: 'none',
                                    lineHeight: '1.5',
                                    padding: 0,
                                    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
                                }}
                            />

                            {/* Default Email Signature Block */}
                            <div style={{
                                marginTop: '1.25rem',
                                fontSize: '0.8rem',
                                color: '#4b5563',
                                lineHeight: '1.45',
                                userSelect: 'none',
                            }}>
                                <div style={{ fontWeight: '500', color: '#1f2937' }}>Kaveesha Obadakumbura</div>
                                <div style={{ color: '#6b7280' }}>Videography</div>
                                <div style={{ color: '#6b7280' }}>Kaveesha Obadakumbura</div>
                                <div style={{ color: '#6b7280' }}>+94702245610</div>
                            </div>
                        </div>

                        {/* 4. Rich Text Formatting Toolbar */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '0.35rem 1.25rem',
                            borderTop: '1px solid #f1f3f5',
                            background: '#ffffff',
                            flexWrap: 'wrap',
                        }}>
                            {/* Font Family Dropdown */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', cursor: 'pointer', padding: '3px 6px', borderRadius: '4px' }}>
                                <span style={{ fontSize: '0.78rem', color: '#4b5563' }}>Default</span>
                                <ChevronDown size={11} color="#6b7280" />
                            </div>

                            {/* Font Size Dropdown */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', cursor: 'pointer', padding: '3px 6px', borderRadius: '4px', marginRight: '6px' }}>
                                <span style={{ fontSize: '0.78rem', color: '#4b5563' }}>16</span>
                                <ChevronDown size={11} color="#6b7280" />
                            </div>

                            <div style={{ width: '1px', height: '14px', background: '#e5e7eb', margin: '0 2px' }} />

                            {/* Formatting Buttons */}
                            <button
                                type="button"
                                onClick={() => setIsBold(!isBold)}
                                style={{
                                    background: isBold ? '#f3f4f6' : 'transparent',
                                    border: 'none',
                                    borderRadius: '3px',
                                    padding: '3px 5px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontWeight: '700',
                                    fontSize: '0.8rem',
                                    color: isBold ? '#111827' : '#4b5563',
                                }}
                                title="Bold"
                            >
                                B
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsItalic(!isItalic)}
                                style={{
                                    background: isItalic ? '#f3f4f6' : 'transparent',
                                    border: 'none',
                                    borderRadius: '3px',
                                    padding: '3px 5px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontStyle: 'italic',
                                    fontSize: '0.8rem',
                                    fontFamily: 'serif',
                                    color: isItalic ? '#111827' : '#4b5563',
                                }}
                                title="Italic"
                            >
                                I
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsUnderline(!isUnderline)}
                                style={{
                                    background: isUnderline ? '#f3f4f6' : 'transparent',
                                    border: 'none',
                                    borderRadius: '3px',
                                    padding: '3px 5px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    textDecoration: 'underline',
                                    fontSize: '0.8rem',
                                    color: isUnderline ? '#111827' : '#4b5563',
                                }}
                                title="Underline"
                            >
                                U
                            </button>

                            {/* Text Color A with blue bar */}
                            <button
                                type="button"
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    borderRadius: '3px',
                                    padding: '3px 5px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    fontSize: '0.8rem',
                                    fontWeight: '600',
                                    color: '#4b5563',
                                    lineHeight: '1',
                                }}
                                title="Text color"
                            >
                                <span>A</span>
                                <div style={{ width: '10px', height: '2px', background: '#2563eb', marginTop: '1px' }} />
                            </button>

                            {/* Highlighter */}
                            <button
                                type="button"
                                onClick={() => setIsHighlit(!isHighlit)}
                                style={{
                                    background: isHighlit ? '#fef08a' : 'transparent',
                                    border: 'none',
                                    borderRadius: '3px',
                                    padding: '3px 5px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: '#4b5563',
                                }}
                                title="Highlight"
                            >
                                <Highlighter size={13} />
                            </button>

                            {/* Alignment */}
                            <button
                                type="button"
                                style={{ background: 'transparent', border: 'none', borderRadius: '3px', padding: '3px 5px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#4b5563' }}
                                title="Align"
                            >
                                <AlignLeft size={13} />
                            </button>

                            {/* Bullet list */}
                            <button
                                type="button"
                                style={{ background: 'transparent', border: 'none', borderRadius: '3px', padding: '3px 5px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#4b5563' }}
                                title="Bulleted list"
                            >
                                <List size={13} />
                            </button>

                            {/* Numbered list */}
                            <button
                                type="button"
                                style={{ background: 'transparent', border: 'none', borderRadius: '3px', padding: '3px 5px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#4b5563' }}
                                title="Numbered list"
                            >
                                <ListOrdered size={13} />
                            </button>

                            {/* Indent */}
                            <button
                                type="button"
                                style={{ background: 'transparent', border: 'none', borderRadius: '3px', padding: '3px 5px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#4b5563' }}
                                title="Indent"
                            >
                                <Indent size={13} />
                            </button>

                            {/* Clear format */}
                            <button
                                type="button"
                                style={{ background: 'transparent', border: 'none', borderRadius: '3px', padding: '3px 5px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#4b5563' }}
                                title="Remove formatting"
                            >
                                <span style={{ fontSize: '0.75rem', fontWeight: '500' }}>Tₓ</span>
                            </button>

                            {/* Horizontal rule */}
                            <button
                                type="button"
                                style={{ background: 'transparent', border: 'none', borderRadius: '3px', padding: '3px 5px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#4b5563' }}
                                title="Horizontal rule"
                            >
                                <Minus size={13} />
                            </button>

                            {/* Undo */}
                            <button
                                type="button"
                                style={{ background: 'transparent', border: 'none', borderRadius: '3px', padding: '3px 5px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#4b5563' }}
                                title="Undo"
                            >
                                <Undo size={13} />
                            </button>
                        </div>

                        {/* 5. Bottom Action Bar: Icons on left, Black Split Send button on right */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.65rem 1.25rem',
                            borderTop: '1px solid #f1f3f5',
                            background: '#ffffff',
                        }}>
                            {/* Left Icons (Template button omitted as instructed) */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <button
                                    type="button"
                                    style={{ background: 'transparent', border: 'none', borderRadius: '4px', padding: '5px 7px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#4b5563' }}
                                    title="Text formatting"
                                >
                                    <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>A</span>
                                </button>
                                <button
                                    type="button"
                                    style={{ background: 'transparent', border: 'none', borderRadius: '4px', padding: '5px 7px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#4b5563' }}
                                    title="Add emoji"
                                >
                                    <Smile size={16} />
                                </button>
                                <button
                                    type="button"
                                    style={{ background: 'transparent', border: 'none', borderRadius: '4px', padding: '5px 7px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#4b5563' }}
                                    title="Attach file"
                                >
                                    <Paperclip size={16} />
                                </button>
                                <button
                                    type="button"
                                    style={{ background: 'transparent', border: 'none', borderRadius: '4px', padding: '5px 7px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#4b5563' }}
                                    title="Smart fields"
                                >
                                    <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>(•)</span>
                                </button>
                                <button
                                    type="button"
                                    style={{ background: 'transparent', border: 'none', borderRadius: '4px', padding: '5px 7px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#4b5563' }}
                                    title="Insert link"
                                >
                                    <Link2 size={16} />
                                </button>
                                <button
                                    type="button"
                                    style={{ background: 'transparent', border: 'none', borderRadius: '4px', padding: '5px 7px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#4b5563' }}
                                    title="Documents & attachments"
                                >
                                    <Sparkles size={15} />
                                </button>
                                <button
                                    type="button"
                                    style={{ background: 'transparent', border: 'none', borderRadius: '4px', padding: '5px 7px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#4b5563' }}
                                    title="Audio / Voice note"
                                >
                                    <Mic size={15} />
                                </button>
                            </div>

                            {/* Right: Black Split Send Button */}
                            <div style={{ position: 'relative' }}>
                                <div style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    background: '#111827',
                                    borderRadius: '6px',
                                    overflow: 'hidden',
                                }}>
                                    <button
                                        type="button"
                                        onClick={handleSendMessage}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: '#ffffff',
                                            fontSize: '0.82rem',
                                            fontWeight: '600',
                                            padding: '7px 14px',
                                            cursor: 'pointer',
                                            transition: 'background 0.15s ease',
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    >
                                        Send
                                    </button>
                                    <div style={{ width: '1px', height: '18px', background: 'rgba(255, 255, 255, 0.25)' }} />
                                    <button
                                        type="button"
                                        onClick={() => setShowSendDropdown(!showSendDropdown)}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: '#ffffff',
                                            padding: '7px 8px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'background 0.15s ease',
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                        title="Send options"
                                    >
                                        <ChevronDown size={14} />
                                    </button>
                                </div>

                                {/* Send Dropdown Menu */}
                                {showSendDropdown && (
                                    <div style={{
                                        position: 'absolute',
                                        right: 0,
                                        bottom: '40px',
                                        width: '160px',
                                        background: '#ffffff',
                                        borderRadius: '8px',
                                        border: '1px solid #e5e7eb',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                        zIndex: 10,
                                        padding: '4px 0',
                                    }}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowSendDropdown(false);
                                                showToast('Scheduled to send tomorrow at 9:00 AM');
                                                handleSendMessage();
                                            }}
                                            style={{
                                                width: '100%',
                                                textAlign: 'left',
                                                padding: '7px 12px',
                                                fontSize: '0.8rem',
                                                border: 'none',
                                                background: 'transparent',
                                                color: '#374151',
                                                cursor: 'pointer',
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                            Schedule send
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowSendDropdown(false);
                                                handleSaveDraft();
                                            }}
                                            style={{
                                                width: '100%',
                                                textAlign: 'left',
                                                padding: '7px 12px',
                                                fontSize: '0.8rem',
                                                border: 'none',
                                                background: 'transparent',
                                                color: '#374151',
                                                cursor: 'pointer',
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                            Save as draft
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowSendDropdown(false);
                                                setShowComposeModal(false);
                                                setComposeRecipient('');
                                                setComposeSubject('');
                                                setComposeBody('');
                                                showToast('Draft discarded');
                                            }}
                                            style={{
                                                width: '100%',
                                                textAlign: 'left',
                                                padding: '7px 12px',
                                                fontSize: '0.8rem',
                                                border: 'none',
                                                background: 'transparent',
                                                color: '#ef4444',
                                                cursor: 'pointer',
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = '#fee2e2'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                            Discard draft
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* EXPLORE BUSINESS PHONE & SMS MODAL */}
            {showSmsModal && (
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
                        borderRadius: '16px',
                        maxWidth: '540px',
                        width: '100%',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                        overflow: 'hidden',
                    }}>
                        <div style={{
                            padding: '1.25rem 1.5rem',
                            borderBottom: '1px solid #e5e7eb',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: '#111827' }}>
                                Business Phone &amp; SMS Integration
                            </h3>
                            <button
                                onClick={() => setShowSmsModal(false)}
                                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280' }}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div style={{ padding: '2rem 1.75rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{ textAlign: 'center', padding: '1rem', background: '#f8fafc', borderRadius: '10px' }}>
                                    <PhoneCall size={24} color="#2563eb" style={{ margin: '0 auto 8px auto' }} />
                                    <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#111827' }}>Dedicated Line</div>
                                    <div style={{ fontSize: '0.74rem', color: '#6b7280', marginTop: '4px' }}>Keep personal numbers private</div>
                                </div>
                                <div style={{ textAlign: 'center', padding: '1rem', background: '#f8fafc', borderRadius: '10px' }}>
                                    <MessageSquare size={24} color="#7c3aed" style={{ margin: '0 auto 8px auto' }} />
                                    <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#111827' }}>2-Way SMS</div>
                                    <div style={{ fontSize: '0.74rem', color: '#6b7280', marginTop: '4px' }}>Instant texting with clients</div>
                                </div>
                                <div style={{ textAlign: 'center', padding: '1rem', background: '#f8fafc', borderRadius: '10px' }}>
                                    <Mail size={24} color="#0d9488" style={{ margin: '0 auto 8px auto' }} />
                                    <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#111827' }}>Unified Thread</div>
                                    <div style={{ fontSize: '0.74rem', color: '#6b7280', marginTop: '4px' }}>SMS &amp; emails in one spot</div>
                                </div>
                            </div>

                            <p style={{ fontSize: '0.84rem', color: '#4b5563', lineHeight: '1.5', margin: '0 0 1.5rem 0', textAlign: 'center' }}>
                                Connect your communications seamlessly. Clients can text your studio number, and replies arrive straight in this inbox.
                            </p>

                            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                <button
                                    onClick={() => {
                                        setShowSmsModal(false);
                                        showToast('Business Phone & SMS trial activated!');
                                    }}
                                    style={{
                                        background: '#111827',
                                        color: '#ffffff',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '10px 22px',
                                        fontSize: '0.85rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Activate Free Phone Line Trial
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Notification Toast */}
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
