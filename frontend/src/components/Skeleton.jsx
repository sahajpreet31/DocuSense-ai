export function SkeletonBlock({ className = "" }) {
  return <div className={`animate-pulse bg-gray-100 rounded ${className}`} />;
}

export function ChatSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-start">
        <SkeletonBlock className="h-9 w-9 rounded-full mr-2" />
        <SkeletonBlock className="h-12 w-2/3 rounded-2xl" />
      </div>
      <div className="flex justify-end">
        <SkeletonBlock className="h-10 w-1/2 rounded-2xl" />
      </div>
      <div className="flex justify-start">
        <SkeletonBlock className="h-9 w-9 rounded-full mr-2" />
        <SkeletonBlock className="h-16 w-3/4 rounded-2xl" />
      </div>
    </div>
  );
}

export function SummarySkeleton() {
  return (
    <div className="space-y-3">
      <SkeletonBlock className="h-4 w-full" />
      <SkeletonBlock className="h-4 w-11/12" />
      <SkeletonBlock className="h-4 w-full" />
      <SkeletonBlock className="h-4 w-3/4" />
      <SkeletonBlock className="h-4 w-5/6" />
    </div>
  );
}

export function EntitiesSkeleton() {
  return (
    <div className="space-y-5">
      {[0, 1, 2].map((row) => (
        <div key={row}>
          <SkeletonBlock className="h-3 w-24 mb-2" />
          <div className="flex flex-wrap gap-2">
            <SkeletonBlock className="h-6 w-20 rounded-full" />
            <SkeletonBlock className="h-6 w-16 rounded-full" />
            <SkeletonBlock className="h-6 w-24 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ClassificationSkeleton() {
  return (
    <div>
      <SkeletonBlock className="h-7 w-32 rounded-full mb-5" />
      <SkeletonBlock className="h-3 w-full mb-1.5" />
      <SkeletonBlock className="h-2 w-full rounded-full" />
    </div>
  );
}

export function RiskFlagsSkeleton() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((row) => (
        <div key={row} className="border border-gray-100 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <SkeletonBlock className="h-4 w-32" />
            <SkeletonBlock className="h-5 w-14 rounded-full" />
          </div>
          <SkeletonBlock className="h-3 w-full" />
        </div>
      ))}
    </div>
  );
}

export function AnalyticsSkeleton() {
  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[0, 1, 2, 3].map((card) => (
          <div key={card} className="bg-white rounded-xl border border-gray-100 p-4">
            <SkeletonBlock className="h-3 w-14 mb-2" />
            <SkeletonBlock className="h-6 w-10" />
          </div>
        ))}
      </div>
      <SkeletonBlock className="h-3 w-20 mb-3" />
      <SkeletonBlock className="h-[220px] w-full rounded-lg" />
    </div>
  );
}
