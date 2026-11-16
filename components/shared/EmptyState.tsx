import type { ReactNode } from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export default function EmptyState({ title = 'No data found', description = 'There is currently no data to display.', icon, action }: EmptyStateProps) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/40 px-6 py-10 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">{icon ?? <Inbox className="size-6" />}</div>

      <h3 className="text-base font-semibold">{title}</h3>

      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">{description}</p>

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
