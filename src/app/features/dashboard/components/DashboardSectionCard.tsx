import type { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardSectionCardProps {
  title: string;
  description: string;
  action?: ReactNode;
  children: ReactNode;
}

export function DashboardSectionCard({ title, description, action, children }: DashboardSectionCardProps) {
  return (
    <Card className="rounded-2xl border-slate-200/80 shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between gap-3 pb-3">
        <div>
          <CardTitle className="text-base font-black tracking-tight text-slate-900">{title}</CardTitle>
          <CardDescription className="mt-1 text-xs text-slate-500">{description}</CardDescription>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  );
}
