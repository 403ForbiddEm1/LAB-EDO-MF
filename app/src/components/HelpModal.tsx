import { X } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
}

export default function HelpModal({ onClose }: HelpModalProps) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div className="panel" style={{ width: '100%', maxWidth: 750, maxHeight: '90vh', display: 'flex', flexDirection: 'column', padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-default)', paddingBottom: 12, flexShrink: 0 }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>❓ Ayuda y Controles</span>
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

        <div style={{ flex: 1, padding: '16px 4px', overflowY: 'auto' }}>
          
          {/* ─── CONTROLES ────────────────────────────────────────────── */}
          <h3 style={{ fontSize: 16, color: '#00D4FF', marginBottom: 10, marginTop: 0 }}>🎮 Controles en la topología</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
            <div style={{ background: 'var(--bg-card)', padding: 12, borderRadius: 6, border: '1px solid var(--border-default)' }}>
              <span style={{ color: '#22C55E', fontSize: 22 }}>🖱️</span>
              <span style={{ color: 'var(--text-primary)', display: 'block', fontSize: 12, fontWeight: 600, marginTop: 4 }}>Click izquierdo</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>💾 Backup en el nodo</span>
              <span style={{ color: 'rgba(100,116,139,0.4)', fontSize: 9, display: 'block', marginTop: 2 }}>Recupera el nodo (rojo→azul)</span>
            </div>
            <div style={{ background: 'var(--bg-card)', padding: 12, borderRadius: 6, border: '1px solid var(--border-default)' }}>
              <span style={{ color: '#3B82F6', fontSize: 22 }}>🖱️🖱️</span>
              <span style={{ color: 'var(--text-primary)', display: 'block', fontSize: 12, fontWeight: 600, marginTop: 4 }}>Doble click izquierdo</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>🔧 Parchear nodo</span>
              <span style={{ color: 'rgba(100,116,139,0.4)', fontSize: 9, display: 'block', marginTop: 2 }}>Corrige vulnerabilidades</span>
            </div>
            <div style={{ background: 'var(--bg-card)', padding: 12, borderRadius: 6, border: '1px solid var(--border-default)' }}>
              <span style={{ color: '#F97316', fontSize: 22 }}>🖱️</span>
              <span style={{ color: 'var(--text-primary)', display: 'block', fontSize: 12, fontWeight: 600, marginTop: 4 }}>Click derecho</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>🔍 Escanear nodo</span>
              <span style={{ color: 'rgba(100,116,139,0.4)', fontSize: 9, display: 'block', marginTop: 2 }}>Detecta troyanos y rootkits</span>
            </div>
            <div style={{ background: 'var(--bg-card)', padding: 12, borderRadius: 6, border: '1px solid var(--border-default)' }}>
              <span style={{ color: '#EAB308', fontSize: 22 }}>🖱️🖱️</span>
              <span style={{ color: 'var(--text-primary)', display: 'block', fontSize: 12, fontWeight: 600, marginTop: 4 }}>Doble click derecho</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>🔒 Aislar nodo</span>
              <span style={{ color: 'rgba(100,116,139,0.4)', fontSize: 9, display: 'block', marginTop: 2 }}>Desconecta el nodo (amarillo)</span>
            </div>
          </div>

          {/* ─── CONTROLES GLOBALES ───────────────────────────────────── */}
          <h3 style={{ fontSize: 16, color: '#00D4FF', marginBottom: 10 }}>📦 Controles globales</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 20 }}>
            <div style={{ background: 'var(--bg-card)', padding: 10, borderRadius: 6, border: '1px solid var(--border-default)', textAlign: 'center' }}>
              <span style={{ fontSize: 22 }}>▶️</span>
              <span style={{ color: 'var(--text-primary)', display: 'block', fontSize: 11, fontWeight: 600 }}>Iniciar</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 9 }}>Comienza la simulación</span>
            </div>
            <div style={{ background: 'var(--bg-card)', padding: 10, borderRadius: 6, border: '1px solid var(--border-default)', textAlign: 'center' }}>
              <span style={{ fontSize: 22 }}>⏸️</span>
              <span style={{ color: 'var(--text-primary)', display: 'block', fontSize: 11, fontWeight: 600 }}>Pausar</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 9 }}>Pausa la simulación</span>
            </div>
            <div style={{ background: 'var(--bg-card)', padding: 10, borderRadius: 6, border: '1px solid var(--border-default)', textAlign: 'center' }}>
              <span style={{ fontSize: 22 }}>⏹️</span>
              <span style={{ color: 'var(--text-primary)', display: 'block', fontSize: 11, fontWeight: 600 }}>Detener</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 9 }}>Detiene la simulación</span>
            </div>
            <div style={{ background: 'var(--bg-card)', padding: 10, borderRadius: 6, border: '1px solid var(--border-default)', textAlign: 'center' }}>
              <span style={{ fontSize: 22 }}>🔄</span>
              <span style={{ color: 'var(--text-primary)', display: 'block', fontSize: 11, fontWeight: 600 }}>Reiniciar</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 9 }}>Reinicia el escenario</span>
            </div>
          </div>

          {/* ─── ESTRATEGIAS POR MALWARE ───────────────────────────────── */}
          <h3 style={{ fontSize: 16, color: '#00D4FF', marginBottom: 10 }}>⚡ Estrategias por malware</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
            <div style={{ background: 'rgba(239,68,68,0.08)', padding: 12, borderRadius: 6, border: '1px solid rgba(239,68,68,0.2)' }}>
              <span style={{ color: '#EF4444', fontWeight: 700, fontSize: 13 }}>🦠 Worm</span>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 11, lineHeight: 1.5 }}>Aislar nodo → Cortar internet → Parchear → Backup</span>
              <span style={{ color: 'rgba(100,116,139,0.4)', fontSize: 9, display: 'block', marginTop: 4 }}>⚠️ Se multiplica x2 en nodos pequeños, x4 en grandes</span>
            </div>
            <div style={{ background: 'rgba(249,115,22,0.08)', padding: 12, borderRadius: 6, border: '1px solid rgba(249,115,22,0.2)' }}>
              <span style={{ color: '#F97316', fontWeight: 700, fontSize: 13 }}>🔒 Ransomware</span>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 11, lineHeight: 1.5 }}>Detectar intruso → Aislar → Parchear → Backup x2-4</span>
              <span style={{ color: 'rgba(100,116,139,0.4)', fontSize: 9, display: 'block', marginTop: 4 }}>⚠️ Mata nodos después de 20s reales</span>
            </div>
            <div style={{ background: 'rgba(139,92,246,0.08)', padding: 12, borderRadius: 6, border: '1px solid rgba(139,92,246,0.2)' }}>
              <span style={{ color: '#8B5CF6', fontWeight: 700, fontSize: 13 }}>🐴 Troyano</span>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 11, lineHeight: 1.5 }}>Escaneo → Aislar → Parchear → Backup a otros</span>
              <span style={{ color: 'rgba(100,116,139,0.4)', fontSize: 9, display: 'block', marginTop: 4 }}>⚠️ Se mueve cada 3-5s, solo se ve con escaneo</span>
            </div>
            <div style={{ background: 'rgba(59,130,246,0.08)', padding: 12, borderRadius: 6, border: '1px solid rgba(59,130,246,0.2)' }}>
              <span style={{ color: '#3B82F6', fontWeight: 700, fontSize: 13 }}>🕸️ Botnet</span>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 11, lineHeight: 1.5 }}>Detectar intruso → Aislar nodos cercanos → Curar → Backup</span>
              <span style={{ color: 'rgba(100,116,139,0.4)', fontSize: 9, display: 'block', marginTop: 4 }}>⚠️ Crea telaraña desde nodo madre</span>
            </div>
            <div style={{ background: 'rgba(234,179,8,0.08)', padding: 12, borderRadius: 6, border: '1px solid rgba(234,179,8,0.2)' }}>
              <span style={{ color: '#EAB308', fontWeight: 700, fontSize: 13 }}>👁️ Rootkit</span>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 11, lineHeight: 1.5 }}>Escaneo nodo por nodo → Revelar red → Aislar → Backup</span>
              <span style={{ color: 'rgba(100,116,139,0.4)', fontSize: 9, display: 'block', marginTop: 4 }}>⚠️ No se ve con detección de intrusos</span>
            </div>
            <div style={{ background: 'rgba(236,72,153,0.08)', padding: 12, borderRadius: 6, border: '1px solid rgba(236,72,153,0.2)' }}>
              <span style={{ color: '#EC4899', fontWeight: 700, fontSize: 13 }}>📡 Spyware</span>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 11, lineHeight: 1.5 }}>Detectar intruso → Aislar internet → Firewall → Backup</span>
              <span style={{ color: 'rgba(100,116,139,0.4)', fontSize: 9, display: 'block', marginTop: 4 }}>⚠️ Apaga nodos después de 30s reales</span>
            </div>
          </div>

          {/* ─── ESTADOS DE NODOS ──────────────────────────────────────── */}
          <h3 style={{ fontSize: 16, color: '#00D4FF', marginBottom: 10 }}>🔴 Estados de los nodos</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6, marginBottom: 20 }}>
            <div style={{ background: 'var(--bg-card)', padding: 10, borderRadius: 6, border: '1px solid var(--border-default)', textAlign: 'center' }}>
              <span style={{ color: '#3B82F6', fontSize: 24 }}>🟢</span>
              <span style={{ color: 'var(--text-primary)', display: 'block', fontSize: 11, fontWeight: 600 }}>Susceptible</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 9 }}>Sano</span>
            </div>
            <div style={{ background: 'var(--bg-card)', padding: 10, borderRadius: 6, border: '1px solid var(--border-default)', textAlign: 'center' }}>
              <span style={{ color: '#EF4444', fontSize: 24 }}>🔴</span>
              <span style={{ color: 'var(--text-primary)', display: 'block', fontSize: 11, fontWeight: 600 }}>Infectado</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 9 }}>Comprometido</span>
            </div>
            <div style={{ background: 'var(--bg-card)', padding: 10, borderRadius: 6, border: '1px solid var(--border-default)', textAlign: 'center' }}>
              <span style={{ color: '#22C55E', fontSize: 24 }}>🔵</span>
              <span style={{ color: 'var(--text-primary)', display: 'block', fontSize: 11, fontWeight: 600 }}>Recuperado</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 9 }}>Limpio, inmune</span>
            </div>
            <div style={{ background: 'var(--bg-card)', padding: 10, borderRadius: 6, border: '1px solid var(--border-default)', textAlign: 'center' }}>
              <span style={{ color: '#EAB308', fontSize: 24 }}>🟡</span>
              <span style={{ color: 'var(--text-primary)', display: 'block', fontSize: 11, fontWeight: 600 }}>Aislado</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 9 }}>Desconectado</span>
            </div>
            <div style={{ background: 'var(--bg-card)', padding: 10, borderRadius: 6, border: '1px solid var(--border-default)', textAlign: 'center' }}>
              <span style={{ color: '#666', fontSize: 24 }}>💀</span>
              <span style={{ color: 'var(--text-primary)', display: 'block', fontSize: 11, fontWeight: 600 }}>Muerto</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 9 }}>Irrecuperable</span>
            </div>
          </div>

          {/* ─── CONSEJOS IMPORTANTES ───────────────────────────────────── */}
          <h3 style={{ fontSize: 16, color: '#00D4FF', marginBottom: 10 }}>💡 Consejos importantes</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
            <div style={{ background: 'rgba(34,197,94,0.06)', padding: 10, borderRadius: 6, border: '1px solid rgba(34,197,94,0.15)' }}>
              <span style={{ color: '#22C55E', fontSize: 13 }}>✅</span>
              <span style={{ color: 'var(--text-primary)', display: 'block', fontSize: 11, fontWeight: 600 }}>Backup después de controlar</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>Espera a que todos los nodos estén VERDES antes de backup global</span>
            </div>
            <div style={{ background: 'rgba(239,68,68,0.06)', padding: 10, borderRadius: 6, border: '1px solid rgba(239,68,68,0.15)' }}>
              <span style={{ color: '#EF4444', fontSize: 13 }}>⚠️</span>
              <span style={{ color: 'var(--text-primary)', display: 'block', fontSize: 11, fontWeight: 600 }}>No hacer backup anticipado</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>Backup con mas del 30% de infeccion puede AUMENTAR la propagacion</span>
            </div>
            <div style={{ background: 'rgba(59,130,246,0.06)', padding: 10, borderRadius: 6, border: '1px solid rgba(59,130,246,0.15)' }}>
              <span style={{ color: '#3B82F6', fontSize: 13 }}>🔍</span>
              <span style={{ color: 'var(--text-primary)', display: 'block', fontSize: 11, fontWeight: 600 }}>Troyano y Rootkit necesitan escaneo</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>No se ven con deteccion de intrusos. Usa ESCANEO.</span>
            </div>
            <div style={{ background: 'rgba(249,115,22,0.06)', padding: 10, borderRadius: 6, border: '1px solid rgba(249,115,22,0.15)' }}>
              <span style={{ color: '#F97316', fontSize: 13 }}>🔒</span>
              <span style={{ color: 'var(--text-primary)', display: 'block', fontSize: 11, fontWeight: 600 }}>Ransomware requiere multiples backups</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>Un solo backup no es suficiente. Necesita 2-4 backups por nodo.</span>
            </div>
          </div>

          {/* ─── FOOTER ──────────────────────────────────────────────────── */}
          <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>📖 LAB-EDO v2.0 · Simulador de Propagación de Malware</span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Consulta la <span style={{ color: 'var(--accent-cyan)' }}>Enciclopedia</span> para más detalles</span>
          </div>
        </div>
      </div>
    </div>
  );
}