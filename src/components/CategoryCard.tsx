import type { Category } from '../types';
import { NomineeButton } from './NomineeButton';

interface CategoryCardProps {
  category: Category;
  selectedNomineeId: string | undefined;
  onSelect: (nomineeId: string) => void;
  disabled?: boolean;
}

export function CategoryCard({ category, selectedNomineeId, onSelect, disabled }: CategoryCardProps) {
  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <h3 style={{
        fontFamily: 'var(--font-heading)',
        color: 'var(--gold)',
        marginBottom: 12,
        fontSize: '1rem',
      }}>
        {category.name}
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {category.nominees.map((nominee) => (
          <NomineeButton
            key={nominee.id}
            nominee={nominee}
            selected={selectedNomineeId === nominee.id}
            disabled={disabled}
            categoryType={category.type}
            onClick={() => onSelect(nominee.id)}
          />
        ))}
      </div>
    </div>
  );
}
