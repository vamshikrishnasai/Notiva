"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Loader2, Sparkles } from 'lucide-react';
import useLocalStorageState from 'use-local-storage-state';

import Landing from './components/Landing';
import Auth from './components/Auth';
import Profile from './components/Profile';
import Sidebar from './components/Sidebar';
import NoteList from './components/NoteList';
import Editor from './components/Editor';
import ChatPanel from './components/ChatPanel';
import GraphView from './components/GraphView';

import type { KnowledgeItem, ChatMessage, FormData, SortBy, SidebarView, UserData, ItemType } from './components/types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";

type AppView = 'landing' | 'login' | 'signup' | 'app';

const defaultForm: FormData = {
  title: '', content: '', type: 'note', tags: '',
  is_pinned: false, is_starred: false, is_archived: false, notebook: 'My Notebook'
};

export default function NotivaApp() {
  // ── App State ─────────────────────────────────────────────
  const [appView, setAppView] = useLocalStorageState<AppView>('notiva_view', { defaultValue: 'landing' });
  const [user, setUser] = useLocalStorageState<UserData | null>('notiva_user', { defaultValue: null });

  // ── Items ─────────────────────────────────────────────────
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);

  // ── Navigation ────────────────────────────────────────────
  const [activeView, setActiveView] = useState<SidebarView>('all');
  const [activeNotebook, setActiveNotebook] = useState('My Notebook');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('date');

  // ── Layout ────────────────────────────────────────────────
  const [sidebarOpen, setSidebarOpen] = useLocalStorageState('notiva_sidebar', { defaultValue: true });
  const [listOpen, setListOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useLocalStorageState('notiva_dark', { defaultValue: false });
  const [profileOpen, setProfileOpen] = useState(false);

  // ── Editor ────────────────────────────────────────────────
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>(defaultForm);
  const [fontSize, setFontSize] = useState(15);
  const [fontFamily, setFontFamily] = useState('inherit');
  const [isSaving, setIsSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [aiActionLoading, setAiActionLoading] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [ttsState, setTtsState] = useState<'stopped' | 'playing' | 'paused'>('stopped');
  const [isScraping, setIsScraping] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // ── Chat ──────────────────────────────────────────────────
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'ai', text: "## Hello! I'm **Notiva AI** 👋\n\nI'm connected to your personal knowledge base. Ask me anything about your **notes, summaries, key points, or any topic you've captured**.\n\nI'll answer based only on what you've written — no guessing!", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  // ── Command Palette ───────────────────────────────────────
  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmdSearch, setCmdSearch] = useState('');

  // ── Refs ──────────────────────────────────────────────────
  const autoSaveRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recognitionRef = useRef<any>(null);
  const ttsEngineRef = useRef<'native' | 'fallback'>('native');
  const fallbackAudioRef = useRef<HTMLAudioElement | null>(null);
  const fallbackQueueRef = useRef<string[]>([]);

  // ─────────────────────────────────────────────────────────
  // Effects
  // ─────────────────────────────────────────────────────────

  useEffect(() => {
    if (isDarkMode) document.body.classList.add('dark-mode');
    else document.body.classList.remove('dark-mode');
  }, [isDarkMode]);


  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }
  }, []);

  // Auto-save
  useEffect(() => {
    if (!formData.title.trim() || !formData.content.trim()) return;
    if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
    autoSaveRef.current = setTimeout(() => handleSave(true), 3000);
    return () => { if (autoSaveRef.current) clearTimeout(autoSaveRef.current); };
  }, [formData]);

  // ─────────────────────────────────────────────────────────
  // Fetch
  // ─────────────────────────────────────────────────────────
  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const typeMap: Record<string, string> = { notes: 'note', articles: 'article', links: 'link', research: 'research' };
      let url = `${API_BASE}/notes/?skip=0&limit=200`;
      const mapped = typeMap[activeView];
      if (mapped) url += `&type=${mapped}`;
      if (searchQuery.trim()) url += `&search=${encodeURIComponent(searchQuery)}`;
      const res = await axios.get(url);
      setItems(res.data);
    } catch { } finally { setLoading(false); }
  }, [activeView, searchQuery]);

  useEffect(() => { const t = setTimeout(fetchItems, 300); return () => clearTimeout(t); }, [fetchItems]);

  // ─────────────────────────────────────────────────────────
  // Filtered list
  // ─────────────────────────────────────────────────────────
  const filteredItems = items
    .filter(item => {
      if ((item.notebook || 'My Notebook') !== activeNotebook) return false;
      if (activeView === 'starred') return item.is_starred && !item.is_archived;
      if (activeView === 'archived') return item.is_archived;
      return !item.is_archived;
    })
    .sort((a, b) => {
      if (activeView === 'recent' || sortBy === 'date') return b.id - a.id;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'pinned') return (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0);
      return b.id - a.id;
    });

  // ─────────────────────────────────────────────────────────
  // CRUD
  // ─────────────────────────────────────────────────────────
  const handleCreateNew = useCallback(async (nbOverride?: string | any, secOverride?: string | any) => {
    setSelectedId(null);
    const typeForView: Record<string, ItemType> = { notes: 'note', articles: 'article', links: 'link', research: 'research' };
    
    const validNb = typeof nbOverride === 'string' ? nbOverride : activeNotebook;
    const validSec = typeof secOverride === 'string' ? secOverride : '';

    const nf = { 
      ...defaultForm, 
      type: typeForView[activeView] ?? 'note', 
      notebook: validNb, 
      tags: validSec 
    };
    setFormData(nf);

    // Auto-save so the new notebook/section persists immediately instead of disappearing if you click away
    if (nbOverride || secOverride) {
      setIsSaving(true);
      try {
        const res = await axios.post(`${API_BASE}/notes/`, { ...nf, title: 'Untitled Document' });
        setSelectedId(res.data.id);
        fetchItems();
      } catch (err) { console.error('Error auto-creating item:', err); }
      finally { setIsSaving(false); }
    }
  }, [activeView, activeNotebook, fetchItems]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setCmdOpen(o => !o); }
      if (e.key === 'Escape') { setCmdOpen(false); setProfileOpen(false); }
      
      // Power User Shortcuts
      if (e.altKey) {
        if (e.key.toLowerCase() === 'n') { e.preventDefault(); handleCreateNew(); }
        if (e.key.toLowerCase() === 'd') { e.preventDefault(); setIsDarkMode(prev => !prev); }
        if (e.key.toLowerCase() === 'c') { e.preventDefault(); setChatOpen(prev => !prev); }
        if (e.key.toLowerCase() === 'f') { 
          e.preventDefault(); 
          const searchInput = document.querySelector('.search-input') as HTMLInputElement; 
          if (searchInput) searchInput.focus();
        }
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [handleCreateNew, setIsDarkMode, setChatOpen]);

  const selectNote = (item: KnowledgeItem) => {
    setSelectedId(item.id);
    setFormData({ title: item.title, content: item.content, type: item.type, tags: item.tags || '', is_pinned: item.is_pinned || false, is_starred: item.is_starred || false, is_archived: item.is_archived || false, notebook: item.notebook || 'My Notebook' });
    setShowPreview(false);
  };

  const handleSave = async (silent = false) => {
    if (!formData.title.trim() || !formData.content.trim()) return;
    if (!silent) setIsSaving(true);
    try {
      if (selectedId) {
        await axios.put(`${API_BASE}/notes/${selectedId}`, formData);
      } else {
        const res = await axios.post(`${API_BASE}/notes/`, formData);
        setSelectedId(res.data.id);
      }
      if (!silent) { setSavedFlash(true); setTimeout(() => setSavedFlash(false), 2000); fetchItems(); }
    } catch (err: any) {
      if (err.response?.status === 404) setSelectedId(null);
    } finally { if (!silent) setIsSaving(false); }
  };

  const handleDelete = async (id?: number) => {
    const targetId = id ?? selectedId;
    if (!targetId) return;
    if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
    try {
      await axios.delete(`${API_BASE}/notes/${targetId}`);
      if (selectedId === targetId) handleCreateNew();
      fetchItems();
    } catch { }
  };

  const handleDeleteNotebook = async (nb: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!confirm(`Delete notebook "${nb}" and ALL its notes? This cannot be undone.`)) return;
    if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
    try {
      await axios.delete(`${API_BASE}/notes/notebook/${encodeURIComponent(nb)}`);
      if (activeNotebook === nb) { setActiveNotebook('My Notebook'); handleCreateNew(); }
      fetchItems();
    } catch { alert('Failed to delete notebook.'); }
  };

  // ─────────────────────────────────────────────────────────
  // AI Actions
  // ─────────────────────────────────────────────────────────
  const runAiAction = async (action: 'bullets' | 'flow' | 'tags') => {
    if (!formData.content.trim()) return;
    setAiActionLoading(action);
    try {
      const res = await axios.post(`${API_BASE}/query/${action}`, { content: formData.content });
      if (action === 'tags') {
        setFormData(p => ({ ...p, tags: res.data.result }));
      } else {
        const label = action === 'bullets' ? 'Key Points' : 'Logical Flow';
        setFormData(p => ({ ...p, content: p.content + `\n\n---\n\n## ${label}\n\n${res.data.result}` }));
      }
      setTimeout(() => handleSave(true), 200);
    } catch { alert('AI action failed. Check backend connection.'); }
    finally { setAiActionLoading(null); }
  };

  const handleTranslate = async (lang: string) => {
    if (!formData.content.trim()) return;
    setAiActionLoading('translate');
    try {
      const res = await axios.post(`${API_BASE}/query/translate`, { content: formData.content, target_language: lang });
      setFormData(p => ({ ...p, content: res.data.result }));
      setTimeout(() => handleSave(true), 200);
    } catch { alert('Translation failed.'); }
    finally { setAiActionLoading(null); }
  };

  // ─────────────────────────────────────────────────────────
  // Voice
  // ─────────────────────────────────────────────────────────
  const toggleVoice = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return alert('Voice input not supported in this browser.');
    if (isRecording) { recognitionRef.current?.stop(); setIsRecording(false); return; }
    const r = new SR();
    r.continuous = true; r.interimResults = false; r.lang = 'en-US';
    r.onresult = (ev: any) => { const t = Array.from(ev.results as any[]).map((r: any) => r[0].transcript).join(' '); setFormData(p => ({ ...p, content: p.content + (p.content ? ' ' : '') + t })); };
    r.onend = () => setIsRecording(false);
    recognitionRef.current = r; r.start(); setIsRecording(true);
  };

  // ─────────────────────────────────────────────────────────
  // TTS
  // ─────────────────────────────────────────────────────────
  const detectLang = (text: string) => {
    if (/[\u0900-\u097F]/.test(text)) return 'hi-IN';
    if (/[\u0980-\u09FF]/.test(text)) return 'bn-IN';
    if (/[\u0B80-\u0BFF]/.test(text)) return 'ta-IN';
    if (/[\u0C00-\u0C7F]/.test(text)) return 'te-IN';
    if (/[\u0C80-\u0CFF]/.test(text)) return 'kn-IN';
    if (/[\u0D00-\u0D7F]/.test(text)) return 'ml-IN';
    if (/[\u4E00-\u9FFF]/.test(text)) return 'zh-CN';
    if (/[\u3040-\u30FF]/.test(text)) return 'ja-JP';
    if (/[\uAC00-\uD7AF]/.test(text)) return 'ko-KR';
    return 'en-US';
  };

  const playNextChunk = () => {
    if (!fallbackQueueRef.current.length) { setTtsState('stopped'); return; }
    const chunk = fallbackQueueRef.current.shift()!;
    const lang = detectLang(formData.content).split('-')[0];
    const audio = new Audio(`${API_BASE}/query/tts?text=${encodeURIComponent(chunk)}&lang=${lang}`);
    fallbackAudioRef.current = audio;
    audio.onended = playNextChunk;
    audio.onerror = playNextChunk;
    audio.play().catch(() => setTtsState('stopped'));
  };

  const handlePlayTTS = () => {
    if (!formData.content.trim()) return;
    if (ttsState === 'paused') {
      if (ttsEngineRef.current === 'native') window.speechSynthesis.resume();
      else fallbackAudioRef.current?.play();
      setTtsState('playing'); return;
    }
    window.speechSynthesis.cancel();
    const lang = detectLang(formData.content);
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.toLowerCase().startsWith(lang.split('-')[0]));
    if (voice) {
      ttsEngineRef.current = 'native';
      const u = new SpeechSynthesisUtterance(formData.content);
      u.lang = lang; u.voice = voice;
      u.onend = () => setTtsState('stopped');
      window.speechSynthesis.speak(u);
    } else {
      ttsEngineRef.current = 'fallback';
      fallbackQueueRef.current = (formData.content.match(/.{1,150}(?:\s|$)|\S+(?:\s|$)/g) || []).map(c => c.trim()).filter(Boolean);
      playNextChunk();
    }
    setTtsState('playing');
  };

  const handlePauseTTS = () => {
    if (ttsEngineRef.current === 'native') window.speechSynthesis.pause();
    else fallbackAudioRef.current?.pause();
    setTtsState('paused');
  };

  const handleStopTTS = () => {
    if (ttsEngineRef.current === 'native') window.speechSynthesis.cancel();
    else { fallbackAudioRef.current?.pause(); fallbackQueueRef.current = []; }
    setTtsState('stopped');
  };

  // ─────────────────────────────────────────────────────────
  // URL / File
  // ─────────────────────────────────────────────────────────
  const handleUrlScrape = async (url: string) => {
    if (!url.trim()) return;
    setIsScraping(true);
    try {
      const res = await axios.post(`${API_BASE}/query/scrape`, { url });
      if (res.data.text) setFormData(p => ({ ...p, title: p.title || 'Linked Source', content: p.content + (p.content ? '\n\n' : '') + res.data.text }));
    } catch { alert('Failed to fetch URL.'); }
    finally { setIsScraping(false); }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setIsUploading(true);
    const fd = new window.FormData(); fd.append('file', file);
    try {
      const res = await axios.post(`${API_BASE}/query/upload`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (res.data.text) setFormData(p => ({ ...p, title: p.title || file.name, content: p.content + (p.content ? '\n\n' : '') + res.data.text }));
    } catch { alert('Upload failed.'); }
    finally { setIsUploading(false); if (e.target) e.target.value = ''; }
  };

  // ─────────────────────────────────────────────────────────
  // Chat
  // ─────────────────────────────────────────────────────────
  const askAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput.trim();
    const ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages(p => [...p, { role: 'user', text: userMsg, timestamp: ts }]);
    setChatInput(''); setChatLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/query/ask`, { question: userMsg });
      const aiTs = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setChatMessages(p => [...p, { role: 'ai', text: res.data.answer, timestamp: aiTs }]);
    } catch {
      setChatMessages(p => [...p, { role: 'ai', text: "I couldn't connect to the knowledge engine. Please ensure the backend is running.", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    } finally { setChatLoading(false); }
  };

  const clearChat = () => setChatMessages([{ role: 'ai', text: "## Hello again! 👋\nAsk me anything about your notes.", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);

  // ─────────────────────────────────────────────────────────
  // Export
  // ─────────────────────────────────────────────────────────
  const handleExport = (fmt: 'txt' | 'md') => {
    const content = formData.title ? `# ${formData.title}\n\n${formData.content}` : formData.content;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([content], { type: 'text/plain' }));
    a.download = `${formData.title || 'note'}.${fmt}`; a.click();
  };

  // ─────────────────────────────────────────────────────────
  // Auth handlers
  // ─────────────────────────────────────────────────────────
  const handleAuthSuccess = (userData: UserData) => { setUser(userData); setAppView('app'); };
  const handleLogout = () => { setUser(null); setAppView('landing'); };

  // ─────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────

  // Landing
  if (appView === 'landing') {
    return <Landing onLogin={() => setAppView('login')} onSignup={() => setAppView('signup')} isDark={isDarkMode} toggleDark={() => setIsDarkMode(!isDarkMode)} />;
  }

  // Auth
  if (appView === 'login' || appView === 'signup') {
    return <Auth mode={appView} onSuccess={handleAuthSuccess} onSwitch={() => setAppView(appView === 'login' ? 'signup' : 'login')} onBack={() => setAppView('landing')} />;
  }

  // Main App
  return (
    <div className="app-root">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={!!sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeView={activeView}
        setActiveView={setActiveView}
        activeNotebook={activeNotebook}
        setActiveNotebook={nb => { setActiveNotebook(nb); setActiveView('all'); }}
        items={items}
        selectedId={selectedId}
        selectNote={selectNote}
        onNewNote={handleCreateNew}
        onNewNotebook={() => { const name = prompt('New Notebook name:'); if (name?.trim()) { setActiveNotebook(name.trim()); setActiveView('all'); handleCreateNew(name.trim()); } }}
        onDeleteNotebook={handleDeleteNotebook}
        onChatOpen={() => setChatOpen(true)}
        onProfileOpen={() => setProfileOpen(true)}
        userName={user?.name ?? 'Guest'}
        userInitial={(user?.name ?? 'G')[0].toUpperCase()}
      />

      {/* Note List / Graph / Editor */}
      {activeView === 'graph' ? (
        <GraphView 
          items={items} 
          isDark={!!isDarkMode}
          sidebarOpen={!!sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          onNodeClick={(id) => {
            const item = items.find(i => i.id === id);
            if (item) {
              setActiveView('all');
              selectNote(item);
            }
          }}
        />
      ) : (
        <>
          <NoteList
            items={filteredItems}
            loading={loading}
            selectedId={selectedId}
            activeView={activeView}
            sidebarOpen={!!sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            listOpen={listOpen}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onSelect={selectNote}
            onNew={handleCreateNew}
            onDelete={handleDelete}
          />

          <Editor
            formData={formData}
            setFormData={setFormData}
            selectedId={selectedId}
            isSaving={isSaving}
            savedFlash={savedFlash}
            aiActionLoading={aiActionLoading}
            showPreview={showPreview}
            setShowPreview={setShowPreview}
            fontSize={fontSize}
            setFontSize={setFontSize}
            fontFamily={fontFamily}
            setFontFamily={setFontFamily}
            isRecording={isRecording}
            ttsState={ttsState}
            sidebarOpen={!!sidebarOpen}
            listOpen={listOpen}
            isDarkMode={!!isDarkMode}
            toggleSidebar={() => { setSidebarOpen(true); setListOpen(true); }}
            toggleFocus={() => { setSidebarOpen(false); setListOpen(false); }}
            toggleDark={() => setIsDarkMode(!isDarkMode)}
            onSave={() => handleSave(false)}
            onDelete={() => handleDelete()}
            runAiAction={runAiAction}
            onTranslate={handleTranslate}
            onVoice={toggleVoice}
            onPlayTTS={handlePlayTTS}
            onPauseTTS={handlePauseTTS}
            onStopTTS={handleStopTTS}
            onExport={handleExport}
            onUrlScrape={handleUrlScrape}
            isScraping={isScraping}
            onFileUpload={handleFileUpload}
            isUploading={isUploading}
          />
        </>
      )}

      {/* Chat Panel */}
      <ChatPanel
        chatOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        messages={chatMessages}
        chatInput={chatInput}
        setChatInput={setChatInput}
        chatLoading={chatLoading}
        onSubmit={askAI}
        onClear={clearChat}
      />

      {/* FAB — open chat */}
      {!chatOpen && (
        <motion.button
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
          onClick={() => setChatOpen(true)}
          style={{ position: 'fixed', bottom: 28, right: 28, width: 52, height: 52, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 8px 28px rgba(99,102,241,0.42)', zIndex: 50 }}
          title="Open Notiva AI"
        >
          <Sparkles size={20} color="#fff" />
        </motion.button>
      )}

      {/* Recording indicator */}
      {isRecording && (
        <div style={{ position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '999px', padding: '8px 22px', display: 'flex', alignItems: 'center', gap: 10, zIndex: 100, backdropFilter: 'blur(12px)' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--red)', display: 'inline-block', animation: 'pulse-glow 1s ease infinite' }} />
          <span style={{ fontSize: '0.825rem', color: 'var(--red)', fontWeight: 600 }}>Recording… Click mic to stop</span>
        </div>
      )}

      {/* Command Palette */}
      <AnimatePresence>
        {cmdOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'var(--bg-overlay)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '14vh' }}
            onClick={() => setCmdOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -16 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="cmd-palette modal-box"
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', alignItems: 'center', padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
                <Search size={16} style={{ color: 'var(--text-faint)' }} />
                <input autoFocus placeholder="Type a command or search notes…" value={cmdSearch} onChange={e => setCmdSearch(e.target.value)} style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '0.95rem', marginLeft: 12, fontFamily: 'inherit' }} />
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', background: 'var(--bg-surface)', padding: '2px 6px', borderRadius: 4, border: '1px solid var(--border)', fontWeight: 700 }}>ESC</span>
              </div>
              <div style={{ maxHeight: 360, overflowY: 'auto', padding: 8 }}>
                {cmdSearch.trim() ? (
                  items.filter(i => (i.title || '').toLowerCase().includes(cmdSearch.toLowerCase()) || (i.content || '').toLowerCase().includes(cmdSearch.toLowerCase())).slice(0, 8).map(item => (
                    <button key={item.id} className="dropdown-item" style={{ borderRadius: 'var(--radius-md)', padding: '10px 14px' }} onClick={() => { selectNote(item); setCmdOpen(false); }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.title || 'Untitled'}</span>
                    </button>
                  ))
                ) : (
                  <div style={{ padding: '4px 8px' }}>
                    <div className="section-label" style={{ marginTop: 4 }}>Actions</div>
                    {[
                      { label: 'New Note', shortcut: 'Alt+N', action: () => { handleCreateNew(); setCmdOpen(false); } },
                      { label: 'Open Notiva AI', shortcut: 'Alt+C', action: () => { setChatOpen(true); setCmdOpen(false); } },
                      { label: `Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`, shortcut: 'Alt+D', action: () => { setIsDarkMode(!isDarkMode); setCmdOpen(false); } },
                      { label: 'Search Notes', shortcut: 'Alt+F', action: () => { 
                          setCmdOpen(false); 
                          setTimeout(() => {
                            const searchInput = document.querySelector('.search-input') as HTMLInputElement; 
                            if (searchInput) searchInput.focus();
                          }, 100);
                        } 
                      },
                      { label: 'My Profile', shortcut: '', action: () => { setProfileOpen(true); setCmdOpen(false); } },
                    ].map(cmd => (
                      <button key={cmd.label} className="dropdown-item" style={{ borderRadius: 'var(--radius-md)', padding: '10px 14px', fontWeight: 500, display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }} onClick={cmd.action}>
                        <span>{cmd.label}</span>
                        {cmd.shortcut && <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', background: 'var(--bg-elevated)', padding: '3px 6px', borderRadius: 4, border: '1px solid var(--border)' }}>{cmd.shortcut}</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile */}
      {profileOpen && (
        <Profile
          user={user ?? { name: 'Guest', email: 'guest@notiva.app' }}
          onClose={() => setProfileOpen(false)}
          onLogout={handleLogout}
          isDark={!!isDarkMode}
          toggleDark={() => setIsDarkMode(!isDarkMode)}
          noteCount={items.length}
          starredCount={items.filter(i => i.is_starred).length}
        />
      )}
    </div>
  );
}


