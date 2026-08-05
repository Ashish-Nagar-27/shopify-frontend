import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import z from 'zod';

interface ColumnViewsSidebarProps {
  views?: string[];
  activeView?: string;
  currentView?: string;
  onViewChange?: (view: string) => void;
  onSavePreset: (presetName: string) => void;
  onDeleteView?: (view: string) => void;
}

export function ColumnViewsSidebar({
  views = ['myview'],
  activeView = 'myview',
  onViewChange,
  onSavePreset,
  onDeleteView,
  currentView,
}: ColumnViewsSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [viewToDelete, setViewToDelete] = useState<string | null>(null);

  const handleSave = () => {
    if (presetName.trim()) {
      if(presetName.trim().length > 20) {
        toast.error('Preset name must be at most 20 characters long');
        return;
      }
      const schema = z.string().regex(
        /^[A-Za-z0-9-]+$/,
        "Only letters, numbers, and hyphens (-) are allowed."
      );

      const validationResult = schema.safeParse(presetName);

      if (!validationResult.success) {
        toast.error(validationResult.error.issues[0].message);
        return;
      }

      if(views?.includes(presetName.trim())) {
        toast.error('Preset name already exists');
        return;
      }

      onSavePreset(presetName.trim());
      setPresetName('');
      setIsOpen(false);
    }
  };
  const corePresets = ['default', 'newVsreturning', 'engagementAndTraffic'];

  return (
    <div className="px-4 py-[18px] border-r border-border-soft flex flex-col gap-[10px] bg-[oklch(0.115_0.018_240)] w-[200px] min-h-0">
      <div className="text-[13px] font-semibold text-fg mb-3">
        Views <span className="text-fg-mute">({views.length})</span>
      </div>
      <div className="text-[11px] px-[10px] py-2 bg-surface border border-border-soft rounded-[7px] text-fg-mute">
        Current View: {currentView}
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col gap-[6px] pr-1">
        {views.filter(v => !corePresets.includes(v)).map((v) => {
          
          return (
            <div
              key={v}
              className={cn(
                'flex items-center justify-between px-3 py-[10px] border border-border-soft rounded-[8px] text-[13px] transition-all duration-[120ms] hover:border-border cursor-pointer w-full group',
                activeView === v ? 'bg-cyan-soft border-cyan-deep text-cyan' : 'text-fg-dim hover:text-fg bg-transparent',
              )}
              onClick={() => onViewChange?.(v)}
            >
              <span className="truncate mr-2">{v}</span>
              { (
                <button
                  className="w-5 h-5 rounded-[4px] grid place-items-center text-fg-mute hover:bg-neg-soft hover:text-neg transition-all duration-[120ms] cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setViewToDelete(v);
                  }}
                  title="Delete view"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6" />
                  </svg>
                </button>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={() => setIsOpen(true)}
        className="mt-auto flex items-center gap-2 px-3 py-[10px] bg-surface border border-border-soft rounded-[8px] text-fg-dim text-[13px] font-medium justify-center cursor-pointer hover:text-fg hover:border-border transition-all duration-[120ms]"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21 12 17l-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
        Save as a column preset
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Save as a column preset</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label className="text-[13px] font-medium text-fg mb-2 block">
              Preset Name
            </label>
            <Input
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              placeholder="e.g., my-custom-preset"
              className="w-full text-fg bg-surface border-border-soft"
              autoFocus
            />
            {presetName.trim().length > 20 && (
              <p className="text-sm text-red-500 mt-2">
                Preset name must be at most 20 characters long.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-[linear-gradient(135deg,var(--cyan),var(--cyan-deep))] text-[oklch(0.10_0.018_240)] font-semibold cursor-pointer"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!viewToDelete} onOpenChange={(open) => !open && setViewToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the view preset
              <span className="font-semibold text-fg ml-1">"{viewToDelete}"</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              className="cursor-pointer"
              onClick={() => {
                if (viewToDelete) {
                  onDeleteView?.(viewToDelete);
                  setViewToDelete(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
