import { Inbox } from "lucide-react";

interface DashboardEmptyStateProps {
  message: string;
}

export function DashboardEmptyState({ message }: DashboardEmptyStateProps) {
  return (
    <div className="flex min-h-28 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-5 text-center">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
        <Inbox className="h-4 w-4" />
        <span>{message}</span>
      </div>
    </div>
  );
}
