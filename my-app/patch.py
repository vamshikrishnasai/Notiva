import re

with open('d:/note-app/my-app/app/page.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. State updates
text = re.sub(
    r"const \[sidebarOpen, setSidebarOpen\]   = useState\(true\);\s*const \[listOpen, setListOpen\]         = useState\(true\);",
    "const [sidebarOpen, setSidebarOpen]   = useLocalStorageState('notiva_sidebar', { defaultValue: true });\n  const [listOpen, setListOpen]         = useState(true);\n  const [isMobile, setIsMobile]         = useState(false);\n  const [expandedNotebooks, setExpandedNotebooks] = useState<string[]>(['My Notebook']);",
    text
)

text = re.sub(
    r"const \[fontSize, setFontSize\]         = useState\(15\);",
    "const [fontSize, setFontSize]         = useState(16);\n  const [fontFamily, setFontFamily]     = useState('var(--font-ui)');\n  const [showFontDropdown, setShowFontDropdown] = useState(false);",
    text
)

# 2. Add Resizer
text = text.replace(
    "// Pre-load synthesis voices",
    """// Window resizing
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1000;
      setIsMobile(mobile);
      if (mobile) { setSidebarOpen(false); setListOpen(false); }
      else { setSidebarOpen(true); setListOpen(true); }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Init
    return () => window.removeEventListener('resize', handleResize);
  }, [setSidebarOpen]);

  // Pre-load synthesis voices"""
)

# 3. Logo updates
old_logo = r"<div style={{ width:30, height:30, background:'linear-gradient\(135deg, #8b5cf6, #a78bfa\)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:'0 0 20px rgba\(139,92,246,0.15\)' }}>.*?SECOND BRAIN</div>\s*</div>\s*</div>"
new_logo = """<div style={{ width:30, height:30, background:'linear-gradient(135deg, var(--accent), var(--violet))', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:'0 0 20px rgba(67,56,202,0.15)' }}>
                  <span style={{ color:'#fff', fontWeight:700, fontSize:'1.1rem', fontFamily:'var(--font-brand)', marginTop:-1 }}>N</span>
                </div>
                <div>
                  <div className="brand-text" style={{ fontSize:'1.1rem', marginTop:-2 }}>Notiva<span style={{color:'var(--accent)'}}>.</span></div>
                  <div className="brand-subtitle" style={{ marginTop:-3, letterSpacing:'0.15em' }}>SECOND BRAIN</div>
                </div>
              </div>"""
text = re.sub(old_logo, new_logo, text, flags=re.DOTALL)

# 4. Notebook tree
notebooks_block = r"\{Array\.from\(new Set\(items\.map\(i => i\.notebook \|\| 'My Notebook'\)\.concat\(\[activeNotebook\]\)\)\)\.sort\(\)\.map\(nb => \(\s*<div.*?</button>\s*\{nb !== 'My Notebook.*?</div>\s*\)\)\}"
new_notebooks_block = """{Array.from(new Set(items.map(i => i.notebook || 'My Notebook').concat([activeNotebook]))).sort().map(nb => {
                const isExpanded = expandedNotebooks.includes(nb);
                const nbItems = items.filter(i => (i.notebook || 'My Notebook') === nb);
                const sections = Array.from(new Set(nbItems.map(i => i.tags?.split(',')[0].trim() || 'General'))).sort();
                return (
                 <div key={nb} style={{ position:'relative', marginBottom:2 }}>
                  <div style={{ display:'flex', alignItems:'center' }}
                    onMouseEnter={e => { const child = e.currentTarget.querySelector('.trash-btn'); if(child) (child as HTMLElement).style.opacity = '1'; }}
                    onMouseLeave={e => { const child = e.currentTarget.querySelector('.trash-btn'); if(child) (child as HTMLElement).style.opacity = '0'; }}>
                    <button className={`nav-item ${activeNotebook === nb ? 'active' : ''}`} onClick={() => { setActiveNotebook(nb); setExpandedNotebooks(prev => prev.includes(nb) ? prev.filter(x=>x!==nb) : [...prev, nb]); }} style={{ flex:1, paddingLeft:8 }}>
                      <ChevronRight size={14} style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition:'transform 0.15s', color:'var(--text-muted)' }} />
                      <span style={{ color: activeNotebook === nb ? 'var(--emerald)' : 'var(--text-muted)', display:'flex' }}><BookOpen size={14}/></span>
                      <span style={{ fontWeight: activeNotebook===nb ? 600 : 500, color: activeNotebook===nb ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{nb}</span>
                    </button>
                    {nb !== 'My Notebook' && (
                      <button className="trash-btn" onClick={(e) => handleDeleteNotebook(nb, e)} style={{ position:'absolute', right:8, top:'50%', transform:'translateY(-50%)', background:'var(--bg-hover)', border:'none', color:'var(--red)', cursor:'pointer', borderRadius:'var(--radius-sm)', padding:'4px', opacity:0, transition:'opacity 0.2s', display:'flex', alignItems:'center', justifyContent:'center' }} title={`Delete ${nb}`}>
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                  <AnimatePresence>
                   {isExpanded && (
                     <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} style={{overflow:'hidden'}}>
                       <div style={{ paddingLeft:20, marginTop:2, display:'flex', flexDirection:'column', gap:1 }}>
                         {sections.map(sec => {
                            const secItems = nbItems.filter(i => (i.tags?.split(',')[0].trim() || 'General') === sec);
                            return (
                              <div key={sec}>
                                <div style={{ fontSize:'11px', fontWeight:600, color:'var(--text-muted)', padding:'6px 12px', display:'flex', alignItems:'center', justifyContent:'space-between' }} onMouseEnter={e=>(e.currentTarget.lastElementChild as HTMLElement).style.opacity='1'} onMouseLeave={e=>(e.currentTarget.lastElementChild as HTMLElement).style.opacity='0'}>
                                  <span>{sec}</span>
                                  <button onClick={()=> { setFormData(prev=>({...prev, tags: sec, notebook: nb, title:'', content:''})); handleCreateNew(); }} className="glass-btn icon-only" style={{padding:2, opacity:0, background:'var(--bg-hover)'}} title="+ New Page"><Plus size={12}/></button>
                                </div>
                                <div style={{ display:'flex', flexDirection:'column', gap:1, borderLeft:'1px solid var(--border)', marginLeft:6, paddingLeft:4 }}>
                                  {secItems.map(item => (
                                    <button key={item.id} onClick={(e)=>{ e.stopPropagation(); selectNote(item); if(isMobile) setSidebarOpen(false); }} className={`nav-item ${selectedId===item.id ? 'active':''}`} style={{ padding:'4px 8px', height:'auto', minHeight:28 }}>
                                      <FileText size={12} style={{ color:'var(--text-faint)', flexShrink:0 }} />
                                      <span style={{ fontSize:'12.5px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', color: selectedId===item.id ? 'var(--accent)' : 'var(--text-secondary)' }}>{item.title || 'Untitled'}</span>
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
              })}"""
text = re.sub(notebooks_block, new_notebooks_block, text, flags=re.DOTALL)

with open('d:/note-app/my-app/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
