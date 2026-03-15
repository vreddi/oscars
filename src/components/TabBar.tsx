interface TabBarProps {
  tabs: string[];
  activeIndex: number;
  onChange: (index: number) => void;
}

export function TabBar({ tabs, activeIndex, onChange }: TabBarProps) {
  return (
    <div style={{
      display: 'flex',
      background: 'var(--black-light)',
      borderRadius: 'var(--radius-full)',
      padding: 3,
      marginBottom: 20,
    }}>
      {tabs.map((tab, i) => (
        <button
          key={tab}
          onClick={() => onChange(i)}
          style={{
            flex: 1,
            padding: '10px 0',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.85rem',
            fontWeight: 600,
            background: i === activeIndex
              ? 'linear-gradient(135deg, var(--gold), var(--gold-light))'
              : 'transparent',
            color: i === activeIndex ? 'var(--black)' : 'var(--ivory-dim)',
            transition: 'all var(--transition)',
            border: 'none',
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
