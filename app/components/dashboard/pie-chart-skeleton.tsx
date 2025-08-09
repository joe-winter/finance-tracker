import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

export function PieChartSkeleton() {
  const widths = ["w-22", "w-26", "w-28", "w-20", "w-26", "w-30"];

  return (
    <div className="mt-6 flex flex-col gap-2">
      <div className="flex flex-col gap-4 px-16">
        <Skeleton className="aspect-square min-h-40 rounded-full" />
      </div>
      <div className="flex w-full flex-wrap items-center justify-center gap-4 pt-3">
        {widths.map((width, index) => {
          const key = `${width}-${index}`;
          return (
            <div className="flex items-center justify-center gap-1.5" key={key}>
              <Skeleton className="size-2 rounded-xs" />
              <Skeleton className={cn("h-2.5 rounded-sm", width)} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
