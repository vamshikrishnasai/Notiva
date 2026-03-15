"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowLeft, Sparkles, BrainCircuit, BookOpen, Zap } from 'lucide-react';

interface AuthProps {
  mode: 'login' | 'signup';
  onSuccess: (user: { name: string; email: string }) => void;
  onSwitch: () => void;
  onBack: () => void;
}

const highlights = [
  { icon: <BrainCircuit size={18} />, text: 'RAG-Powered AI Chat' },
  { icon: <BookOpen size={18} />, text: 'Organized Notebook Hierarchy' },
  { icon: <Zap size={18} />, text: 'AI Summaries & Translation' },
];

export default function Auth({ mode, onSuccess, onSwitch, onBack }: AuthProps) {
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.email.trim() || !form.password.trim()) { setError('Please fill all fields.'); return; }
    if (mode === 'signup' && !form.name.trim()) { setError('Please enter your name.'); return; }
    setLoading(true);
    // Simulate auth delay
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    onSuccess({ name: form.name || form.email.split('@')[0], email: form.email });
  };

  return (
    <div className="auth-page" style={{ background: 'var(--bg-base)' }}>
      {/* Left - Form */}
      <div className="auth-left">
        <div className="auth-form-box">
          <button onClick={onBack} className="glass-btn" style={{ marginBottom: 32, padding: '7px 12px', gap: 6, color: 'var(--text-muted)' }}>
            <ArrowLeft size={14} /> Back
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
            <img src="/notiva_logo.png" alt="Notiva Logo" width={36} height={36} style={{ borderRadius: 10, boxShadow: '0 4px 12px rgba(99,102,241,0.35)' }} />
            <span className="brand-name" style={{ fontSize: '1.25rem' }}>Notiva</span>
          </div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-brand)', letterSpacing: '-0.025em', color: 'var(--text-primary)', marginBottom: 8 }}>
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: 32, fontSize: '0.9rem' }}>
              {mode === 'login' ? 'Sign in to your Notiva workspace.' : 'Start building your second brain today.'}
            </p>

            {error && (
              <div style={{ background: 'var(--red-muted)', border: '1px solid rgba(239,68,68,0.25)', color: 'var(--red)', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: '0.85rem', marginBottom: 20 }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {mode === 'signup' && (
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Full Name</label>
                  <input
                    type="text"
                    className="auth-input"
                    placeholder="Alex Johnson"
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    autoFocus
                  />
                </div>
              )}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Email address</label>
                <input
                  type="email"
                  className="auth-input"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  autoFocus={mode === 'login'}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPass ? 'text' : 'password'}
                    className="auth-input"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    style={{ paddingRight: 44 }}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-cta" disabled={loading}
                style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '0.95rem', marginTop: 8, opacity: loading ? 0.7 : 1 }}>
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 0.8s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                    {mode === 'login' ? 'Signing in…' : 'Creating account…'}
                  </span>
                ) : (
                  mode === 'login' ? 'Sign In' : 'Create Account'
                )}
              </button>
            </form>

            <p style={{ marginTop: 24, fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button onClick={onSwitch} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }}>
                {mode === 'login' ? 'Sign up free' : 'Sign in'}
              </button>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right - Brand Panel */}
      <div className="auth-right">
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(0,0,0,0.1) 0%, transparent 50%)' }} />
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}
        >
          <div style={{ width: 56, height: 56, background: 'rgba(255,255,255,0.2)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', backdropFilter: 'blur(10px)' }}>
            <Sparkles size={26} color="#fff" />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-brand)', letterSpacing: '-0.02em', marginBottom: 16, lineHeight: 1.2 }}>
            Your Knowledge,<br />Magnified by AI
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: 36 }}>
            Notiva turns scattered notes into an intelligent, searchable, AI-ready knowledge base.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {highlights.map(h => (
              <div key={h.text} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.12)', borderRadius: 12, padding: '12px 16px', backdropFilter: 'blur(8px)' }}>
                <div style={{ color: 'rgba(255,255,255,0.85)' }}>{h.icon}</div>
                <span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 500 }}>{h.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
