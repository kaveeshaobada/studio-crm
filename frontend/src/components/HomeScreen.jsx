import React, { useState } from 'react';
import {
    Info,
    LayoutGrid,
    User,
    FolderPlus,
    Receipt,
    FileText,
    Calendar as CalendarIcon,
    LayoutTemplate,
    Zap,
    Send,
    ChevronRight,
    ChevronLeft,
    Plus,
    Check,
    HelpCircle,
    Smartphone,
    Gem,
    Award,
    Newspaper,
    X,
} from 'lucide-react';
import insuranceOfferImg from '../assets/insurance_offer.jpg';
import learnStartedImg from '../assets/learn_started.jpg';

export default function HomeScreen({
    user,
    projects = [],
    onNavigateToPipeline,
    onOpenCreateProject,
    onOpenClientDirectory,
    onOpenCreateInvoice,
}) {
    const firstName = user?.name ? user.name.split(' ')[0] : 'Kaveesha';
    
    // Payments overview tab state: 'charged' | 'upcoming' | 'overdue'
    const [paymentsTab, setPaymentsTab] = useState('charged');
    
    // Tasks checklist state
    const [tasks, setTasks] = useState([
        { id: 1, title: 'Finish setting up my HoneyBook account 👨‍💻', date: 'Oct 15', completed: false },
        { id: 2, title: 'Create and customize an email template t...', date: 'Oct 16', completed: false },
        { id: 3, title: 'Set one mini goal for the week and check i...', date: 'Oct 17', completed: false },
    ]);

    // Toast notification
    const [toastMessage, setToastMessage] = useState(null);
    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage((curr) => (curr === msg ? null : curr)), 3000);
    };

    const toggleTask = (id) => {
        setTasks((prev) =>
            prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
        );
        const task = tasks.find((t) => t.id === id);
        if (task && !task.completed) {
            showToast('Task marked as complete! 🎉');
        }
    };

    // Offers carousel index
    const [offerIndex, setOfferIndex] = useState(0);
    const offers = [
        {
            title: 'Looking for small business insurance?',
            bullets: [
                'HoneyBook has partnered with NEXT to provide tailored, affordable small business insurance.',
                'Get it online within 10 minutes. Go to FAQ',
            ],
            buttonText: 'Learn more',
        },
        {
            title: 'Automate your client onboarding',
            bullets: [
                'Send smart files, contracts and welcome questionnaires automatically after payment.',
                'Save up to 10 hours a week with smart workflows.',
            ],
            buttonText: 'Explore automations',
        },
        {
            title: 'Grow with the HoneyBook Pro directory',
            bullets: [
                'Hire certified specialists for custom brand setup, website forms, and file migrations.',
                'Browse vetted independent studio pros.',
            ],
            buttonText: 'Find a Pro',
        },
    ];

    // Current date formatted e.g. "Tuesday, September 29, 2026"
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    // Time-based greeting
    const hours = today.getHours();
    let timeGreeting = 'Good afternoon';
    if (hours < 12) timeGreeting = 'Good morning';
    else if (hours >= 17) timeGreeting = 'Good evening';

    return (
        <div style={{
            flex: 1,
            width: '100%',
            overflowY: 'auto',
            background: '#fafbfc',
            padding: '2rem 3rem 4rem 3rem',
            boxSizing: 'border-box',
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
            position: 'relative',
        }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                
                {/* 1. GREETING & STATUS BANNER */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                }}>
                    {/* Left: Sticker + Greeting */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        {/* Cha-Ching Sticker Graphic */}
                        <div style={{
                            position: 'relative',
                            width: '84px',
                            height: '52px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: '0px',
                                left: '2px',
                                background: '#fb7185',
                                color: '#ffffff',
                                fontSize: '0.62rem',
                                fontWeight: '800',
                                padding: '2px 8px',
                                borderRadius: '9999px',
                                transform: 'rotate(-5deg)',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            }}>
                                Cha-ching!
                            </div>
                            <div style={{
                                position: 'absolute',
                                top: '12px',
                                left: '14px',
                                background: '#38bdf8',
                                color: '#ffffff',
                                fontSize: '0.62rem',
                                fontWeight: '800',
                                padding: '2px 8px',
                                borderRadius: '9999px',
                                transform: 'rotate(2deg)',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            }}>
                                Cha-ching!
                            </div>
                            <div style={{
                                position: 'absolute',
                                top: '24px',
                                left: '4px',
                                background: '#fb923c',
                                color: '#ffffff',
                                fontSize: '0.62rem',
                                fontWeight: '800',
                                padding: '2px 8px',
                                borderRadius: '9999px',
                                transform: 'rotate(-3deg)',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            }}>
                                Cha-ching!
                            </div>
                            <div style={{
                                position: 'absolute',
                                top: '35px',
                                left: '16px',
                                background: '#2dd4bf',
                                color: '#ffffff',
                                fontSize: '0.62rem',
                                fontWeight: '800',
                                padding: '2px 8px',
                                borderRadius: '9999px',
                                transform: 'rotate(1deg)',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            }}>
                                Cha-ching!
                            </div>
                            <span style={{ position: 'absolute', top: '-4px', right: '4px', color: '#fbbf24', fontSize: '0.75rem' }}>✦</span>
                        </div>

                        {/* Text Greeting */}
                        <div>
                            <div style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '500', marginBottom: '2px' }}>
                                {formattedDate}
                            </div>
                            <h1 style={{
                                margin: '0 0 4px 0',
                                fontSize: '1.75rem',
                                fontWeight: '800',
                                color: '#111827',
                                letterSpacing: '-0.025em',
                            }}>
                                {timeGreeting}, {firstName}
                            </h1>
                            <div style={{ fontSize: '0.82rem', color: '#4b5563', fontWeight: '500' }}>
                                Current status: Feeling like a million cha-chings!
                            </div>
                        </div>
                    </div>

                    {/* Right: Trial status & Reorder button */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>16 days left in trial</div>
                            <button
                                onClick={() => showToast('Opening trial & pricing details')}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#2563eb',
                                    fontSize: '0.8rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    padding: 0,
                                }}
                            >
                                Check out our pricing
                            </button>
                        </div>

                        <button
                            onClick={() => showToast('Customize dashboard layout')}
                            style={{
                                width: '34px',
                                height: '34px',
                                borderRadius: '8px',
                                border: '1px solid #e5e7eb',
                                background: '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: '#4b5563',
                            }}
                            title="Customize widgets"
                        >
                            <LayoutGrid size={16} />
                        </button>
                    </div>
                </div>

                {/* 2. TOP METRICS / KPI BAR */}
                <div style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    padding: '1.25rem 2rem',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '1.5rem',
                }}>
                    {/* Stat 1: New leads */}
                    <div style={{ borderRight: '1px solid #f1f3f5', paddingRight: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6b7280', fontSize: '0.82rem', fontWeight: '500' }}>
                            <span>New leads</span>
                            <Info size={13} color="#9ca3af" />
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: '#111827', marginTop: '6px' }}>
                            0
                        </div>
                    </div>

                    {/* Stat 2: Unread messages */}
                    <div style={{ borderRight: '1px solid #f1f3f5', paddingRight: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6b7280', fontSize: '0.82rem', fontWeight: '500' }}>
                            <span>Unread messages</span>
                            <Info size={13} color="#9ca3af" />
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: '#111827', marginTop: '6px' }}>
                            0
                        </div>
                    </div>

                    {/* Stat 3: Tasks */}
                    <div style={{ borderRight: '1px solid #f1f3f5', paddingRight: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6b7280', fontSize: '0.82rem', fontWeight: '500' }}>
                            <span>Tasks</span>
                            <Info size={13} color="#9ca3af" />
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: '#111827', marginTop: '6px' }}>
                            {tasks.filter((t) => !t.completed).length}
                        </div>
                    </div>

                    {/* Stat 4: 2026 bookings */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6b7280', fontSize: '0.82rem', fontWeight: '500' }}>
                            <span>2026 bookings</span>
                            <Info size={13} color="#9ca3af" />
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: '#111827', marginTop: '6px' }}>
                            $100
                        </div>
                    </div>
                </div>

                {/* 3. ROW 1: 3-COLUMN GRID (Create new, Automations, Leads) */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '1.5rem',
                    alignItems: 'stretch',
                }}>
                    {/* Col 1: Create new */}
                    <div style={{
                        background: '#ffffff',
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb',
                        padding: '1.4rem',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        <div style={{ fontSize: '0.92rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
                            Create new
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {[
                                { label: 'Contact', icon: User, action: onOpenClientDirectory },
                                { label: 'Project', icon: FolderPlus, action: onOpenCreateProject },
                                { label: 'Invoice', icon: Receipt, action: onOpenCreateInvoice || onOpenCreateProject },
                                { label: 'Contract', icon: FileText, action: () => showToast('Opening Contract creation') },
                                { label: 'Meeting', icon: CalendarIcon, action: () => showToast('Schedule a Meeting') },
                                { label: 'Lead form', icon: LayoutTemplate, action: () => showToast('Opening Lead Form builder') },
                            ].map((item, idx) => {
                                const IconComponent = item.icon;
                                return (
                                    <button
                                        key={idx}
                                        onClick={item.action}
                                        style={{
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            padding: '0.65rem 1rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            cursor: 'pointer',
                                            background: '#ffffff',
                                            transition: 'all 0.15s ease',
                                            color: '#1f2937',
                                            fontSize: '0.85rem',
                                            fontWeight: '500',
                                            width: '100%',
                                            textAlign: 'left',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.borderColor = '#d1d5db';
                                            e.currentTarget.style.background = '#fafbfc';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor = '#e5e7eb';
                                            e.currentTarget.style.background = '#ffffff';
                                        }}
                                    >
                                        <IconComponent size={16} color="#2563eb" />
                                        <span>{item.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Col 2: Automations */}
                    <div style={{
                        background: '#ffffff',
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb',
                        padding: '1.4rem',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        textAlign: 'center',
                    }}>
                        <div style={{ textAlign: 'left', fontSize: '0.92rem', fontWeight: '600', color: '#111827' }}>
                            Automations
                        </div>

                        <div style={{ padding: '2rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {/* Lightning icon */}
                            <div style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '50%',
                                background: '#fef9c3',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '1.25rem',
                            }}>
                                <Zap size={28} color="#eab308" fill="#facc15" />
                            </div>

                            <p style={{
                                fontSize: '0.82rem',
                                color: '#4b5563',
                                lineHeight: '1.5',
                                maxWidth: '270px',
                                margin: '0 0 1.25rem 0',
                            }}>
                                Save time by automating tasks, emails, and more. Use a template, start from scratch, or create with AI.
                            </p>

                            <button
                                onClick={() => showToast('Opening Automations builder')}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#2563eb',
                                    fontSize: '0.84rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                }}
                            >
                                + Start automating
                            </button>
                        </div>

                        <div />
                    </div>

                    {/* Col 3: Leads */}
                    <div style={{
                        background: '#ffffff',
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb',
                        padding: '1.4rem',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    }}>
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.92rem', fontWeight: '600', color: '#111827' }}>
                                <span>Leads</span>
                                <Info size={13} color="#9ca3af" />
                            </div>
                            <button
                                onClick={() => showToast('Create a new Lead form')}
                                style={{ background: 'transparent', border: 'none', color: '#2563eb', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
                            >
                                + Lead form
                            </button>
                        </div>

                        {/* Center Graphic */}
                        <div style={{ padding: '2rem 1rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {/* Stylized Tray with checked cards */}
                            <div style={{
                                position: 'relative',
                                width: '64px',
                                height: '52px',
                                marginBottom: '1.25rem',
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    top: '0px',
                                    left: '12px',
                                    width: '32px',
                                    height: '22px',
                                    borderRadius: '4px',
                                    background: '#fde047',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                }}>
                                    <Check size={14} color="#854d0e" strokeWidth={3} />
                                </div>
                                <div style={{
                                    position: 'absolute',
                                    top: '10px',
                                    left: '20px',
                                    width: '32px',
                                    height: '22px',
                                    borderRadius: '4px',
                                    background: '#60a5fa',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                }}>
                                    <Check size={14} color="#ffffff" strokeWidth={3} />
                                </div>
                                <div style={{
                                    position: 'absolute',
                                    bottom: '0px',
                                    left: '4px',
                                    width: '56px',
                                    height: '24px',
                                    borderRadius: '6px 6px 4px 4px',
                                    background: '#0e7490',
                                }} />
                            </div>

                            <div style={{ fontSize: '0.88rem', fontWeight: '600', color: '#1f2937' }}>
                                You've handled all inquiries.
                            </div>
                            <div style={{ fontSize: '0.82rem', color: '#4b5563', marginTop: '4px' }}>
                                Treat yourself 🍰
                            </div>

                            <button
                                onClick={onNavigateToPipeline}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#2563eb',
                                    fontSize: '0.82rem',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    marginTop: '12px',
                                }}
                            >
                                Show all
                            </button>
                        </div>

                        <div />
                    </div>
                </div>

                {/* 4. ROW 2: CALENDAR & ACTIVITY */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '1.5rem',
                    alignItems: 'stretch',
                }}>
                    {/* Col 1: Calendar */}
                    <div style={{
                        background: '#ffffff',
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb',
                        padding: '1.4rem',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.92rem', fontWeight: '600', color: '#111827' }}>
                                <span>Calendar</span>
                                <Info size={13} color="#9ca3af" />
                            </div>
                            <button
                                onClick={() => showToast('Schedule a new Meeting')}
                                style={{ background: 'transparent', border: 'none', color: '#2563eb', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
                            >
                                + Meeting
                            </button>
                        </div>

                        <div style={{ padding: '2rem 1rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {/* Calendar Sheet Icon */}
                            <div style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '8px',
                                background: '#f3f4f6',
                                border: '1px solid #e5e7eb',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                marginBottom: '1.25rem',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.04)',
                            }}>
                                <div style={{ height: '14px', background: '#6366f1' }} />
                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: '800', color: '#111827' }}>
                                    {today.getDate()}
                                </div>
                            </div>

                            <div style={{ fontSize: '0.88rem', fontWeight: '600', color: '#1f2937' }}>
                                Schedule looks clear today.
                            </div>
                            <div style={{ fontSize: '0.82rem', color: '#4b5563', marginTop: '4px' }}>
                                Enjoy your day 🍸
                            </div>

                            <button
                                onClick={() => showToast('Opening Studio Calendar')}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#2563eb',
                                    fontSize: '0.82rem',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    marginTop: '12px',
                                }}
                            >
                                Go to calendar
                            </button>
                        </div>

                        <div />
                    </div>

                    {/* Col 2: Activity */}
                    <div style={{
                        background: '#ffffff',
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb',
                        padding: '1.4rem',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.92rem', fontWeight: '600', color: '#111827' }}>
                                    <span>Activity</span>
                                    <Info size={13} color="#9ca3af" />
                                </div>
                                <button
                                    onClick={onOpenCreateProject}
                                    style={{ background: 'transparent', border: 'none', color: '#2563eb', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
                                >
                                    + Project
                                </button>
                            </div>

                            {/* Activity Items */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                        <div style={{ marginTop: '2px', color: '#111827' }}>
                                            <Send size={15} />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.84rem', fontWeight: '600', color: '#111827' }}>
                                                Test project
                                            </div>
                                            <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '2px' }}>
                                                File sent: Sample Invoice
                                            </div>
                                        </div>
                                    </div>
                                    <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>Sep 15</span>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                        <div style={{ marginTop: '2px', color: '#111827' }}>
                                            <FileText size={15} />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.84rem', fontWeight: '600', color: '#111827' }}>
                                                Test project
                                            </div>
                                            <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '2px' }}>
                                                Draft created: Sample Invoice
                                            </div>
                                        </div>
                                    </div>
                                    <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>Sep 15</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid #f1f3f5', paddingTop: '0.85rem', marginTop: '1.25rem' }}>
                            <button
                                onClick={onNavigateToPipeline}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#111827',
                                    fontSize: '0.82rem',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    cursor: 'pointer',
                                    padding: 0,
                                }}
                            >
                                <span>Go to active projects</span>
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Col 3: Spacer or placeholder to keep alignment */}
                    <div style={{ display: 'none' }} />
                </div>

                {/* 5. ROW 3: UNREAD MESSAGES (2 cols) & PAYMENTS (1 col) */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
                    gap: '1.5rem',
                    alignItems: 'start',
                }}>
                    {/* Unread messages (2 cols wide) */}
                    <div style={{
                        background: '#ffffff',
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb',
                        padding: '1.5rem',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        minHeight: '270px',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.92rem', fontWeight: '600', color: '#111827' }}>
                            <span>Unread messages</span>
                            <Info size={13} color="#9ca3af" />
                        </div>

                        <div style={{ textAlign: 'center', padding: '1.5rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {/* Provider Logos */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '1rem' }}>
                                <span style={{ color: '#6001d2', fontWeight: '900', fontSize: '1.1rem' }}>Y!</span>
                                <span style={{ color: '#000000', fontWeight: '800', fontSize: '0.95rem' }}>Aol.</span>
                                <div style={{ width: '16px', height: '16px', borderRadius: '3px', background: '#0078d4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '10px', fontWeight: 'bold' }}>O</div>
                                <span style={{ color: '#ea4335', fontWeight: '900', fontSize: '1.1rem' }}>G</span>
                                <span style={{ color: '#38bdf8', fontSize: '1.1rem' }}>☁</span>
                            </div>

                            <p style={{ fontSize: '0.82rem', color: '#4b5563', margin: '0 0 1rem 0' }}>
                                View and respond to incoming client messages.
                            </p>

                            <button
                                onClick={() => showToast('Opening Email Connection wizard')}
                                style={{
                                    background: '#ffffff',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '9999px',
                                    padding: '7px 22px',
                                    fontSize: '0.82rem',
                                    fontWeight: '600',
                                    color: '#111827',
                                    cursor: 'pointer',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                                }}
                            >
                                Connect email
                            </button>

                            <button
                                onClick={onOpenClientDirectory}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#2563eb',
                                    fontSize: '0.8rem',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    marginTop: '10px',
                                }}
                            >
                                Add contact
                            </button>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <button
                                onClick={() => showToast('HoneyBook Communication Guide')}
                                style={{ background: 'transparent', border: 'none', color: '#6b7280', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}
                            >
                                How to communicate via HoneyBook
                            </button>
                        </div>
                    </div>

                    {/* Payments (1 col wide) */}
                    <div style={{
                        background: '#ffffff',
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb',
                        padding: '1.5rem',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    }}>
                        <div>
                            {/* Header */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.92rem', fontWeight: '600', color: '#111827', marginBottom: '1.25rem' }}>
                                <span>Payments</span>
                                <Info size={13} color="#9ca3af" />
                            </div>

                            {/* September Gross Payments */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', color: '#6b7280' }}>
                                <span>September gross payments</span>
                                <Info size={12} color="#9ca3af" />
                            </div>
                            <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#111827', marginTop: '4px' }}>
                                $100
                            </div>

                            {/* Colored Progress Bar */}
                            <div style={{ width: '100%', height: '4px', background: '#e5e7eb', borderRadius: '9999px', margin: '0.75rem 0 1rem 0', overflow: 'hidden' }}>
                                <div style={{ width: '100%', height: '100%', background: '#ef4444', borderRadius: '9999px' }} />
                            </div>

                            {/* 2x2 Payment Status Breakdown */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem 1rem', fontSize: '0.78rem' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#6b7280' }}>
                                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                                        <span>Deposited (0)</span>
                                    </div>
                                    <div style={{ fontWeight: '600', color: '#111827', marginTop: '2px', paddingLeft: '11px' }}>$0</div>
                                </div>

                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#6b7280' }}>
                                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b' }} />
                                        <span>Processing (0)</span>
                                        <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>?</span>
                                    </div>
                                    <div style={{ fontWeight: '600', color: '#111827', marginTop: '2px', paddingLeft: '11px' }}>$0</div>
                                </div>

                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#6b7280' }}>
                                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#9ca3af' }} />
                                        <span>Upcoming (0)</span>
                                    </div>
                                    <div style={{ fontWeight: '600', color: '#111827', marginTop: '2px', paddingLeft: '11px' }}>$0</div>
                                </div>

                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#6b7280' }}>
                                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }} />
                                        <span>Overdue (1)</span>
                                    </div>
                                    <div style={{ fontWeight: '600', color: '#111827', marginTop: '2px', paddingLeft: '11px' }}>$100</div>
                                </div>
                            </div>

                            {/* Overdue Section */}
                            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #f1f3f5' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', color: '#6b7280' }}>
                                    <span>All existing overdue payments (1)</span>
                                    <Info size={12} color="#9ca3af" />
                                </div>
                                <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827', marginTop: '4px' }}>
                                    $100
                                </div>
                            </div>
                        </div>

                        {/* Bottom link */}
                        <div style={{ borderTop: '1px solid #f1f3f5', paddingTop: '0.85rem', marginTop: '1.25rem' }}>
                            <button
                                onClick={() => showToast('Navigating to Payments')}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#111827',
                                    fontSize: '0.82rem',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    cursor: 'pointer',
                                    padding: 0,
                                }}
                            >
                                <span>Go to payments</span>
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* 6. ROW 4: PAYMENTS OVERVIEW, RECENT NOTES, TASKS */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '1.5rem',
                    alignItems: 'stretch',
                }}>
                    {/* Payments overview */}
                    <div style={{
                        background: '#ffffff',
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb',
                        padding: '1.4rem',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.92rem', fontWeight: '600', color: '#111827', marginBottom: '0.85rem' }}>
                                <span>Payments overview</span>
                                <Info size={13} color="#9ca3af" />
                            </div>

                            {/* Pill tabs */}
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                                <button
                                    onClick={() => setPaymentsTab('charged')}
                                    style={{
                                        border: 'none',
                                        borderRadius: '9999px',
                                        padding: '4px 10px',
                                        fontSize: '0.72rem',
                                        fontWeight: '600',
                                        background: paymentsTab === 'charged' ? '#2563eb' : '#f3f4f6',
                                        color: paymentsTab === 'charged' ? '#ffffff' : '#6b7280',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Charged/Processing (0)
                                </button>
                                <button
                                    onClick={() => setPaymentsTab('upcoming')}
                                    style={{
                                        border: 'none',
                                        borderRadius: '9999px',
                                        padding: '4px 10px',
                                        fontSize: '0.72rem',
                                        fontWeight: '600',
                                        background: paymentsTab === 'upcoming' ? '#2563eb' : '#f3f4f6',
                                        color: paymentsTab === 'upcoming' ? '#ffffff' : '#6b7280',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Upcoming (0)
                                </button>
                                <button
                                    onClick={() => setPaymentsTab('overdue')}
                                    style={{
                                        border: 'none',
                                        borderRadius: '9999px',
                                        padding: '4px 10px',
                                        fontSize: '0.72rem',
                                        fontWeight: '600',
                                        background: paymentsTab === 'overdue' ? '#2563eb' : '#f3f4f6',
                                        color: paymentsTab === 'overdue' ? '#ffffff' : '#6b7280',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Overdue (1)
                                </button>
                            </div>

                            {/* Graphic & Notice */}
                            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                                <div style={{
                                    width: '48px',
                                    height: '56px',
                                    background: '#fef3c7',
                                    borderRadius: '6px',
                                    margin: '0 auto 10px auto',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                }}>
                                    <div style={{ width: '28px', height: '3px', background: '#d97706', borderRadius: '2px', marginBottom: '4px' }} />
                                    <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#92400e' }}>$</div>
                                </div>
                                <div style={{ fontSize: '0.82rem', color: '#4b5563', marginBottom: '8px' }}>
                                    Nothing here at the moment.
                                </div>
                                <button
                                    onClick={onOpenCreateInvoice || onOpenCreateProject}
                                    style={{ background: 'transparent', border: 'none', color: '#2563eb', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', display: 'block', margin: '0 auto' }}
                                >
                                    + Create invoice
                                </button>
                                <button
                                    onClick={() => showToast('Opening Payments FAQ')}
                                    style={{ background: 'transparent', border: 'none', color: '#6b7280', fontSize: '0.75rem', cursor: 'pointer', marginTop: '6px' }}
                                >
                                    Payments FAQ
                                </button>
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid #f1f3f5', paddingTop: '0.85rem', marginTop: '1rem' }}>
                            <button
                                onClick={() => showToast('Navigating to Payments')}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#111827',
                                    fontSize: '0.82rem',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    cursor: 'pointer',
                                    padding: 0,
                                }}
                            >
                                <span>Go to payments</span>
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Recent notes */}
                    <div style={{
                        background: '#ffffff',
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb',
                        padding: '1.4rem',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.92rem', fontWeight: '600', color: '#111827' }}>
                                    <span>Recent notes</span>
                                    <Info size={13} color="#9ca3af" />
                                </div>
                                <button
                                    onClick={() => showToast('Add a new note')}
                                    style={{ background: 'transparent', border: 'none', color: '#2563eb', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
                                >
                                    + Note
                                </button>
                            </div>

                            {/* Center Sticky Notes Graphic */}
                            <div style={{ padding: '1.5rem 0', textAlign: 'center' }}>
                                <div style={{
                                    position: 'relative',
                                    width: '64px',
                                    height: '52px',
                                    margin: '0 auto 12px auto',
                                }}>
                                    <div style={{ position: 'absolute', top: 0, left: '6px', width: '32px', height: '32px', background: '#cbd5e1', borderRadius: '4px', transform: 'rotate(-8deg)' }} />
                                    <div style={{ position: 'absolute', top: '4px', right: '4px', width: '30px', height: '32px', background: '#86efac', borderRadius: '4px', transform: 'rotate(12deg)' }} />
                                    <div style={{ position: 'absolute', bottom: 0, left: '16px', width: '34px', height: '32px', background: '#fef08a', borderRadius: '4px', transform: 'rotate(2deg)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} />
                                </div>

                                <div style={{ fontSize: '0.88rem', fontWeight: '600', color: '#1f2937' }}>
                                    All quiet here.
                                </div>
                                <div style={{ fontSize: '0.82rem', color: '#4b5563', marginTop: '4px' }}>
                                    A parking lot for ideas 🚗
                                </div>
                            </div>
                        </div>

                        <div style={{ textAlign: 'center', borderTop: '1px solid #f1f3f5', paddingTop: '0.85rem' }}>
                            <button
                                onClick={() => showToast('Learn about Quick Notes')}
                                style={{ background: 'transparent', border: 'none', color: '#2563eb', fontSize: '0.78rem', textDecoration: 'underline', cursor: 'pointer' }}
                            >
                                Learn about notes
                            </button>
                        </div>
                    </div>

                    {/* Tasks (3) */}
                    <div style={{
                        background: '#ffffff',
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb',
                        padding: '1.4rem',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.92rem', fontWeight: '600', color: '#111827' }}>
                                    <span>Tasks ({tasks.filter(t => !t.completed).length})</span>
                                    <Info size={13} color="#9ca3af" />
                                </div>
                                <button
                                    onClick={() => showToast('Create a new task')}
                                    style={{ background: 'transparent', border: 'none', color: '#2563eb', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
                                >
                                    + Task
                                </button>
                            </div>

                            {/* Task List */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                                {tasks.map((task) => (
                                    <div
                                        key={task.id}
                                        onClick={() => toggleTask(task.id)}
                                        style={{
                                            border: '1px solid #f1f3f5',
                                            borderRadius: '8px',
                                            padding: '0.65rem 0.75rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            cursor: 'pointer',
                                            background: '#ffffff',
                                            transition: 'all 0.15s ease',
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#f1f3f5'; }}
                                    >
                                        <div style={{
                                            width: '16px',
                                            height: '16px',
                                            borderRadius: '50%',
                                            border: task.completed ? 'none' : '1.5px solid #d1d5db',
                                            background: task.completed ? '#10b981' : 'transparent',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                        }}>
                                            {task.completed && <Check size={11} color="#ffffff" strokeWidth={3} />}
                                        </div>

                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{
                                                fontSize: '0.78rem',
                                                fontWeight: '500',
                                                color: task.completed ? '#9ca3af' : '#1f2937',
                                                textDecoration: task.completed ? 'line-through' : 'none',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}>
                                                {task.title}
                                            </div>
                                            <div style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: '2px' }}>
                                                {task.date}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid #f1f3f5', paddingTop: '0.85rem', marginTop: '1rem' }}>
                            <button
                                onClick={() => showToast('Opening Tasks manager')}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#111827',
                                    fontSize: '0.82rem',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    cursor: 'pointer',
                                    padding: 0,
                                }}
                            >
                                <span>Go to tasks</span>
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* 7. ROW 5: OFFERS FOR YOU (1/3 width) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                    <div style={{
                        background: '#ffffff',
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb',
                        padding: '1.4rem',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    }}>
                        <div>
                            <div style={{ fontSize: '0.92rem', fontWeight: '600', color: '#111827', marginBottom: '0.85rem' }}>
                                Offers for you
                            </div>

                            {/* Graphic Banner */}
                            <div style={{
                                height: '140px',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                marginBottom: '1rem',
                                background: '#fdf6ed',
                                position: 'relative',
                            }}>
                                <img
                                    src={insuranceOfferImg}
                                    alt="Small business insurance"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>

                            {/* Offer Details */}
                            <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>
                                {offers[offerIndex].title}
                            </div>
                            <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.78rem', color: '#4b5563', lineHeight: '1.5' }}>
                                {offers[offerIndex].bullets.map((b, i) => (
                                    <li key={i}>{b}</li>
                                ))}
                            </ul>

                            <button
                                onClick={() => showToast(`Opening offer: ${offers[offerIndex].title}`)}
                                style={{
                                    marginTop: '1rem',
                                    background: '#111827',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '7px 16px',
                                    fontSize: '0.8rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                }}
                            >
                                {offers[offerIndex].buttonText}
                            </button>
                        </div>

                        {/* Carousel Dots & Arrows */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', paddingTop: '0.85rem', borderTop: '1px solid #f1f3f5' }}>
                            <div style={{ display: 'flex', gap: '5px' }}>
                                {offers.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setOfferIndex(i)}
                                        style={{
                                            width: '6px',
                                            height: '6px',
                                            borderRadius: '50%',
                                            background: offerIndex === i ? '#111827' : '#d1d5db',
                                            border: 'none',
                                            padding: 0,
                                            cursor: 'pointer',
                                        }}
                                    />
                                ))}
                            </div>

                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    onClick={() => setOfferIndex((prev) => (prev > 0 ? prev - 1 : offers.length - 1))}
                                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#4b5563', padding: '2px' }}
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <button
                                    onClick={() => setOfferIndex((prev) => (prev < offers.length - 1 ? prev + 1 : 0))}
                                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#4b5563', padding: '2px' }}
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 8. ROW 6: LEARN BANNER & 2X2 GUIDES GRID */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 2fr)',
                    gap: '1.5rem',
                    alignItems: 'stretch',
                }}>
                    {/* Left: Terracotta Orange Learn Banner */}
                    <div
                        onClick={() => showToast('Starting HoneyBook interactive tutorial')}
                        style={{
                            background: 'linear-gradient(135deg, #e05e32 0%, #c2410c 100%)',
                            borderRadius: '12px',
                            padding: '1.75rem',
                            color: '#ffffff',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            boxShadow: '0 2px 6px rgba(194, 65, 12, 0.15)',
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        <div>
                            <div style={{ fontSize: '0.88rem', fontWeight: '600', opacity: 0.9 }}>
                                Learn:
                            </div>
                            <div style={{ fontSize: '1.4rem', fontWeight: '800', lineHeight: 1.25, marginTop: '4px', maxWidth: '220px' }}>
                                how to get started with HoneyBook
                            </div>
                        </div>

                        {/* Illustration Mockup Preview */}
                        <div style={{
                            marginTop: '1.25rem',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                            height: '130px',
                            background: '#ffffff',
                        }}>
                            <img
                                src={learnStartedImg}
                                alt="Get Started Mockup"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                    </div>

                    {/* Right: 2x2 Guides Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gridTemplateRows: '1fr 1fr',
                        gap: '1rem',
                    }}>
                        {[
                            {
                                color: '#3b82f6',
                                title: 'Get started with HoneyBook',
                                subtitle: 'Learn how to set up your new account.',
                            },
                            {
                                color: '#f97316',
                                title: 'How to create and share invoices',
                                subtitle: 'Learn about branded professional invoices.',
                            },
                            {
                                color: '#06b6d4',
                                title: 'How to create and share files',
                                subtitle: 'Learn about contracts, invoices, and more.',
                            },
                            {
                                color: '#a855f7',
                                title: 'Free file setup',
                                subtitle: 'Upload files and get them back as templates.',
                            },
                        ].map((guide, idx) => (
                            <div
                                key={idx}
                                onClick={() => showToast(`Opening guide: ${guide.title}`)}
                                style={{
                                    background: '#ffffff',
                                    borderRadius: '10px',
                                    border: '1px solid #e5e7eb',
                                    borderLeft: `4px solid ${guide.color}`,
                                    padding: '1.15rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    transition: 'all 0.15s ease',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = '0 3px 8px rgba(0,0,0,0.05)';
                                    e.currentTarget.style.borderColor = '#d1d5db';
                                    e.currentTarget.style.borderLeftColor = guide.color;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.02)';
                                    e.currentTarget.style.borderColor = '#e5e7eb';
                                    e.currentTarget.style.borderLeftColor = guide.color;
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ fontSize: '0.86rem', fontWeight: '600', color: '#111827', lineHeight: 1.3 }}>
                                        {guide.title}
                                    </div>
                                    <ChevronRight size={15} color="#9ca3af" />
                                </div>
                                <div style={{ fontSize: '0.76rem', color: '#6b7280', marginTop: '6px' }}>
                                    {guide.subtitle}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 9. ROW 7: FOOTER RESOURCES & TIP OF THE DAY */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1.2fr)',
                    gap: '2rem',
                    alignItems: 'center',
                    paddingTop: '1rem',
                    borderTop: '1px solid #e5e7eb',
                }}>
                    {/* Left: Quick Links */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                            <button
                                onClick={() => showToast('Opening Help Center')}
                                style={{ background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', color: '#374151', fontSize: '0.84rem', fontWeight: '500', cursor: 'pointer' }}
                            >
                                <HelpCircle size={16} />
                                <span>Help Center</span>
                            </button>
                            <button
                                onClick={() => showToast('Opening Blog')}
                                style={{ background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', color: '#374151', fontSize: '0.84rem', fontWeight: '500', cursor: 'pointer' }}
                            >
                                <Newspaper size={16} />
                                <span>Blog</span>
                            </button>
                            <button
                                onClick={() => showToast('Opening Pros Marketplace')}
                                style={{ background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', color: '#374151', fontSize: '0.84rem', fontWeight: '500', cursor: 'pointer' }}
                            >
                                <Award size={16} />
                                <span>Pros Marketplace</span>
                            </button>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                            <button
                                onClick={() => showToast('Download Mobile App')}
                                style={{ background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', color: '#374151', fontSize: '0.84rem', fontWeight: '500', cursor: 'pointer' }}
                            >
                                <Smartphone size={16} />
                                <span>Mobile app</span>
                            </button>
                            <button
                                onClick={() => showToast('View Pricing Plans')}
                                style={{ background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', color: '#374151', fontSize: '0.84rem', fontWeight: '500', cursor: 'pointer' }}
                            >
                                <Gem size={16} color="#0d9488" />
                                <span>See pricing</span>
                            </button>
                        </div>
                    </div>

                    {/* Right: Tip of the day */}
                    <div style={{
                        background: '#fef8ee',
                        borderRadius: '12px',
                        border: '1px solid #fde68a',
                        padding: '1.25rem 1.4rem',
                        position: 'relative',
                    }}>
                        <div style={{ fontSize: '0.86rem', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>
                            Tip of the day
                        </div>
                        <p style={{ fontSize: '0.78rem', color: '#4b5563', margin: '0 0 6px 0', lineHeight: 1.45 }}>
                            Create a professional, branded email signature to add to emails that go out via HoneyBook.
                        </p>
                        <div style={{ fontSize: '0.72rem', color: '#6b7280', marginBottom: '8px' }}>
                            Company settings &gt; Company brand
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <button
                                onClick={() => showToast('Email signature settings')}
                                style={{ background: 'transparent', border: 'none', color: '#2563eb', fontSize: '0.78rem', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
                            >
                                Learn about email signatures
                            </button>
                            <span style={{ fontSize: '1.2rem' }}>🔮</span>
                        </div>
                    </div>
                </div>

            </div>

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
