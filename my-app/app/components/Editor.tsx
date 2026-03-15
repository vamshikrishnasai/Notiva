"use client";
import { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  List, GitMerge, Tag, Languages,
  Download, Mic, MicOff, Play, Pause, Square, BookOpen, Pin, Star,
  Archive, Trash2, CheckCircle2, Loader2, Globe, UploadCloud,
  Plus, X, Menu, Maximize2, Moon, Sun, ChevronDown, Type, Save
} from 'lucide-react';
import type { FormData, ItemType } from './types';

interface EditorProps {
  formData: FormData;
  setFormData: (fn: (prev: FormData) => FormData) => void;
  selectedId: number | null;
  isSaving: boolean;
  savedFlash: boolean;
  aiActionLoading: string | null;
  showPreview: boolean;
  setShowPreview: (v: boolean) => void;
  fontSize: number;
  setFontSize: (n: number) => void;
  fontFamily: string;
  setFontFamily: (f: string) => void;
  isRecording: boolean;
  ttsState: 'stopped' | 'playing' | 'paused';
  sidebarOpen: boolean;
  listOpen: boolean;
  isDarkMode: boolean;
  toggleSidebar: () => void;
  toggleFocus: () => void;
  toggleDark: () => void;
  onSave: () => void;
  onDelete: () => void;
  runAiAction: (action: 'bullets' | 'flow' | 'tags') => void;
  onTranslate: (lang: string) => void;
  onVoice: () => void;
  onPlayTTS: () => void;
  onPauseTTS: () => void;
  onStopTTS: () => void;
  onExport: (fmt: 'txt' | 'md') => void;
  onUrlScrape: (url: string) => void;
  isScraping: boolean;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
}

const fonts = [
  { name: 'Default', val: 'inherit' },
  { name: 'Caveat Brush', val: "'Caveat Brush', cursive" },
  { name: 'Times New Roman', val: "'Times New Roman', Times, serif" },
  { name: 'Arial', val: 'Arial, sans-serif' },
  { name: 'Georgia', val: 'Georgia, serif' },
  { name: 'Monospace', val: "'JetBrains Mono', 'Fira Code', monospace" },
];

const langs = ['Arabic','Bengali','Chinese','Dutch','English','French','German','Greek','Gujarati','Hindi','Indonesian','Italian','Japanese','Kannada','Korean','Malay','Malayalam','Marathi','Nepali','Norwegian','Odia','Polish','Portuguese','Punjabi','Romanian','Russian','Spanish','Swahili','Swedish','Tamil','Telugu','Thai','Turkish','Urdu','Vietnamese'];

const AIResponse = ({ text, fontFamily }: { text: string; fontFamily?: string }) => (
  <div className="md-render" style={fontFamily && fontFamily !== 'inherit' ? { fontFamily } : undefined}>
    <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
  </div>
);

export default function Editor({
  formData, setFormData, selectedId, isSaving, savedFlash, aiActionLoading,
  showPreview, setShowPreview, fontSize, setFontSize, fontFamily, setFontFamily,
  isRecording, ttsState, sidebarOpen, listOpen, isDarkMode,
  toggleSidebar, toggleFocus, toggleDark,
  onSave, onDelete, runAiAction, onTranslate, onVoice,
  onPlayTTS, onPauseTTS, onStopTTS, onExport,
  onUrlScrape, isScraping, onFileUpload, isUploading,
}: EditorProps) {
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [langSearch, setLangSearch] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);



  const fontLabel = fonts.find(f => f.val === fontFamily)?.name ?? 'Font';

  return (
    <div className="editor-area">
      {/* Toolbar */}
      <div className="editor-topbar">
        {/* Left controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          {(!sidebarOpen || !listOpen) && (
            <button className="glass-btn" aria-label="Open Panels" onClick={toggleSidebar} style={{ gap: 5 }}>
              <Menu size={14} /> Panels
            </button>
          )}
          {sidebarOpen && listOpen && (
            <button className="glass-btn" aria-label="Zen Mode Focus" onClick={toggleFocus} style={{ gap: 5 }}>
              <Maximize2 size={13} /> Focus
            </button>
          )}
          <div className="toolbar-divider" />
          <button className="theme-toggle" aria-label="Toggle theme" onClick={toggleDark} title="Toggle theme">
            <span className="theme-toggle-thumb" />
          </button>
        </div>

        <div className="toolbar-divider" />

        {/* AI Actions */}
        <div style={{ display: 'flex', gap: 2, alignItems: 'center', flexShrink: 0 }}>
          <button className="glass-btn" disabled={!!aiActionLoading || !formData.content.trim()} onClick={() => runAiAction('bullets')} title="Key Points" style={{ color: 'var(--accent)', fontSize: '0.775rem' }}>
            {aiActionLoading === 'bullets' ? <Loader2 size={12} className="animate-spin" /> : <List size={12} />} Points
          </button>
          <button className="glass-btn" disabled={!!aiActionLoading || !formData.content.trim()} onClick={() => runAiAction('flow')} title="Logical Flow" style={{ color: 'var(--cyan)', fontSize: '0.775rem' }}>
            {aiActionLoading === 'flow' ? <Loader2 size={12} className="animate-spin" /> : <GitMerge size={12} />} Flow
          </button>
          <button className="glass-btn" disabled={!!aiActionLoading || !formData.content.trim()} onClick={() => runAiAction('tags')} title="Auto Tags" style={{ color: 'var(--amber)', fontSize: '0.775rem' }}>
            {aiActionLoading === 'tags' ? <Loader2 size={12} className="animate-spin" /> : <Tag size={12} />} Tags
          </button>

          {/* Translate */}
          <div style={{ position: 'relative' }}>
            <button className="glass-btn" disabled={!!aiActionLoading || !formData.content.trim()} onClick={() => { setShowLangDropdown(!showLangDropdown); setShowFontDropdown(false); setLangSearch(''); }} title="Translate" style={{ color: 'var(--pink)', fontSize: '0.775rem' }}>
              {aiActionLoading === 'translate' ? <Loader2 size={12} className="animate-spin" /> : <Languages size={12} />} Translate
            </button>
            {showLangDropdown && (
              <div className="dropdown-menu" style={{ minWidth: 200 }}>
                <input type="text" autoFocus placeholder="Search language…" value={langSearch} onChange={e => setLangSearch(e.target.value)} className="input-base" style={{ padding: '7px 10px', fontSize: '0.8rem', marginBottom: 4 }} />
                {langs.filter(l => l.toLowerCase().includes(langSearch.toLowerCase())).map(l => (
                  <button key={l} className="dropdown-item" onClick={() => { onTranslate(l); setShowLangDropdown(false); }}>Translate to {l}</button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="toolbar-divider" />

        {/* Font */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <button className="glass-btn" aria-label="Change font" aria-haspopup="true" aria-expanded={showFontDropdown} onClick={() => { setShowFontDropdown(!showFontDropdown); setShowLangDropdown(false); }} style={{ gap: 4, fontSize: '0.775rem', minWidth: 108 }}>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 80 }}>{fontLabel}</span>
            <ChevronDown size={11} style={{ color: 'var(--text-faint)', flexShrink: 0 }} />
          </button>
          {showFontDropdown && (
            <div className="dropdown-menu" style={{ width: 190 }}>
              {fonts.map(f => (
                <button key={f.val} className="dropdown-item" onClick={() => { setFontFamily(f.val); setShowFontDropdown(false); if (f.name === 'Caveat Brush') { const l = document.createElement('link'); l.href = 'https://fonts.googleapis.com/css2?family=Caveat+Brush&display=swap'; document.head.appendChild(l); } }}>
                  <span style={{ fontFamily: f.val, fontSize: '13px' }}>{f.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Font size */}
        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', padding: '2px 6px', border: '1px solid var(--border)', flexShrink: 0 }}>
          <Type size={11} style={{ color: 'var(--text-faint)', marginRight: 4 }} />
          <select value={fontSize} onChange={e => setFontSize(Number(e.target.value))} style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '0.75rem', cursor: 'pointer' }}>
            {[12, 13, 14, 15, 16, 18, 20, 22, 24].map(sz => <option key={sz} value={sz}>{sz}</option>)}
          </select>
        </div>

        <div className="toolbar-divider" />

        {/* Voice / TTS */}
        <div style={{ display: 'flex', gap: 3, alignItems: 'center', flexShrink: 0 }}>
          <button className="glass-btn icon-only" onClick={onVoice} style={{ color: isRecording ? 'var(--red)' : 'var(--text-secondary)' }} title={isRecording ? 'Stop recording' : 'Voice input'}>
            {isRecording ? <MicOff size={14} /> : <Mic size={14} />}
          </button>
          <div style={{ display: 'flex', gap: 1, background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', padding: 2, border: '1px solid var(--border)' }}>
            {ttsState === 'playing' ? (
              <button className="glass-btn icon-only" onClick={onPauseTTS} style={{ color: 'var(--cyan)', padding: 5 }} title="Pause"><Pause size={12} /></button>
            ) : (
              <button className="glass-btn icon-only" onClick={onPlayTTS} disabled={!formData.content.trim()} style={{ color: formData.content.trim() ? 'var(--emerald)' : 'var(--text-faint)', padding: 5 }} title="Read Aloud"><Play size={12} /></button>
            )}
            {ttsState !== 'stopped' && (
              <button className="glass-btn icon-only" onClick={onStopTTS} style={{ color: 'var(--red)', padding: 5 }} title="Stop"><Square size={11} fill="currentColor" /></button>
            )}
          </div>
        </div>

        <div className="toolbar-divider" />
        <button className="glass-btn" onClick={() => setShowPreview(!showPreview)} style={{ color: showPreview ? 'var(--accent)' : 'var(--text-secondary)', fontSize: '0.775rem', flexShrink: 0 }}>
          <BookOpen size={13} /> {showPreview ? 'Edit' : 'Preview'}
        </button>
        <button className="glass-btn icon-only" onClick={() => onExport('md')} title="Export Markdown" style={{ flexShrink: 0 }}>
          <Download size={13} />
        </button>

        {/* Right side */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <button className={`glass-btn icon-only ${formData.is_pinned ? 'active' : ''}`} onClick={() => setFormData(p => ({ ...p, is_pinned: !p.is_pinned }))} title="Pin" style={{ borderRadius: 0, padding: '6px 8px' }}>
              <Pin size={13} style={{ color: formData.is_pinned ? 'var(--accent)' : 'var(--text-faint)' }} />
            </button>
            <button className={`glass-btn icon-only ${formData.is_starred ? 'active' : ''}`} onClick={() => setFormData(p => ({ ...p, is_starred: !p.is_starred }))} title="Star" style={{ borderRadius: 0, borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)', padding: '6px 8px' }}>
              <Star size={13} fill={formData.is_starred ? '#f59e0b' : 'transparent'} style={{ color: formData.is_starred ? '#f59e0b' : 'var(--text-faint)' }} />
            </button>
            <button className={`glass-btn icon-only ${formData.is_archived ? 'active' : ''}`} onClick={() => setFormData(p => ({ ...p, is_archived: !p.is_archived }))} title="Archive" style={{ borderRadius: 0, padding: '6px 8px' }}>
              <Archive size={13} style={{ color: formData.is_archived ? 'var(--text-muted)' : 'var(--text-faint)' }} />
            </button>
          </div>

          {selectedId && (
            <button onClick={() => { if (confirming) { onDelete(); setConfirming(false); } else { setConfirming(true); setTimeout(() => setConfirming(false), 3000); }}}
              className={`glass-btn btn-confirm-delete ${confirming ? 'step-2' : 'step-1'}`}
              style={{ padding: '6px 8px', borderRadius: 'var(--radius-md)' }}
            >
              {confirming ? <span style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: 3 }}><CheckCircle2 size={11} /> Sure?</span> : <Trash2 size={13} />}
            </button>
          )}

          <div className="toolbar-divider" />

          {/* Status + Save */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {isSaving && <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}><Loader2 size={11} className="animate-spin" />Saving…</span>}
            {savedFlash && <span style={{ fontSize: '0.72rem', color: 'var(--emerald)', display: 'flex', alignItems: 'center', gap: 4 }}><CheckCircle2 size={11} />Saved</span>}
            <button className="glass-btn accent" onClick={onSave} disabled={isSaving || !formData.title.trim() || !formData.content.trim()} style={{ borderRadius: 'var(--radius-md)', padding: '6px 16px', gap: 6, fontSize: '0.8125rem' }}>
              <Save size={13} /> Save
            </button>
          </div>
        </div>
      </div>

      {/* Editor Body */}
      <div className="editor-body" id="editor-scroll">
        <div className="editor-content">
          {/* Title */}
          <textarea
            placeholder="Untitled Note…"
            value={formData.title}
            onChange={e => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; setFormData(p => ({ ...p, title: e.target.value })); }}
            className="notion-title"
            rows={1}
            style={{ display: 'block', overflow: 'hidden' }}
          />

          {/* Properties */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '14px 0', margin: '18px 0 22px' }}>
            <div className="prop-row">
              <span className="prop-label">Type</span>
              <div style={{ display: 'flex', gap: 4 }}>
                {(['note','article','link','research'] as ItemType[]).map(t => (
                  <button key={t} className={`type-pill ${formData.type === t ? 'active' : ''}`} onClick={() => setFormData(p => ({ ...p, type: t }))}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="prop-row" style={{ alignItems: 'flex-start' }}>
              <span className="prop-label" style={{ marginTop: 4 }}>Tags</span>
              <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                {formData.tags.split(',').filter(t => t.trim()).map(tag => (
                  <div key={tag} className="tag-chip" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <span>#{tag.trim()}</span>
                    <button onClick={() => setFormData(p => ({ ...p, tags: p.tags.split(',').filter(t => t.trim() !== tag.trim()).join(', ') }))}
                      style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', display: 'flex', padding: 0 }}><X size={10} /></button>
                  </div>
                ))}
                {isAddingTag ? (
                  <input ref={tagInputRef} type="text" placeholder="tag name…" autoFocus
                    onBlur={e => { setIsAddingTag(false); const v = e.target.value.replace(/,/g, '').trim(); if (v) { const cur = formData.tags.split(',').map(t => t.trim()).filter(Boolean); if (!cur.includes(v)) setFormData(p => ({ ...p, tags: cur.concat(v).join(', ') })); } }}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); const v = e.currentTarget.value.replace(/,/g, '').trim(); if (v) { const cur = formData.tags.split(',').map(t => t.trim()).filter(Boolean); if (!cur.includes(v)) setFormData(p => ({ ...p, tags: cur.concat(v).join(', ') })); } setIsAddingTag(false); } else if (e.key === 'Escape') setIsAddingTag(false); }}
                    className="input-base" style={{ padding: '3px 8px', fontSize: '0.775rem', width: 130, height: 26 }} />
                ) : (
                  <button onClick={() => setIsAddingTag(true)} className="glass-btn" style={{ padding: '2px 8px', fontSize: '0.775rem', height: 26 }}>
                    <Plus size={11} /> tag
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* URL scraper */}
          {formData.type === 'link' && (
            <div style={{ marginBottom: 22, display: 'flex', gap: 8 }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <Globe size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }} />
                <input type="url" value={urlInput} onChange={e => setUrlInput(e.target.value)} placeholder="Paste a URL to extract content…" className="input-base" style={{ paddingLeft: 34 }} />
              </div>
              <button className="glass-btn accent" onClick={() => { onUrlScrape(urlInput); setUrlInput(''); }} disabled={isScraping || !urlInput.trim()} style={{ minWidth: 90, borderRadius: 'var(--radius-md)' }}>
                {isScraping ? <Loader2 size={13} className="animate-spin" /> : <><Globe size={13} />Fetch</>}
              </button>
            </div>
          )}

          {/* File Upload */}
          {(formData.type === 'article' || formData.type === 'research') && (
            <div className="upload-zone" style={{ marginBottom: 22 }} onClick={() => fileInputRef.current?.click()}>
              <input type="file" ref={fileInputRef} onChange={onFileUpload} style={{ display: 'none' }} accept=".txt,.json,.csv,.md,.pdf,.doc,.docx,.ppt,.pptx" />
              <button className="glass-btn" disabled={isUploading} style={{ border: '1px solid var(--border)' }} onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                {isUploading ? <Loader2 size={13} className="animate-spin" /> : <UploadCloud size={13} />}
                {isUploading ? 'Reading…' : 'Upload File'}
              </button>
              <span style={{ fontSize: '0.775rem', color: 'var(--text-faint)' }}>Supports .txt, .pdf, .docx, .pptx</span>
            </div>
          )}

          {/* Content */}
          {showPreview ? (
            <div style={{ minHeight: 380, fontSize: `${fontSize}px` }}>
              <AIResponse text={formData.content || '_Nothing to preview yet…_'} fontFamily={fontFamily} />
            </div>
          ) : (
            <textarea
              id="main-editor"
              placeholder="Start writing… Notiva AI will index and embed your notes for intelligent retrieval."
              value={formData.content}
              onChange={e => setFormData(p => ({ ...p, content: e.target.value }))}
              className="notion-editor"
              style={{ width: '100%', minHeight: '50vh', fontSize: `${fontSize}px`, fontFamily: fontFamily === 'inherit' ? undefined : fontFamily }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
