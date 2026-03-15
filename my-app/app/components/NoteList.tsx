"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, FileText, Pin, Star, Archive, Trash2, CheckCircle2, ChevronDown, ChevronUp, Menu, BookOpen } from 'lucide-react';
import { useState } from 'react';
import type { KnowledgeItem, SortBy, SidebarView } from './types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface NoteListProps {
  items: KnowledgeItem[];
  loading: boolean;
  selectedId: number | null;
  activeView: SidebarView;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  listOpen: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  sortBy: SortBy;
  setSortBy: (s: SortBy) => void;
  onSelect: (item: KnowledgeItem) => void;
  onNew: () => void;
  onDelete: (id: number, e?: React.MouseEvent) => void;
}

const typeColors: Record<string, string> = {
  note: '#6366f1', article: '#06b6d4', link: '#14b8a6', research: '#f59e0b',
};

function DeleteConfirmButton({ id, onConfirm }: { id: number; onConfirm: (id: number) => void }) {
  const [confirming, setConfirming] = useState(false);
  return (
    <button
      onClick={e => { e.stopPropagation(); if (confirming) onConfirm(id); else { setConfirming(true); setTimeout(() => setConfirming(false), 3000); }}}
      className={`glass-btn btn-confirm-delete ${confirming ? 'step-2' : 'step-1'}`}
      style={{ padding: '5px 7px', borderRadius: 'var(--radius-sm)' }}
      title="Delete"
    >
      {confirming
        ? <span style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: 3 }}><CheckCircle2 size={10} /> Sure?</span>
        : <Trash2 size={12} />}
    </button>
  );
}

function NoteListSkeleton() {
  return (
    <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {[1,2,3,4,5].map(i => (
        <div key={i} style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', padding: 14, border: '1px solid var(--border)' }}>
          <div className="shimmer" style={{ height: 12, width: '60%', marginBottom: 10, borderRadius: 4 }} />
          <div className="shimmer" style={{ height: 10, width: '85%', marginBottom: 6, borderRadius: 4 }} />
          <div className="shimmer" style={{ height: 10, width: '45%', borderRadius: 4 }} />
        </div>
      ))}
    </div>
  );
}

export default function NoteList({
  items, loading, selectedId, activeView, sidebarOpen, setSidebarOpen,
  listOpen, searchQuery, setSearchQuery, sortBy, setSortBy,
  onSelect, onNew, onDelete,
}: NoteListProps) {
  const viewLabel =
    activeView === 'all' ? 'All Notes' :
    activeView === 'recent' ? 'Recent' :
    activeView.charAt(0).toUpperCase() + activeView.slice(1);

  return (
    <AnimatePresence initial={false}>
      {listOpen && (
        <motion.div
          key="notelist"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 300, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          className="notelist-panel"
        >
          {/* Header */}
          <div className="notelist-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {!sidebarOpen && (
                <button aria-label="Open Panels" onClick={() => setSidebarOpen(true)} className="glass-btn icon-only">
                  <Menu size={14} />
                </button>
              )}
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                {viewLabel}
              </span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', background: 'var(--bg-surface)', padding: '2px 7px', borderRadius: 'var(--radius-full)', fontWeight: 700, border: '1px solid var(--border)' }}>
                {items.length}
              </span>
            </div>
            <button onClick={onNew} className="glass-btn accent" style={{ padding: '5px 12px', gap: 5, borderRadius: 'var(--radius-lg)', fontSize: '0.775rem' }}>
              <Plus size={13} /> New
            </button>
          </div>

          {/* Search + Sort */}
          <div className="notelist-search">
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)', pointerEvents: 'none' }} />
              <input
                type="text"
                placeholder="Search notes…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="segmented-control">
              {(['date', 'title', 'pinned'] as SortBy[]).map(s => (
                <button key={s} onClick={() => setSortBy(s)} className={`segmented-btn ${sortBy === s ? 'active' : ''}`}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px 10px 16px' }}>
            {loading ? <NoteListSkeleton /> : items.length === 0 ? (
              <div className="empty-state">
                <div style={{ width: 52, height: 52, background: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
                  <BookOpen size={22} style={{ color: 'var(--text-faint)' }} />
                </div>
                <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)' }}>No notes yet</p>
                <p style={{ fontSize: '0.775rem', color: 'var(--text-faint)' }}>Click "+ New" to create one</p>
                <button onClick={onNew} className="glass-btn accent" style={{ marginTop: 8, padding: '8px 20px', borderRadius: 'var(--radius-lg)', fontSize: '0.8rem' }}>
                  <Plus size={13} /> Create Note
                </button>
              </div>
            ) : (
              items.map(item => (
                <div
                  key={item.id}
                  className={`note-item ${selectedId === item.id ? 'active' : ''}`}
                  onClick={() => onSelect(item)}
                >
                  {item.is_pinned && <Pin size={10} style={{ position: 'absolute', top: 10, right: 10, color: 'var(--accent)' }} />}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
                    <span style={{ display: 'flex', flexShrink: 0 }}>
                      <FileText size={13} style={{ color: typeColors[item.type] ?? 'var(--text-muted)' }} />
                    </span>
                    <span style={{ fontSize: '0.8375rem', fontWeight: 650, color: 'var(--text-primary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: '-0.01em' }}>
                      {item.title || 'Untitled'}
                    </span>
                    {item.is_starred && <Star size={10} fill="#f59e0b" color="#f59e0b" style={{ flexShrink: 0 }} />}
                    {item.is_archived && <Archive size={10} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />}
                  </div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', lineHeight: 1.6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', marginBottom: item.tags ? 8 : 0 }}>
                    {item.summary || item.content}
                  </div>
                  {item.tags && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {item.tags.split(',').slice(0, 2).map(t => t.trim()).filter(Boolean).map(tag => (
                        <span key={tag} className="tag-chip">#{tag}</span>
                      ))}
                    </div>
                  )}
                  <div className="action-row" style={{ position: 'absolute', right: 10, bottom: 10 }}>
                    <DeleteConfirmButton id={item.id} onConfirm={id => onDelete(id)} />
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
