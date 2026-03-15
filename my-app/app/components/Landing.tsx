"use client";
import { motion } from 'framer-motion';
import { Sparkles, BookOpen, BrainCircuit, Zap, Shield, Globe, ChevronRight, Star, ArrowRight } from 'lucide-react';

interface LandingProps {
  onLogin: () => void;
  onSignup: () => void;
  isDark: boolean;
  toggleDark: () => void;
}

const features = [
  { icon: <BrainCircuit size={22} />, color: '#6366f1', title: 'RAG-Powered AI', desc: 'Ask questions about your notes using retrieval-augmented generation. Notiva finds answers within your own knowledge base.' },
  { icon: <BookOpen size={22} />, color: '#10b981', title: 'Notebook Hierarchy', desc: 'Organize your thoughts in Notebooks → Sections → Pages. A structure that scales from quick notes to deep research.' },
  { icon: <Zap size={22} />, color: '#f59e0b', title: 'AI Enhancements', desc: 'One-click bullet points, logical flow diagrams, auto-tagging, and translation powered by Gemini AI.' },
  { icon: <Globe size={22} />, color: '#06b6d4', title: 'Web & File Import', desc: 'Scrape articles from URLs or upload PDFs, DOCX, and PPTX files. Notiva extracts and indexes the content automatically.' },
  { icon: <Shield size={22} />, color: '#8b5cf6', title: 'Private & Secure', desc: 'Your data stays on your infrastructure. Nothing leaves your servers. Full privacy by design.' },
  { icon: <Star size={22} />, color: '#ec4899', title: 'Voice & Read Aloud', desc: 'Dictate notes with voice input or have Notiva read them back to you with multi-language TTS support.' },
];

const testimonials = [
  { name: 'Priya S.', role: 'Research Scholar', text: 'Notiva transformed how I manage my research papers. The AI summaries save me hours every week.' },
  { name: 'Arjun M.', role: 'Product Manager', text: 'The notebook hierarchy and AI chat feel like having a second brain. I can find anything instantly.' },
  { name: 'Divya K.', role: 'Content Creator', text: 'Translation and voice dictation make Notiva perfect for my multilingual content workflow.' },
];

export default function Landing({ onLogin, onSignup, isDark, toggleDark }: LandingProps) {
  return (
    <div className="landing-page">
      {/* Nav */}
      <nav className="landing-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/notiva_logo.png" alt="Notiva Logo" width={32} height={32} style={{ borderRadius: 9, boxShadow: '0 4px 12px rgba(99,102,241,0.35)' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="theme-toggle" onClick={toggleDark} title="Toggle dark mode">
            <span className="theme-toggle-thumb" />
          </button>
          <button className="btn-outline" onClick={onLogin} style={{ padding: '8px 18px', fontSize: '0.875rem' }}>Log in</button>
          <button className="btn-cta" onClick={onSignup} style={{ padding: '8px 18px', fontSize: '0.875rem' }}>Get Started <ArrowRight size={14} /></button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position: 'relative', padding: '100px 40px 80px', overflow: 'hidden', textAlign: 'center' }}>
        <div className="hero-blob-1" />
        <div className="hero-blob-2" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--accent-muted)', border: '1px solid var(--accent-border)', borderRadius: 'var(--radius-full)', padding: '6px 16px', marginBottom: 28, fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 600 }}>
            <Sparkles size={13} /> AI-Powered Second Brain
          </div>
          <h1 style={{ fontSize: 'clamp(2.6rem, 5vw, 4rem)', fontWeight: 800, fontFamily: 'var(--font-brand)', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 24, color: 'var(--text-primary)' }}>
            Your Notes, Supercharged<br />
            <span className="gradient-text">with Intelligence</span>
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.72 }}>
            Notiva combines a beautiful note editor with RAG-powered AI, letting you chat with your knowledge base, translate in 50+ languages, and extract insights from any document.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-cta" onClick={onSignup} style={{ padding: '14px 32px', fontSize: '1rem' }}>
              Start for Free <ArrowRight size={16} />
            </button>
            <button className="btn-outline" onClick={onLogin} style={{ padding: '14px 28px', fontSize: '1rem' }}>
              Sign In
            </button>
          </div>
        </motion.div>

        {/* App Preview */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginTop: 64, maxWidth: 900, margin: '64px auto 0', position: 'relative' }}
        >
          <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-2xl)', boxShadow: 'var(--shadow-xl)', padding: '20px 24px', textAlign: 'left' }}>
            <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
              {['#ff5f57','#febc2e','#28c840'].map(c => (
                <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />
              ))}
            </div>
            <div style={{ display: 'flex', gap: 16, height: 320 }}>
              <div style={{ width: 200, background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', padding: 14, flexShrink: 0 }}>
                <div style={{ height: 10, background: 'var(--bg-hover)', borderRadius: 4, width: '60%', marginBottom: 16 }} />
                {[80, 65, 75, 55, 70].map((w, i) => (
                  <div key={i} style={{ height: 8, background: i === 0 ? 'var(--accent-muted)' : 'var(--bg-hover)', borderRadius: 4, width: `${w}%`, marginBottom: 10 }} />
                ))}
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ height: 22, background: 'var(--bg-surface)', borderRadius: 4, width: '50%' }} />
                {[100, 85, 92, 78, 88, 60, 95].map((w, i) => (
                  <div key={i} style={{ height: 9, background: 'var(--bg-hover)', borderRadius: 4, width: `${w}%` }} />
                ))}
              </div>
              <div style={{ width: 200, background: 'linear-gradient(135deg, var(--accent-muted), rgba(139,92,246,0.08))', border: '1px solid var(--accent-border)', borderRadius: 'var(--radius-lg)', padding: 14, flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <div style={{ width: 20, height: 20, borderRadius: 6, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BrainCircuit size={11} color="#fff" />
                  </div>
                  <div style={{ height: 8, background: 'var(--accent-border)', borderRadius: 4, width: '60%' }} />
                </div>
                {[100, 80, 90, 70].map((w, i) => (
                  <div key={i} style={{ height: 7, background: 'var(--accent-border)', borderRadius: 4, width: `${w}%`, marginBottom: 8 }} />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-brand)', letterSpacing: '-0.025em', color: 'var(--text-primary)', marginBottom: 14 }}>
            Everything you need to think clearly
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: 480, margin: '0 auto' }}>
            From quick captures to deep research — Notiva handles it all with an AI-first approach.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="feature-card"
            >
              <div style={{ width: 44, height: 44, background: `${f.color}18`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: f.color, marginBottom: 16, border: `1px solid ${f.color}30` }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.68 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '60px 40px 80px', background: 'var(--bg-surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-brand)', textAlign: 'center', marginBottom: 44, color: 'var(--text-primary)' }}>
            Loved by knowledge workers
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {testimonials.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', gap: 2, marginBottom: 14 }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={13} fill="#f59e0b" color="#f59e0b" />)}
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 18 }}>"{t.text}"</p>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>{t.name}</div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '80px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-brand)', letterSpacing: '-0.025em', color: 'var(--text-primary)', marginBottom: 16 }}>
            Ready to build your<br /><span className="gradient-text">second brain?</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 36, fontSize: '1.025rem' }}>
            Join thousands of researchers, writers, and thinkers who use Notiva to think better.
          </p>
          <button className="btn-cta" onClick={onSignup} style={{ padding: '16px 40px', fontSize: '1.05rem' }}>
            Get Started — It&apos;s Free <ChevronRight size={16} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="brand-name" style={{ fontSize: '1rem' }}>Notiva</div>
          <span>— © 2025 All rights reserved</span>
        </div>
        <span>Built with ♥ for knowledge workers</span>
      </footer>
    </div>
  );
}
