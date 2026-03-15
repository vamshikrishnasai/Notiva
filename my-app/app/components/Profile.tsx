"use client";
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Camera, LogOut, Moon, Sun, FileText, Star, Clock, Palette, Bell, Shield, ChevronRight } from 'lucide-react';

interface UserData { name: string; email: string; avatar?: string; }
interface ProfileProps {
  user: UserData;
  onClose: () => void;
  onLogout: () => void;
  isDark: boolean;
  toggleDark: () => void;
  noteCount: number;
  starredCount: number;
}

const sectionStyle: React.CSSProperties = {
  borderRadius: 'var(--radius-xl)',
  border: '1px solid var(--border)',
  overflow: 'hidden',
  marginBottom: 16,
};

const rowStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '14px 18px', borderBottom: '1px solid var(--border)',
  background: 'var(--bg-elevated)',
};

const lastRowStyle: React.CSSProperties = { ...rowStyle, borderBottom: 'none' };

export default function Profile({ user, onClose, onLogout, isDark, toggleDark, noteCount, starredCount }: ProfileProps) {
  const [editName, setEditName] = useState(user.name);
  const [tab, setTab] = useState<'profile' | 'preferences' | 'account'>('profile');
  const avatarRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState(user.avatar || '');

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setAvatarUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const tabs = [
    { key: 'profile', label: 'Profile' },
    { key: 'preferences', label: 'Preferences' },
    { key: 'account', label: 'Account' },
  ] as const;

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal-box"
          initial={{ opacity: 0, scale: 0.93, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 16 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: '90%', maxWidth: 520 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-elevated)' }}>
            <span style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-brand)', color: 'var(--text-primary)' }}>My Profile</span>
            <button onClick={onClose} className="glass-btn icon-only"><X size={16} /></button>
          </div>

          {/* Avatar & Name */}
          <div style={{ padding: '24px 24px 0', background: 'var(--bg-elevated)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 24 }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: 68, height: 68, borderRadius: '50%', background: avatarUrl ? 'transparent' : 'var(--brand-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: '0 4px 16px rgba(99,102,241,0.3)', border: '3px solid var(--accent-border)' }}>
                  {avatarUrl ? <img src={avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ color: '#fff', fontSize: '1.6rem', fontWeight: 800 }}>{editName[0]?.toUpperCase()}</span>}
                </div>
                <button onClick={() => avatarRef.current?.click()} style={{ position: 'absolute', bottom: 0, right: 0, width: 22, height: 22, background: 'var(--accent)', border: '2px solid var(--bg-elevated)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <Camera size={11} color="#fff" />
                </button>
                <input ref={avatarRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
              </div>
              <div style={{ flex: 1 }}>
                <input
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-brand)', width: '100%', marginBottom: 4 }}
                />
                <div style={{ fontSize: '0.83rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Mail size={12} />{user.email}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
              {[
                { label: 'Total Notes', value: noteCount, icon: <FileText size={14} />, color: 'var(--accent)' },
                { label: 'Starred', value: starredCount, icon: <Star size={14} />, color: '#f59e0b' },
                { label: 'Days Active', value: 7, icon: <Clock size={14} />, color: 'var(--emerald)' },
              ].map(s => (
                <div key={s.label} className="stat-card" style={{ textAlign: 'center' }}>
                  <div style={{ color: s.color, display: 'flex', justifyContent: 'center', marginBottom: 6 }}>{s.icon}</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-brand)' }}>{s.value}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 2, borderBottom: '1px solid var(--border)', marginBottom: 0 }}>
              {tabs.map(t => (
                <button key={t.key} onClick={() => setTab(t.key)}
                  style={{ flex: 1, padding: '10px 0', background: 'none', border: 'none', borderBottom: tab === t.key ? '2px solid var(--accent)' : '2px solid transparent', color: tab === t.key ? 'var(--accent)' : 'var(--text-muted)', fontWeight: tab === t.key ? 600 : 400, cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: '0.85rem', transition: 'all 0.15s' }}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div style={{ padding: '16px 24px 24px', background: 'var(--bg-base)' }}>
            {tab === 'profile' && (
              <div style={sectionStyle}>
                <div style={rowStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><User size={15} color="var(--text-muted)" /><span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Display Name</span></div>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 500 }}>{editName}</span>
                </div>
                <div style={rowStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Mail size={15} color="var(--text-muted)" /><span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Email</span></div>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 500 }}>{user.email}</span>
                </div>
                <div style={lastRowStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Shield size={15} color="var(--text-muted)" /><span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Plan</span></div>
                  <span style={{ fontSize: '0.75rem', background: 'var(--accent-muted)', color: 'var(--accent)', border: '1px solid var(--accent-border)', borderRadius: 'var(--radius-full)', padding: '3px 10px', fontWeight: 600 }}>Free</span>
                </div>
              </div>
            )}

            {tab === 'preferences' && (
              <div style={sectionStyle}>
                <div style={rowStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {isDark ? <Moon size={15} color="var(--accent)" /> : <Sun size={15} color="#f59e0b" />}
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Dark Mode</span>
                  </div>
                  <button className="theme-toggle" onClick={toggleDark}><span className="theme-toggle-thumb" /></button>
                </div>
                <div style={rowStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Palette size={15} color="var(--text-muted)" /><span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Theme</span></div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {['#6366f1','#10b981','#f59e0b','#ec4899'].map(c => (
                      <div key={c} style={{ width: 20, height: 20, borderRadius: '50%', background: c, cursor: 'pointer', border: c === '#6366f1' ? '2px solid var(--text-primary)' : '2px solid transparent' }} />
                    ))}
                  </div>
                </div>
                <div style={lastRowStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Bell size={15} color="var(--text-muted)" /><span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Notifications</span></div>
                  <ChevronRight size={14} color="var(--text-faint)" />
                </div>
              </div>
            )}

            {tab === 'account' && (
              <div style={sectionStyle}>
                <div style={rowStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Shield size={15} color="var(--text-muted)" /><span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Change Password</span></div>
                  <ChevronRight size={14} color="var(--text-faint)" />
                </div>
                <div style={lastRowStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Mail size={15} color="var(--text-muted)" /><span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Export Data</span></div>
                  <ChevronRight size={14} color="var(--text-faint)" />
                </div>
              </div>
            )}

            <button onClick={onLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'var(--red-muted)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-lg)', padding: '11px', color: 'var(--red)', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'var(--font-ui)', transition: 'all 0.15s' }}
              onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.18)'; }}
              onMouseOut={e => { (e.currentTarget as HTMLElement).style.background = 'var(--red-muted)'; }}>
              <LogOut size={15} /> Sign Out
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
