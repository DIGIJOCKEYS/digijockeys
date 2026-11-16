import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  breadcrumb?: ReactNode;
}

export default function PageHeader({ title, description, action, breadcrumb }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        {breadcrumb && <div className="text-sm text-muted-foreground">{breadcrumb}</div>}

        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>

        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>

      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
    </div>
  );
}
