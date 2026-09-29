import React, { useState } from 'react';
import {
    Check,
    ChevronRight,
    Plus,
    Download,
    Play,
    FileText,
    Award,
    Users,
    HelpCircle,
    X,
} from 'lucide-react';
import brandAvatarImg from '../assets/brand_avatar.jpg';
import setupVideoBannerImg from '../assets/setup_video_banner.jpg';

const INITIAL_STEPS = [
    {
        id: 1,
        title: 'Choose your plan',
        duration: '2 min',
        description: 'Pick a plan that fits your workflow and business goals.',
        actionType: 'plan',
    },
    {
        id: 2,
        title: 'Try out your test project',
        duration: '2 min',
        description: 'Every email you send lands in your inbox, so you can see what your clients receive.',
        actionType: 'test_project',
    },
    {
        id: 3,
        title: 'Add your services',
        duration: '1 min',
        description: 'List your cinematography packages to use in proposals and bookings.',
        actionType: 'services',
    },
    {
        id: 4,
        title: 'Publish a lead form',
        duration: '2 min',
        description: 'Start capturing new client inquiries directly into HoneyBook.',
        actionType: 'lead_form',
    },
    {
        id: 5,
        title: 'Customize your pipeline',
        duration: '3 min',
        description: 'Tailor your workflow stages to match how you manage projects.',
        actionType: 'pipeline',
    },
    {
        id: 6,
        title: 'Create your first project',
        duration: '3 min',
        description: 'Set up a project workspace to manage a client engagement from start to finish.',
        actionType: 'create_project',
    },
    {
        id: 7,
        title: 'Send a proposal',
        duration: '10 min',
        description: 'Share your services and pricing with a client to kick off the booking process.',
        actionType: 'proposal',
    },
];

export default function SetupScreen({
    user,
    completedSteps = [2, 6],
    onToggleStep,
    onNavigateToPipeline,
    onOpenCreateProject,
}) {
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [activeToast, setActiveToast] = useState(null);

    const firstName = user?.name ? user.name.split(' ')[0] : 'Kaveesha';
    const fullName = user?.name || 'Kaveesha Obadakumbura';

    const showToast = (message) => {
        setActiveToast(message);
        setTimeout(() => {
            setActiveToast((curr) => (curr === message ? null : curr));
        }, 3200);
    };

    const handleStepClick = (step, e) => {
        if (e) e.stopPropagation();

        if (step.actionType === 'pipeline' && onNavigateToPipeline) {
            onNavigateToPipeline();
            return;
        }
        if (step.actionType === 'create_project' && onOpenCreateProject) {
            onOpenCreateProject();
            return;
        }

        // Toggle completion or show action guidance
        if (onToggleStep) {
            onToggleStep(step.id);
            const isNowCompleted = !completedSteps.includes(step.id);
            if (isNowCompleted) {
                showToast(`Step "${step.title}" marked as complete!`);
            }
        }
    };

    const progressPercentage = Math.round((completedSteps.length / INITIAL_STEPS.length) * 100);

    return (
        <div style={{
            flex: 1,
            width: '100%',
            overflowY: 'auto',
            background: '#fafbfc',
            padding: '2.5rem 3.5rem 4rem 3.5rem',
            boxSizing: 'border-box',
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
            position: 'relative',
        }}>
            {/* Inner Centered Container */}
            <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
                {/* Main Heading */}
                <h1 style={{
                    fontSize: '1.95rem',
                    fontWeight: '800',
                    color: '#111827',
                    margin: '0 0 1.85rem 0',
                    letterSpacing: '-0.025em',
                }}>
                    Welcome to HoneyBook, {firstName}!
                </h1>

                {/* Two-Column Responsive Layout */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1.62fr) minmax(0, 1fr)',
                    gap: '2.25rem',
                    alignItems: 'start',
                }}>
                    {/* LEFT COLUMN: Checklist Card */}
                    <div style={{
                        background: '#ffffff',
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
                        padding: '1.75rem 2rem',
                    }}>
                        {/* Card Header with Progress */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '1.4rem',
                        }}>
                            <span style={{
                                fontSize: '0.96rem',
                                fontWeight: '600',
                                color: '#111827',
                            }}>
                                Let's start step-by-step
                            </span>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ fontSize: '0.78rem', color: '#6b7280', fontWeight: '500' }}>
                                    {completedSteps.length}/{INITIAL_STEPS.length} completed
                                </span>
                                <div style={{
                                    width: '130px',
                                    height: '5px',
                                    background: '#e5e7eb',
                                    borderRadius: '9999px',
                                    overflow: 'hidden',
                                }}>
                                    <div style={{
                                        width: `${progressPercentage}%`,
                                        height: '100%',
                                        background: '#10b981',
                                        borderRadius: '9999px',
                                        transition: 'width 0.3s ease',
                                    }} />
                                </div>
                            </div>
                        </div>

                        {/* 7 Interactive Steps */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                            {INITIAL_STEPS.map((step) => {
                                const isCompleted = completedSteps.includes(step.id);
                                return (
                                    <div
                                        key={step.id}
                                        onClick={(e) => handleStepClick(step, e)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '1rem 1.15rem',
                                            borderRadius: '10px',
                                            border: '1px solid #f0f1f3',
                                            background: '#ffffff',
                                            cursor: 'pointer',
                                            transition: 'all 0.16s ease',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.borderColor = '#d1d5db';
                                            e.currentTarget.style.background = '#fafbfc';
                                            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.02)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor = '#f0f1f3';
                                            e.currentTarget.style.background = '#ffffff';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        {/* Left: Checkmark Circle + Title & Description */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
                                            {/* Checkbox Trigger */}
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (onToggleStep) onToggleStep(step.id);
                                                }}
                                                style={{
                                                    width: '20px',
                                                    height: '20px',
                                                    borderRadius: '50%',
                                                    border: isCompleted ? 'none' : '1.5px dashed #cbd5e1',
                                                    background: isCompleted ? '#10b981' : 'transparent',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0,
                                                    cursor: 'pointer',
                                                    padding: 0,
                                                    outline: 'none',
                                                    transition: 'all 0.15s ease',
                                                }}
                                                title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                                                aria-label={isCompleted ? `Step ${step.title} complete` : `Step ${step.title} incomplete`}
                                            >
                                                {isCompleted ? (
                                                    <Check size={13} color="#ffffff" strokeWidth={3} />
                                                ) : null}
                                            </button>

                                            {/* Text Content */}
                                            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span style={{
                                                        fontSize: '0.88rem',
                                                        fontWeight: '600',
                                                        color: '#1f2937',
                                                        lineHeight: 1.2,
                                                    }}>
                                                        {step.title}
                                                    </span>
                                                    <span style={{
                                                        fontSize: '0.7rem',
                                                        fontWeight: '500',
                                                        color: '#6b7280',
                                                        background: '#f3f4f6',
                                                        padding: '1px 6px',
                                                        borderRadius: '4px',
                                                        lineHeight: 1.2,
                                                    }}>
                                                        {step.duration}
                                                    </span>
                                                </div>
                                                <span style={{
                                                    fontSize: '0.78rem',
                                                    color: '#6b7280',
                                                    marginTop: '4px',
                                                    lineHeight: 1.35,
                                                }}>
                                                    {step.description}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Right Chevron */}
                                        <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '8px' }}>
                                            <ChevronRight size={16} color="#9ca3af" />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Brand elements, Integrations, and Video Confidence Card */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
                        {/* 1. Brand Elements Card */}
                        <div style={{
                            background: '#ffffff',
                            borderRadius: '12px',
                            border: '1px solid #e5e7eb',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
                            padding: '1.25rem 1.4rem',
                        }}>
                            <div
                                onClick={() => showToast('Customize Brand Elements in Settings')}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                }}
                            >
                                <span style={{ fontSize: '0.92rem', fontWeight: '600', color: '#111827' }}>
                                    Brand elements
                                </span>
                                <ChevronRight size={16} color="#9ca3af" />
                            </div>

                            {/* Elements Row */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                marginTop: '1rem',
                            }}>
                                {/* + Logo Box */}
                                <div
                                    onClick={() => showToast('Upload studio logo')}
                                    style={{
                                        width: '42px',
                                        height: '42px',
                                        borderRadius: '8px',
                                        border: '1px dashed #93c5fd',
                                        background: '#f0f7ff',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        transition: 'all 0.15s ease',
                                    }}
                                    title="Add your logo"
                                >
                                    <Plus size={13} color="#2563eb" />
                                    <span style={{ fontSize: '0.62rem', fontWeight: '600', color: '#2563eb', marginTop: '1px' }}>
                                        Logo
                                    </span>
                                </div>

                                {/* Blue Brand Color Swatch */}
                                <div
                                    onClick={() => showToast('Primary brand color')}
                                    style={{
                                        width: '38px',
                                        height: '38px',
                                        borderRadius: '50%',
                                        background: '#0284c7',
                                        boxShadow: '0 1px 3px rgba(2, 132, 199, 0.3)',
                                        cursor: 'pointer',
                                    }}
                                    title="Primary Brand Color: #0284c7"
                                />

                                {/* Avatar Thumbnail */}
                                <div
                                    onClick={() => showToast('Profile avatar')}
                                    style={{
                                        width: '38px',
                                        height: '38px',
                                        borderRadius: '50%',
                                        overflow: 'hidden',
                                        border: '1px solid #e5e7eb',
                                        cursor: 'pointer',
                                        boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                                    }}
                                    title="Owner Avatar"
                                >
                                    <img
                                        src={brandAvatarImg}
                                        alt="Brand Avatar"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>

                                <div style={{ flex: 1 }} />

                                {/* Download / Import Button */}
                                <button
                                    onClick={() => showToast('Export brand assets')}
                                    style={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '8px',
                                        border: '1px solid #e5e7eb',
                                        background: '#ffffff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        color: '#4b5563',
                                        transition: 'background 0.15s ease',
                                    }}
                                    title="Download Brand Elements"
                                >
                                    <Download size={15} color="#4b5563" />
                                </button>
                            </div>
                        </div>

                        {/* 2. Integrations Card */}
                        <div style={{
                            background: '#ffffff',
                            borderRadius: '12px',
                            border: '1px solid #e5e7eb',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
                            padding: '1.25rem 1.4rem',
                        }}>
                            <div
                                onClick={() => showToast('Manage Integrations')}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    marginBottom: '0.9rem',
                                }}
                            >
                                <span style={{ fontSize: '0.92rem', fontWeight: '600', color: '#111827' }}>
                                    Integrations
                                </span>
                                <ChevronRight size={16} color="#9ca3af" />
                            </div>

                            {/* Integration Badges */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {/* Row 1: Gmail, Zoom, Canva */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                    {/* Gmail */}
                                    <button
                                        onClick={() => showToast('Connect Gmail')}
                                        style={{
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '9999px',
                                            padding: '5px 12px',
                                            fontSize: '0.78rem',
                                            fontWeight: '500',
                                            color: '#374151',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            cursor: 'pointer',
                                            background: '#ffffff',
                                        }}
                                    >
                                        <svg width="14" height="12" viewBox="0 0 24 20" fill="none">
                                            <path d="M0 2.857C0 1.279 1.28 0 2.857 0h18.286C22.72 0 24 1.28 24 2.857v14.286C24 18.72 22.72 20 21.143 20H2.857C1.28 20 0 18.72 0 17.143V2.857z" fill="#E8EAED"/>
                                            <path d="M24 2.857L12 11.429 0 2.857V17.143C0 18.72 1.28 20 2.857 20H5V8.571L12 13.571l7-5V20h2.143c1.577 0 2.857-1.28 2.857-2.857V2.857z" fill="#EA4335"/>
                                            <path d="M5 20V8.571L0 5v12.143C0 18.72 1.28 20 2.857 20H5z" fill="#4285F4"/>
                                            <path d="M19 20V8.571L24 5v12.143c0 1.577-1.28 2.857-2.857 2.857H19z" fill="#34A853"/>
                                            <path d="M19 4.286L12 9.286 5 4.286V2.857C5 1.28 6.28 0 7.857 0h8.286C17.72 0 19 1.28 19 2.857v1.429z" fill="#FBBC04"/>
                                        </svg>
                                        <span>Gmail</span>
                                    </button>

                                    {/* Zoom */}
                                    <button
                                        onClick={() => showToast('Connect Zoom')}
                                        style={{
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '9999px',
                                            padding: '5px 12px',
                                            fontSize: '0.78rem',
                                            fontWeight: '500',
                                            color: '#374151',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            cursor: 'pointer',
                                            background: '#ffffff',
                                        }}
                                    >
                                        <div style={{
                                            width: '14px',
                                            height: '14px',
                                            borderRadius: '3px',
                                            background: '#2D8CFF',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            <span style={{ color: '#fff', fontSize: '9px', fontWeight: 'bold' }}>📹</span>
                                        </div>
                                        <span>Zoom</span>
                                    </button>

                                    {/* Canva */}
                                    <button
                                        onClick={() => showToast('Connect Canva')}
                                        style={{
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '9999px',
                                            padding: '5px 12px',
                                            fontSize: '0.78rem',
                                            fontWeight: '500',
                                            color: '#374151',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            cursor: 'pointer',
                                            background: '#ffffff',
                                        }}
                                    >
                                        <div style={{
                                            width: '14px',
                                            height: '14px',
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #00C4CC 0%, #7D2AE8 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            <span style={{ color: '#fff', fontSize: '9px', fontStyle: 'italic', fontWeight: '900' }}>C</span>
                                        </div>
                                        <span>Canva</span>
                                    </button>
                                </div>

                                {/* Row 2: Google Calendar, QuickBooks */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                    {/* Google Calendar */}
                                    <button
                                        onClick={() => showToast('Connect Google Calendar')}
                                        style={{
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '9999px',
                                            padding: '5px 12px',
                                            fontSize: '0.78rem',
                                            fontWeight: '500',
                                            color: '#374151',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            cursor: 'pointer',
                                            background: '#ffffff',
                                        }}
                                    >
                                        <div style={{
                                            width: '14px',
                                            height: '14px',
                                            borderRadius: '3px',
                                            background: '#4285F4',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#ffffff',
                                            fontSize: '8px',
                                            fontWeight: '800',
                                        }}>
                                            31
                                        </div>
                                        <span>Google Calendar</span>
                                    </button>

                                    {/* QuickBooks */}
                                    <button
                                        onClick={() => showToast('Connect QuickBooks')}
                                        style={{
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '9999px',
                                            padding: '5px 12px',
                                            fontSize: '0.78rem',
                                            fontWeight: '500',
                                            color: '#374151',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            cursor: 'pointer',
                                            background: '#ffffff',
                                        }}
                                    >
                                        <div style={{
                                            width: '14px',
                                            height: '14px',
                                            borderRadius: '50%',
                                            background: '#2CA01C',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#ffffff',
                                            fontSize: '8px',
                                            fontWeight: '800',
                                        }}>
                                            qb
                                        </div>
                                        <span>QuickBooks</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* 3. Confidence Video & Resources Card */}
                        <div style={{
                            background: '#ffffff',
                            borderRadius: '12px',
                            border: '1px solid #e5e7eb',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
                            padding: '1.25rem 1.4rem',
                        }}>
                            <span style={{ fontSize: '0.92rem', fontWeight: '600', color: '#111827' }}>
                                Start using HoneyBook with confidence
                            </span>

                            {/* Video Preview Banner */}
                            <div
                                onClick={() => setIsVideoModalOpen(true)}
                                style={{
                                    marginTop: '0.85rem',
                                    marginBottom: '1.15rem',
                                    borderRadius: '10px',
                                    overflow: 'hidden',
                                    position: 'relative',
                                    height: '138px',
                                    background: 'linear-gradient(135deg, #746c33 0%, #524c23 100%)',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                                }}
                            >
                                <img
                                    src={setupVideoBannerImg}
                                    alt="How to use HoneyBook"
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        opacity: 0.88,
                                    }}
                                />

                                {/* Subtle Overlay with Text & Branding */}
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    background: 'linear-gradient(90deg, rgba(30, 26, 8, 0.75) 0%, rgba(30, 26, 8, 0.3) 55%, rgba(0,0,0,0.1) 100%)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    padding: '12px 14px',
                                    boxSizing: 'border-box',
                                }}>
                                    {/* Top subtitle */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <div style={{
                                            background: '#fef08a',
                                            color: '#713f12',
                                            fontWeight: '800',
                                            fontSize: '0.62rem',
                                            padding: '1px 4px',
                                            borderRadius: '3px',
                                            letterSpacing: '0.04em',
                                        }}>
                                            HY BK
                                        </div>
                                        <span style={{ fontSize: '0.72rem', color: '#fef9c3', fontWeight: '500' }}>
                                            How does HoneyBook work?
                                        </span>
                                    </div>

                                    {/* Title Text */}
                                    <div style={{
                                        fontSize: '0.88rem',
                                        fontWeight: '700',
                                        color: '#ffffff',
                                        lineHeight: 1.3,
                                        maxWidth: '175px',
                                    }}>
                                        How to use HoneyBook for {fullName}
                                    </div>
                                </div>

                                {/* Centered Play Button */}
                                <div style={{
                                    position: 'absolute',
                                    left: '52%',
                                    top: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: '38px',
                                    height: '38px',
                                    borderRadius: '50%',
                                    background: 'rgba(255, 255, 255, 0.88)',
                                    backdropFilter: 'blur(4px)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 2px 10px rgba(0,0,0,0.25)',
                                    transition: 'transform 0.18s ease',
                                }}>
                                    <Play size={15} color="#1f2937" fill="#1f2937" style={{ marginLeft: '2px' }} />
                                </div>
                            </div>

                            {/* 4 Helpful Resource Links */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                                <div
                                    onClick={() => showToast('Opening Setting up your account guide')}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        fontSize: '0.8rem',
                                        color: '#374151',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        transition: 'color 0.15s ease',
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.color = '#111827'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.color = '#374151'; }}
                                >
                                    <FileText size={15} color="#4b5563" />
                                    <span>Setting up your account</span>
                                </div>

                                <div
                                    onClick={() => showToast('Connect with a HoneyBook Pro expert')}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        fontSize: '0.8rem',
                                        color: '#374151',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        transition: 'color 0.15s ease',
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.color = '#111827'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.color = '#374151'; }}
                                >
                                    <Award size={15} color="#4b5563" />
                                    <span>Hire a HoneyBook pro</span>
                                </div>

                                <div
                                    onClick={() => showToast('Opening HoneyBook Community')}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        fontSize: '0.8rem',
                                        color: '#374151',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        transition: 'color 0.15s ease',
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.color = '#111827'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.color = '#374151'; }}
                                >
                                    <Users size={15} color="#4b5563" />
                                    <span>Join the HoneyBook community</span>
                                </div>

                                <div
                                    onClick={() => showToast('Opening Help Center')}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        fontSize: '0.8rem',
                                        color: '#374151',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        transition: 'color 0.15s ease',
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.color = '#111827'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.color = '#374151'; }}
                                >
                                    <HelpCircle size={15} color="#4b5563" />
                                    <span>Visit the Help Center</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom-Right Floating Help Circle Button */}
            <button
                onClick={() => showToast('Need help? Visit the Help Center or contact support')}
                style={{
                    position: 'fixed',
                    bottom: '24px',
                    right: '24px',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#111827',
                    color: '#ffffff',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    zIndex: 40,
                }}
                title="Help & Resources"
            >
                ?
            </button>

            {/* Video Modal Walkthrough */}
            {isVideoModalOpen && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.65)',
                    backdropFilter: 'blur(3px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '1.5rem',
                }}>
                    <div style={{
                        background: '#ffffff',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        maxWidth: '740px',
                        width: '100%',
                        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)',
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '1rem 1.5rem',
                            borderBottom: '1px solid #e5e7eb',
                        }}>
                            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: '#111827' }}>
                                How to use HoneyBook for {fullName}
                            </h3>
                            <button
                                onClick={() => setIsVideoModalOpen(false)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#6b7280',
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '4px',
                                }}
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div style={{
                            padding: '2rem',
                            background: '#0f172a',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: '340px',
                            color: '#ffffff',
                            textAlign: 'center',
                        }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '50%',
                                background: 'rgba(255, 255, 255, 0.15)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '1.25rem',
                            }}>
                                <Play size={28} color="#ffffff" fill="#ffffff" style={{ marginLeft: '4px' }} />
                            </div>
                            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.15rem', fontWeight: '600' }}>
                                Interactive Studio CRM Tour
                            </h4>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', maxWidth: '420px', lineHeight: 1.5 }}>
                                Learn how to configure your project stages, customize proposals, and send bookings in less than 3 minutes.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Notification Toast */}
            {activeToast && (
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
                    animation: 'fadeIn 0.2s ease',
                }}>
                    <Check size={14} color="#10b981" />
                    <span>{activeToast}</span>
                </div>
            )}
        </div>
    );
}
