export function DashboardSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Učitavanje podataka">
      <div className="fig">
        <div className="fig-bar">
          <div className="skeleton h-2.5 w-40" />
          <div className="skeleton h-2.5 w-16" />
        </div>
        <div className="fig-well">
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
            <div className="space-y-3">
              <div className="skeleton h-2.5 w-28" />
              <div className="skeleton h-20 w-48 sm:h-24 sm:w-56" />
              <div className="skeleton h-2.5 w-64 max-w-full" />
              <div className="flex gap-2">
                <div className="skeleton h-6 w-24" />
                <div className="skeleton h-6 w-20" />
              </div>
            </div>
            <div className="border border-line bg-surface p-4">
              <div className="skeleton h-2.5 w-28" />
              <div className="mt-5 flex h-28 items-end gap-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="skeleton w-full"
                    style={{ height: `${35 + index * 12}%` }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="border border-line bg-surface p-3">
                <div className="skeleton h-2.5 w-14" />
                <div className="skeleton mt-2 h-5 w-10" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="card p-4 sm:p-5">
            <div className="flex items-center gap-2.5">
              <div className="skeleton h-8 w-8 rounded-[2px]" />
              <div className="space-y-1.5">
                <div className="skeleton h-2.5 w-28" />
                <div className="skeleton h-2 w-20" />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <div className="skeleton h-10 flex-1" />
              <div className="skeleton h-10 w-32" />
            </div>
          </div>

          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="card p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="skeleton h-2.5 w-2.5 rounded-[1px]" />
                  <div className="space-y-1.5">
                    <div className="skeleton h-3 w-40 max-w-full" />
                    <div className="skeleton h-2 w-24" />
                  </div>
                </div>
                <div className="skeleton h-8 w-8 rounded-[2px]" />
              </div>
              <div className="mt-4 flex items-end justify-between gap-3">
                <div className="flex gap-1.5">
                  {Array.from({ length: 3 }).map((__, gradeIndex) => (
                    <div key={gradeIndex} className="skeleton h-8 w-8 rounded-[2px]" />
                  ))}
                </div>
                <div className="skeleton h-6 w-12" />
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="fig">
            <div className="fig-bar">
              <div className="skeleton h-2.5 w-32" />
            </div>
            <div className="space-y-2 p-4">
              <div className="skeleton h-8 w-24" />
              <div className="skeleton h-10 w-full" />
              <div className="skeleton h-24 w-full" />
            </div>
          </div>
          <div className="fig">
            <div className="fig-bar">
              <div className="skeleton h-2.5 w-32" />
            </div>
            <div className="space-y-2 p-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="skeleton h-9 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
