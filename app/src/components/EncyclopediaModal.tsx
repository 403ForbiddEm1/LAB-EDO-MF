import { useState } from 'react';
import { X, Search } from 'lucide-react';
import { documentationEntries, getDocsByCategory, searchDocs } from '../data/documentation';

interface EncyclopediaModalProps {
  onClose: () => void;
  initialCategory?: string;
}

const categories = [
  { id: 'malware', label: '🦠 Malware' },
  { id: 'infrastructure', label: '🏗️ Infraestructuras' },
  { id: 'mitigation', label: '🛡️ Mitigaciones' },
  { id: 'math', label: '📐 Matemáticas' },
  { id: 'guide', label: '📖 Guía' },
  { id: 'labedo', label: '🏛️ UJGH' },
] as const;

type CategoryId = typeof categories[number]['id'];

export default function EncyclopediaModal({ onClose, initialCategory = 'malware' }: EncyclopediaModalProps) {
  const [category, setCategory] = useState<string>(initialCategory);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  // ─── OBTENER ENTRADAS ──────────────────────────────────────────────
  const getEntries = () => {
    if (query) {
      return searchDocs(query);
    }
    // Caso especial: categoría 'labedo'
    if (category === 'labedo') {
      return documentationEntries.filter(d => d.id === 'doc_labedo');
    }
    // Categorías normales
    return getDocsByCategory(category as 'malware' | 'infrastructure' | 'mitigation' | 'math' | 'guide');
  };

  const entries = getEntries();

  const selected = selectedId
    ? documentationEntries.find((d) => d.id === selectedId)
    : entries[0];

  const noEntries = entries.length === 0 && !query;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div className="panel" style={{ width: '100%', maxWidth: 1100, height: '90vh', display: 'flex', flexDirection: 'column', padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-default)', paddingBottom: 12, flexShrink: 0 }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>
            📚 Enciclopedia LAB-EDO
          </span>
          <button 
            onClick={onClose} 
            style={{ 
              background: 'rgba(30,50,90,0.4)', 
              border: '1px solid var(--border-default)', 
              borderRadius: 6, 
              color: 'var(--text-secondary)', 
              cursor: 'pointer', 
              padding: '6px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(30,50,90,0.4)'; e.currentTarget.style.borderColor = 'var(--border-default)'; }}
          >
            <X size={16} /> Cerrar
          </button>
        </div>

        <div style={{ display: 'flex', gap: 10, padding: '12px 0', flexWrap: 'wrap', alignItems: 'center', flexShrink: 0 }}>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => { setCategory(c.id); setSelectedId(null); setQuery(''); }}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                border: category === c.id && !query ? '1px solid var(--accent-cyan)' : '1px solid var(--border-default)',
                background: category === c.id && !query ? 'rgba(0,212,255,0.12)' : 'var(--bg-card)',
                color: category === c.id && !query ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                fontSize: 12,
                fontWeight: category === c.id && !query ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {c.label}
            </button>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-card)', borderRadius: 6, padding: '6px 12px', border: '1px solid var(--border-default)' }}>
            <Search size={16} color="var(--text-muted)" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar en la enciclopedia..."
              style={{ 
                background: 'transparent', 
                border: 'none', 
                outline: 'none', 
                color: 'var(--text-primary)', 
                fontSize: 13, 
                width: 200,
                fontFamily: 'var(--font-ui)',
              }}
            />
            {query && (
              <button
                onClick={() => { setQuery(''); setSelectedId(null); }}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', gap: 16, minHeight: 0, borderTop: '1px solid var(--border-default)', paddingTop: 12 }}>
          {/* Lista de entradas */}
          <div style={{ 
            width: 250, 
            overflowY: 'auto', 
            borderRight: '1px solid var(--border-default)', 
            paddingRight: 12,
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(40,70,120,0.4) transparent',
          }}>
            {noEntries ? (
              <div style={{ color: 'var(--text-muted)', fontSize: 12, padding: 20, textAlign: 'center' }}>
                No hay entradas en esta categoría
              </div>
            ) : entries.length === 0 && query ? (
              <div style={{ color: 'var(--text-muted)', fontSize: 12, padding: 20, textAlign: 'center' }}>
                No se encontraron resultados para "<strong style={{ color: 'var(--text-secondary)' }}>{query}</strong>"
              </div>
            ) : (
              entries.map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => setSelectedId(entry.id)}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '10px 12px',
                    marginBottom: 4,
                    borderRadius: 6,
                    border: 'none',
                    cursor: 'pointer',
                    background: selected?.id === entry.id ? 'var(--bg-selected)' : 'transparent',
                    color: selected?.id === entry.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                    borderLeft: selected?.id === entry.id ? '3px solid var(--accent-cyan)' : '3px solid transparent',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => { if (selected?.id !== entry.id) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                  onMouseLeave={(e) => { if (selected?.id !== entry.id) e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{entry.title}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2, lineHeight: 1.3 }}>{entry.summary}</div>
                  <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>
                    {entry.tags.slice(0, 3).map((t) => (
                      <span key={t} style={{ fontSize: 8, padding: '1px 6px', borderRadius: 3, background: 'rgba(0,212,255,0.08)', color: 'var(--accent-cyan)' }}>{t}</span>
                    ))}
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Contenido de la entrada seleccionada */}
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: 8 }}>
            {selected ? (
              <>
                {selected.id === 'doc_labedo' ? (
                  // ─── VISTA ESPECIAL UNIVERSIDAD ──────────────────────────
                  <>
                    <div style={{ 
                      textAlign: 'center', 
                      padding: '16px 0 20px 0',
                      borderBottom: '2px solid var(--border-default)',
                      marginBottom: 20,
                    }}>
                      <span style={{ fontSize: 48, display: 'block', marginBottom: 6 }}>🏛️</span>
                      <h1 style={{ fontSize: 30, color: 'var(--text-primary)', margin: 0, letterSpacing: '0.05em', fontWeight: 800 }}>
                        Universidad José Gregorio Hernández
                      </h1>
                      <div style={{ fontSize: 16, color: 'var(--accent-cyan)', marginTop: 6, fontWeight: 500, letterSpacing: '0.1em' }}>
                        La Universidad de los Valores
                      </div>
                      <div style={{ width: 80, height: 2, background: 'var(--accent-cyan)', margin: '10px auto' }} />
                      <div style={{ fontSize: 18, color: 'var(--text-primary)', marginTop: 8, fontWeight: 600 }}>
                        Cátedra: Ecuaciones Diferenciales
                      </div>
                      <div style={{ fontSize: 16, color: 'var(--text-secondary)', marginTop: 4 }}>
                        Profesor: Manuel Ferreira
                      </div>
                      <div style={{ marginTop: 12, display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 12, padding: '4px 14px', borderRadius: 6, background: 'rgba(0,212,255,0.08)', color: 'var(--accent-cyan)', border: '1px solid rgba(0,212,255,0.15)' }}>
                          Ramirez Emiliangely
                        </span>
                        <span style={{ fontSize: 12, padding: '4px 14px', borderRadius: 6, background: 'rgba(0,212,255,0.08)', color: 'var(--accent-cyan)', border: '1px solid rgba(0,212,255,0.15)' }}>
                          Diaz Maria
                        </span>
                        <span style={{ fontSize: 12, padding: '4px 14px', borderRadius: 6, background: 'rgba(0,212,255,0.08)', color: 'var(--accent-cyan)', border: '1px solid rgba(0,212,255,0.15)' }}>
                          Saras Alfonso
                        </span>
                        <span style={{ fontSize: 12, padding: '4px 14px', borderRadius: 6, background: 'rgba(0,212,255,0.08)', color: 'var(--accent-cyan)', border: '1px solid rgba(0,212,255,0.15)' }}>
                          Andrade Sebastian
                        </span>
                      </div>
                    </div>

                    {selected.sections.map((sec, idx) => {
                      // Saltar las secciones que ya mostramos en el header
                      if (sec.title.includes('Universidad') || sec.title.includes('Cátedra') || sec.title.includes('Profesor') || sec.title.includes('Autores')) {
                        return null;
                      }
                      return (
                        <div key={sec.title} style={{ 
                          background: idx % 2 === 0 ? 'var(--bg-card)' : 'transparent',
                          padding: idx % 2 === 0 ? '12px 14px' : '0',
                          borderRadius: idx % 2 === 0 ? 6 : 0,
                          border: idx % 2 === 0 ? '1px solid var(--border-default)' : 'none',
                          marginBottom: 12,
                        }}>
                          <h3 style={{ fontSize: 14, color: 'var(--accent-cyan)', marginBottom: 6 }}>{sec.title}</h3>
                          <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-line', margin: 0 }}>{sec.content}</p>
                        </div>
                      );
                    })}

                    <div style={{ 
                      marginTop: 16, 
                      padding: '16px 20px', 
                      background: 'rgba(0,212,255,0.04)', 
                      borderRadius: 8, 
                      border: '1px solid rgba(0,212,255,0.1)',
                      textAlign: 'center',
                    }}>
                      <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                        © 2026 · Universidad José Gregorio Hernández · Cátedra de Ecuaciones Diferenciales
                      </span>
                    </div>
                  </>
                ) : (
                  // ─── VISTA NORMAL ────────────────────────────────────────
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <h2 style={{ fontSize: 22, color: 'var(--text-primary)', margin: 0 }}>{selected.title}</h2>
                      <span style={{ fontSize: 10, padding: '2px 10px', borderRadius: 4, background: 'rgba(0,212,255,0.08)', color: 'var(--accent-cyan)', border: '1px solid rgba(0,212,255,0.15)' }}>
                        {selected.category}
                      </span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.5 }}>{selected.summary}</p>
                    <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
                      {selected.tags.map((t) => (
                        <span key={t} style={{ fontSize: 10, padding: '2px 10px', borderRadius: 4, background: 'var(--bg-card)', color: 'var(--accent-cyan)', border: '1px solid rgba(0,212,255,0.1)' }}>{t}</span>
                      ))}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {selected.sections.map((sec, idx) => (
                        <div key={sec.title} style={{ 
                          background: idx % 2 === 0 ? 'var(--bg-card)' : 'transparent',
                          padding: idx % 2 === 0 ? '12px 14px' : '0',
                          borderRadius: idx % 2 === 0 ? 6 : 0,
                          border: idx % 2 === 0 ? '1px solid var(--border-default)' : 'none',
                        }}>
                          <h3 style={{ fontSize: 14, color: 'var(--accent-cyan)', marginBottom: 6 }}>{sec.title}</h3>
                          <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-line', margin: 0 }}>{sec.content}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontSize: 14 }}>
                {query ? 'No hay resultados para esta búsqueda' : 'Selecciona una entrada de la lista para ver su contenido'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}