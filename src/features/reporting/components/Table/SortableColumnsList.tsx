import { DragDropProvider } from '@dnd-kit/react';
import { isSortable, useSortable } from '@dnd-kit/react/sortable';
import { cn } from '@/lib/utils';
import type { ColumnDef } from '@/lib/types';

interface SortableColumnsListProps {
  selected: ColumnDef[];
  onReorder: (newSelected: ColumnDef[]) => void;
  onRemove: (key: string) => void;
}

export function SortableColumnsList({ selected, onReorder, onRemove }: SortableColumnsListProps) {
  // Simple arrayMove helper to update indices
  const arrayMove = <T,>(array: T[], from: number, to: number): T[] => {
    const newArray = [...array];
    newArray.splice(to < 0 ? newArray.length + to : to, 0, newArray.splice(from, 1)[0]);
    return newArray;
  };

  return (
    <div className="px-5 py-4 pr-0 flex flex-col gap-[10px] min-h-0">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[13px] font-semibold text-fg">
          <b>{selected.length}</b> columns selected
        </span>
      </div>
      <DragDropProvider
        onDragEnd={({ canceled, operation }) => {
          if (canceled) return;
          const { source } = operation;
          if (isSortable(source)) {
            const oldIndex = source.sortable.initialIndex;
            const newIndex = source.sortable.index;
            if (oldIndex !== newIndex) {
              onReorder(arrayMove(selected, oldIndex, newIndex));
            }
          }
        }}
      >
        <div className="flex-1 overflow-y-auto border border-border-soft rounded-[9px] bg-bg-overlay p-[6px] flex flex-col gap-1 min-h-0">
          {selected.map((col, index) => {
            return (
              <SortableColumnItem
                key={col.key}
                id={col.key}
                index={index}
                label={col.label}
                required={!!col.required}
                onRemove={() => onRemove(col.key)}
              />
            );
          })}
        </div>
      </DragDropProvider>
    </div>
  );
}

interface SortableColumnItemProps {
  id: string;
  index: number;
  label: string;
  required: boolean;
  onRemove: () => void;
}

function SortableColumnItem({ id, index, label, required, onRemove }: SortableColumnItemProps) {
  const { ref, handleRef } = useSortable({
    id,
    index,
    disabled: required,
  });

  return (
    <div
      ref={(node) => ref(node)}
      className={cn(
        'grid grid-cols-[18px_1fr_auto] gap-[10px] items-center px-[10px] py-[9px] bg-surface border border-border-soft rounded-[7px] text-[13px] text-fg transition-all duration-[120ms]',
        required ? 'bg-bg-overlay cursor-default' : 'cursor-grab',
      )}
    >
      <span
        ref={(node) => handleRef(node)}
        title={required ? undefined : 'Drag to reorder'}
        style={{ color: 'var(--fg-faint)', cursor: required ? 'default' : 'grab' }}
      >
        <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor">
          <circle cx="2" cy="2" r="1" />
          <circle cx="8" cy="2" r="1" />
          <circle cx="2" cy="7" r="1" />
          <circle cx="8" cy="7" r="1" />
          <circle cx="2" cy="12" r="1" />
          <circle cx="8" cy="12" r="1" />
        </svg>
      </span>
      <span>{label}</span>
      {required ? (
        <span title="Required" style={{ color: 'var(--fg-faint)' }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="11" width="16" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
        </span>
      ) : (
        <button
          className="w-[22px] h-[22px] grid place-items-center rounded-[5px] text-fg-mute hover:bg-neg-soft hover:text-neg transition-[background,color] duration-[120ms]"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="m6 6 12 12M6 18 18 6" />
          </svg>
        </button>
      )}
    </div>
  );
}
