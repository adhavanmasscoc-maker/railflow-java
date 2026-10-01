// src/components/PageHeader.jsx
// Standardized tactical command-center page header used across all views.

export default function PageHeader({
  systemCode,
  title,
  subtitle,
  description,
  badge,
  badgeColor = 'emerald',
  extra,
}) {
  const badgeStyles = {
    emerald: 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30',
    cyan:    'bg-cyan-950/60 text-cyan-400 border-cyan-500/30',
    amber:   'bg-amber-950/60 text-amber-400 border-amber-500/30',
    crimson: 'bg-rose-950/60 text-rose-400 border-rose-500/30',
    indigo:  'bg-indigo-950/60 text-indigo-300 border-indigo-500/30',
    sky:     'bg-sky-950/60 text-sky-400 border-sky-500/30',
  }[badgeColor] ?? 'bg-slate-800 text-slate-300 border-slate-700';

  return (
    <div
      className="page-header-block"
      style={{
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(10,14,28,0.55)',
        backdropFilter: 'blur(8px)',
        padding: '20px 24px 16px',
        marginBottom: '24px',
        borderRadius: '10px',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        <div>
          {/* System code row + live badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: '#10B981',
                textTransform: 'uppercase',
              }}
            >
              {systemCode}
            </span>
            {badge && (
              <span
                className={badgeStyles}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontFamily: 'var(--font-mono, monospace)',
                  fontWeight: 600,
                  border: '1px solid',
                  letterSpacing: '0.06em',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'currentColor',
                    marginRight: '6px',
                    flexShrink: 0,
                    animation: 'pulse-glow 1.4s ease-in-out infinite',
                  }}
                />
                {badge}
              </span>
            )}
          </div>

          {/* Main H1 title */}
          <h1
            style={{
              margin: 0,
              fontSize: 'clamp(18px, 2vw, 24px)',
              fontWeight: 800,
              color: '#EDEDED',
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
              textTransform: 'uppercase',
              fontFamily: 'var(--font-sans, Inter, sans-serif)',
            }}
          >
            {title}
          </h1>

          {/* Optional subtitle in mono */}
          {subtitle && (
            <p
              style={{
                margin: '4px 0 0',
                fontSize: '11px',
                fontFamily: 'var(--font-mono, monospace)',
                color: '#64748B',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Right slot: extra badges / controls passed from parent */}
        {extra && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            {extra}
          </div>
        )}
      </div>

      {/* Description row */}
      {description && (
        <p
          style={{
            margin: '10px 0 0',
            fontSize: '13px',
            color: '#94A3B8',
            lineHeight: 1.6,
            maxWidth: '800px',
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
}
