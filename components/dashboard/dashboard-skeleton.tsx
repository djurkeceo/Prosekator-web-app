export function DashboardSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Učitavanje podataka">
      <div className="card p-5 sm:p-6 lg:p-7">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full space-y-3">
            <div className="skeleton h-3 w-36" />
            <div className="skeleton h-14 w-48 sm:h-16 sm:w-56" />
            <div className="skeleton h-3 w-64 max-w-full" />
            <div className="skeleton h-6 w-32" />
          </div>
          <div className="skeleton h-28 w-28 shrink-0 rounded-full sm:h-32 sm:w-32" />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-2xl border border-line bg-surface-2 p-3.5">
              <div className="skeleton h-2.5 w-16" />
              <div className="skeleton mt-2 h-7 w-10" />
            </div>
          ))}
        </div>

        <div className="skeleton mt-5 h-2.5 w-full rounded-full" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="card p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="skeleton h-9 w-9 rounded-xl" />
              <div className="space-y-2">
                <div className="skeleton h-3 w-28" />
                <div className="skeleton h-2.5 w-44" />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <div className="skeleton h-12 flex-1" />
              <div className="skeleton h-12 w-36" />
            </div>
          </div>

          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="card p-4 pl-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="skeleton h-2.5 w-2.5 rounded-full" />
                  <div className="skeleton h-4 w-40 max-w-full" />
                </div>
                <div className="skeleton h-8 w-8 rounded-full" />
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <div className="flex gap-1.5">
                  {Array.from({ length: 3 }).map((__, gradeIndex) => (
                    <div key={gradeIndex} className="skeleton h-9 w-9 rounded-xl" />
                  ))}
                </div>
                <div className="skeleton h-6 w-12" />
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <div className="skeleton h-10 w-10 rounded-2xl" />
            <div className="skeleton mt-4 h-24 w-full" />
            <div className="skeleton mt-3 h-20 w-full" />
          </div>
          <div className="card p-5">
            <div className="skeleton h-9 w-9 rounded-xl" />
            <div className="mt-4 space-y-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="skeleton h-10 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
