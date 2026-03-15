interface GameCodeDisplayProps {
  code: string;
}

export function GameCodeDisplay({ code }: GameCodeDisplayProps) {
  const copyCode = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div
      onClick={copyCode}
      style={{
        background: 'var(--black-light)',
        border: '2px dashed var(--gold)',
        borderRadius: 'var(--radius-md)',
        padding: '16px 24px',
        textAlign: 'center',
        cursor: 'pointer',
      }}
    >
      <div style={{ fontSize: '0.75rem', color: 'var(--ivory-dim)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>
        Game Code (tap to copy)
      </div>
      <div style={{
        fontFamily: 'var(--font-heading)',
        fontSize: '1.8rem',
        fontWeight: 700,
        color: 'var(--gold)',
        letterSpacing: 3,
      }}>
        {code}
      </div>
    </div>
  );
}
