"use client";
import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BrainCircuit, X, RefreshCw, Sparkles, Send, Loader2, Clock, MessageSquare } from 'lucide-react';
import type { ChatMessage } from './types';

interface ChatPanelProps {
  chatOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  chatInput: string;
  setChatInput: (v: string) => void;
  chatLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onClear: () => void;
}

const AIResponse = ({ text }: { text: string }) => (
  <div className="md-render" style={{ fontSize: '0.875rem' }}>
    <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
  </div>
);

const suggested = ['Summarize my notes', 'What are my key insights?', 'Explain in simple words', 'List main topics'];

export default function ChatPanel({ chatOpen, onClose, messages, chatInput, setChatInput, chatLoading, onSubmit, onClear }: ChatPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            key="chat"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 400, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="chat-panel"
          >
            {/* Header */}
            <div className="chat-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="chat-avatar">
                  <BrainCircuit size={13} color="var(--accent)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.8375rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                    Notiva AI
                  </div>
                  <div style={{ fontSize: '0.625rem', color: 'var(--emerald)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--emerald)', display: 'inline-block' }} />
                    RAG · Your notes only
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <button onClick={onClear} className="glass-btn icon-only" title="Clear chat"><RefreshCw size={13} /></button>
                <button onClick={onClose} className="glass-btn icon-only"><X size={15} /></button>
              </div>
            </div>

            {/* Context hint */}
            <div style={{ padding: '8px 16px', background: 'var(--accent-muted)', borderBottom: '1px solid var(--accent-border)', flexShrink: 0 }}>
              <p style={{ fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={11} />Ask about summaries, key points, or any topic in your knowledge base
              </p>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {messages.map((msg, i) => (
                <div key={i} className="bubble-in" style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: 4 }}>
                  {msg.role === 'user' ? (
                    <div className="chat-bubble-user">{msg.text}</div>
                  ) : (
                    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', maxWidth: '96%' }}>
                      <div className="chat-avatar" style={{ marginTop: 2, flexShrink: 0 }}>
                        <BrainCircuit size={12} color="var(--accent)" />
                      </div>
                      <div className="chat-bubble-ai">
                        <AIResponse text={msg.text} />
                      </div>
                    </div>
                  )}
                  {msg.timestamp && (
                    <span style={{ fontSize: '0.6rem', color: 'var(--text-faint)', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Clock size={9} />{msg.timestamp}
                    </span>
                  )}
                </div>
              ))}

              {chatLoading && (
                <div className="bubble-in" style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div className="chat-avatar" style={{ flexShrink: 0 }}>
                    <BrainCircuit size={12} color="var(--accent)" />
                  </div>
                  <div className="chat-bubble-ai" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Loader2 size={13} color="var(--accent)" className="animate-spin" />
                    <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Searching your knowledge base…</span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggested queries */}
            {messages.length === 1 && (
              <div style={{ padding: '10px 16px', display: 'flex', flexWrap: 'wrap', gap: 6, borderTop: '1px solid var(--border)', flexShrink: 0 }}>
                {suggested.map(q => (
                  <button key={q} onClick={() => setChatInput(q)}
                    style={{ fontSize: '0.72rem', background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-full)', padding: '5px 12px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500, transition: 'all 0.15s' }}
                    onMouseOver={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-border)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; (e.currentTarget as HTMLElement).style.background = 'var(--accent-muted)'; }}
                    onMouseOut={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; (e.currentTarget as HTMLElement).style.background = 'var(--bg-surface)'; }}
                  >{q}</button>
                ))}
              </div>
            )}

            {/* Input */}
            <form onSubmit={onSubmit} style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', flexShrink: 0, display: 'flex', gap: 8, alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <textarea
                  value={chatInput}
                  onChange={e => { setChatInput(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px'; }}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSubmit(e as any); } }}
                  placeholder="Ask about your notes…"
                  rows={1}
                  style={{ width: '100%', background: 'var(--bg-surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '10px 14px', color: 'var(--text-primary)', fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none', resize: 'none', lineHeight: 1.5, maxHeight: 100, overflow: 'auto', transition: 'border-color 0.2s' }}
                  onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-glow)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
              <button type="submit" disabled={chatLoading || !chatInput.trim()}
                style={{ width: 40, height: 40, flexShrink: 0, background: 'var(--accent)', border: 'none', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', opacity: (chatLoading || !chatInput.trim()) ? 0.4 : 1, boxShadow: '0 2px 8px var(--accent-glow)' }}>
                <Send size={15} color="#fff" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB when closed */}
      {!chatOpen && (
        <motion.button
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
          onClick={() => { /* handled by parent */ }}
          style={{ position: 'fixed', bottom: 28, right: 28, width: 52, height: 52, background: 'var(--brand-gradient)', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 8px 28px rgba(99,102,241,0.4)', zIndex: 50 }}
          title="Open Notiva AI"
          id="chat-fab"
        >
          <MessageSquare size={20} color="#fff" />
        </motion.button>
      )}
    </>
  );
}
