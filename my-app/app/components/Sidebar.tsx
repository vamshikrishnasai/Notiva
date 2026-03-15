"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, Clock, FileText, Book, Link as LinkIcon, GraduationCap,
  Star, Archive, BookOpen, Plus, ChevronRight, Sparkles, Trash2, User, Network
} from 'lucide-react';
import type { KnowledgeItem, SidebarView } from './types';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  activeView: SidebarView;
  setActiveView: (v: SidebarView) => void;
  activeNotebook: string;
  setActiveNotebook: (nb: string) => void;
  items: KnowledgeItem[];
  selectedId: number | null;
  selectNote: (item: KnowledgeItem) => void;
  onNewNote: (notebook?: string, section?: string) => void;
  onNewNotebook: () => void;
  onDeleteNotebook: (nb: string, e?: React.MouseEvent) => void;
  onChatOpen: () => void;
  onProfileOpen: () => void;
  userName: string;
  userInitial: string;
}

const navBoards = [
  { view: 'recent'   as SidebarView, label: 'Recent',      icon: <Clock size={15}/>,          color: '#10b981' },
  { view: 'notes'    as SidebarView, label: 'Notes',        icon: <FileText size={15}/>,       color: '#6366f1' },
  { view: 'articles' as SidebarView, label: 'Articles',     icon: <Book size={15}/>,           color: '#06b6d4' },
  { view: 'links'    as SidebarView, label: 'Links',        icon: <LinkIcon size={15}/>,       color: '#14b8a6' },
  { view: 'research' as SidebarView, label: 'Research',     icon: <GraduationCap size={15}/>,  color: '#f59e0b' },
];

const navOrganize = [
  { view: 'starred'  as SidebarView, label: 'Starred',  icon: <Star size={15}/>,    color: '#f59e0b' },
  { view: 'archived' as SidebarView, label: 'Archived', icon: <Archive size={15}/>, color: '#8888aa' },
];

export default function Sidebar({
  sidebarOpen, setSidebarOpen, activeView, setActiveView,
  activeNotebook, setActiveNotebook, items, selectedId,
  selectNote, onNewNote, onNewNotebook, onDeleteNotebook,
  onChatOpen, onProfileOpen, userName, userInitial
}: SidebarProps) {
  const [expandedNotebooks, setExpandedNotebooks] = useState<string[]>(['My Notebook']);

  const notebooks = Array.from(
    new Set(items.map(i => i.notebook || 'My Notebook').concat([activeNotebook]))
  ).sort();

  const toggleNotebook = (nb: string) => {
    setExpandedNotebooks(prev =>
      prev.includes(nb) ? prev.filter(x => x !== nb) : [...prev, nb]
    );
  };

  return (
    <AnimatePresence initial={false}>
      {sidebarOpen && (
        <motion.aside
          key="sidebar"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 260, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          className="sidebar"
        >
          {/* Logo Row */}
          <div className="sidebar-logo">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft:40,marginTop:10,marginBottom:25 }}>
              <img src="/notiva_logo.png" alt="Notiva Logo" width={102} height={102} style={{ borderRadius: 8 }} />
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="glass-btn icon-only"
              title="Collapse sidebar"
            >
              <Menu size={14} />
            </button>
          </div>

          {/* Nav */}
          <div className="sidebar-nav">
            {/* Boards */}
            <div className="nav-section-title nav-section-title:first-child" style={{ marginTop: 4 }}>Boards</div>
            {navBoards.map(nav => (
              <button
                key={nav.view}
                className={`nav-item ${activeView === nav.view ? 'active' : ''}`}
                onClick={() => setActiveView(nav.view)}
              >
                <span className="nav-item-icon" style={{ color: activeView === nav.view ? nav.color : 'var(--text-muted)' }}>{nav.icon}</span>
                <span>{nav.label}</span>
                {activeView === nav.view && <ChevronRight size={12} style={{ marginLeft: 'auto', color: 'var(--text-muted)' }} />}
              </button>
            ))}

            {/* Organize */}
            <div className="nav-section-title">Organize</div>
            {navOrganize.map(nav => (
              <button
                key={nav.view}
                className={`nav-item ${activeView === nav.view ? 'active' : ''}`}
                onClick={() => setActiveView(nav.view)}
              >
                <span className="nav-item-icon" style={{ color: activeView === nav.view ? nav.color : 'var(--text-muted)' }}>{nav.icon}</span>
                <span>{nav.label}</span>
              </button>
            ))}

            {/* Notebooks */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px', marginTop: 20, marginBottom: 6 }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Notebooks</span>
              <button onClick={onNewNotebook} className="glass-btn icon-only" style={{ padding: 3, color: 'var(--text-muted)' }} title="New Notebook">
                <Plus size={13} />
              </button>
            </div>

            {notebooks.map(nb => {
              const isExpanded = expandedNotebooks.includes(nb);
              const nbItems = items.filter(i => (i.notebook || 'My Notebook') === nb);
              // Group pages by first tag as "section"
              const sections = Array.from(
                new Set(nbItems.map(i => i.tags?.split(',')[0]?.trim() || 'General'))
              ).sort();

              return (
                <div key={nb} style={{ position: 'relative', marginBottom: 2 }}>
                  <div
                    style={{ display: 'flex', alignItems: 'center' }}
                    onMouseEnter={e => {
                      const btn = e.currentTarget.querySelector('.trash-nb') as HTMLElement; if (btn) btn.style.opacity = '1';
                      const secBtn = e.currentTarget.querySelector('.add-sec-nb') as HTMLElement; if (secBtn) secBtn.style.opacity = '1';
                    }}
                    onMouseLeave={e => {
                      const btn = e.currentTarget.querySelector('.trash-nb') as HTMLElement; if (btn) btn.style.opacity = '0';
                      const secBtn = e.currentTarget.querySelector('.add-sec-nb') as HTMLElement; if (secBtn) secBtn.style.opacity = '0';
                    }}
                  >
                    <button
                      className={`nav-item ${activeNotebook === nb ? 'active' : ''}`}
                      onClick={() => { setActiveNotebook(nb); toggleNotebook(nb); setActiveView('all'); }}
                      style={{ flex: 1 }}
                    >
                      <ChevronRight size={13} style={{ color: 'var(--text-muted)', flexShrink: 0, transition: 'transform 0.15s', transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }} />
                      <span className="nav-item-icon" style={{ color: activeNotebook === nb ? 'var(--emerald)' : 'var(--text-muted)' }}><BookOpen size={14} /></span>
                      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: activeNotebook === nb ? 600 : 450 }}>{nb}</span>
                      <span style={{ fontSize: 10, color: 'var(--text-faint)', background: 'var(--bg-surface)', borderRadius: 'var(--radius-full)', padding: '1px 6px' }}>{nbItems.length}</span>
                    </button>
                    <button
                      className="add-sec-nb"
                      onClick={e => {
                        e.stopPropagation();
                        const secName = prompt(`New section in ${nb}:`);
                        if (secName?.trim()) {
                          onNewNote(nb, secName.trim());
                          if (!expandedNotebooks.includes(nb)) toggleNotebook(nb);
                        }
                      }}
                      style={{ position: 'absolute', right: nb !== 'My Notebook' ? 32 : 8, top: '50%', transform: 'translateY(-50%)', background: 'var(--bg-hover)', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', borderRadius: 'var(--radius-sm)', padding: '4px', opacity: 0, transition: 'opacity 0.2s', display: 'flex' }}
                      title={`New Section in ${nb}`}
                    >
                      <Plus size={11} />
                    </button>
                    {nb !== 'My Notebook' && (
                      <button
                        className="trash-nb"
                        onClick={e => onDeleteNotebook(nb, e)}
                        style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'var(--bg-hover)', border: 'none', color: 'var(--red)', cursor: 'pointer', borderRadius: 'var(--radius-sm)', padding: '4px', opacity: 0, transition: 'opacity 0.2s', display: 'flex' }}
                        title={`Delete ${nb}`}
                      >
                        <Trash2 size={11} />
                      </button>
                    )}
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ paddingLeft: 18, marginTop: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                          {sections.map(sec => {
                            const secItems = nbItems.filter(i => (i.tags?.split(',')[0]?.trim() || 'General') === sec);
                            return (
                              <div key={sec}>
                                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', padding: '5px 10px', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                                  onMouseEnter={e => { const btn = e.currentTarget.lastElementChild as HTMLElement; if (btn) btn.style.opacity = '1'; }}
                                  onMouseLeave={e => { const btn = e.currentTarget.lastElementChild as HTMLElement; if (btn) btn.style.opacity = '0'; }}
                                >
                                  <span>§ {sec}</span>
                                  <button onClick={() => onNewNote(nb, sec === 'General' ? '' : sec)} className="glass-btn icon-only" style={{ padding: 2, opacity: 0, transition: 'opacity 0.15s' }} title="New page"><Plus size={11} /></button>
                                </div>
                                <div style={{ borderLeft: '1px solid var(--border)', marginLeft: 8, paddingLeft: 6, display: 'flex', flexDirection: 'column', gap: 1 }}>
                                  {secItems.map(item => (
                                    <button
                                      key={item.id}
                                      onClick={() => selectNote(item)}
                                      className={`nav-tree-item ${selectedId === item.id ? 'active' : ''}`}
                                    >
                                      <FileText size={11} style={{ color: 'var(--text-faint)', flexShrink: 0 }} />
                                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title || 'Untitled'}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            {/* Library */}
            <div className="nav-section-title">Library</div>
            <button className={`nav-item ${activeView === 'all' ? 'active' : ''}`} onClick={() => setActiveView('all')}>
              <span className="nav-item-icon" style={{ color: activeView === 'all' ? 'var(--accent)' : 'var(--text-muted)' }}><BookOpen size={15} /></span>
              <span>All Items</span>
            </button>
            <button className={`nav-item ${activeView === 'graph' ? 'active' : ''}`} onClick={() => setActiveView('graph')}>
              <span className="nav-item-icon" style={{ color: activeView === 'graph' ? '#ec4899' : 'var(--text-muted)' }}><Network size={15} /></span>
              <span>Knowledge Graph</span>
            </button>
          </div>

          {/* AI Button */}
          <button className="sidebar-ai-btn" onClick={onChatOpen}>
            <Sparkles size={15} />
            <span>Notiva AI</span>
            <div className="pulse-dot" />
          </button>

          {/* User row */}
          <div style={{ borderTop: '1px solid var(--border)', padding: '10px 10px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={onProfileOpen}
              style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'transparent', border: 'none', cursor: 'pointer', flex: 1, padding: '6px 8px', borderRadius: 'var(--radius-md)', transition: 'background 0.15s' }}
              onMouseOver={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
              onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--brand-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 700 }}>{userInitial}</span>
              </div>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userName}</span>
              <User size={13} style={{ color: 'var(--text-muted)', marginLeft: 'auto', flexShrink: 0 }} />
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
