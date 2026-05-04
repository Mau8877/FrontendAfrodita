import { Card, CardContent, CardHeader } from "@/components/ui/card";

function SkeletonBox({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200/70 ${className}`} />;
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="rounded-2xl border-slate-200">
        <CardContent className="space-y-3 pt-6">
          <SkeletonBox className="h-5 w-24" />
          <SkeletonBox className="h-8 w-48" />
          <SkeletonBox className="h-4 w-72" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="rounded-2xl border-slate-200">
            <CardContent className="space-y-3 pt-6">
              <SkeletonBox className="h-4 w-24" />
              <SkeletonBox className="h-8 w-28" />
              <SkeletonBox className="h-3 w-40" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-2xl border-slate-200">
        <CardHeader>
          <SkeletonBox className="h-5 w-52" />
        </CardHeader>
        <CardContent>
          <SkeletonBox className="h-72 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
