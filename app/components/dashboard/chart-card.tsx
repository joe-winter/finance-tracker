import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { cn } from "@/lib/utils";
import { ChartBarMixed } from "./chart-bar-label-custom";
import { PieChartLegend } from "./pie-chart-legend";
import { PieChartNoData } from "./pie-chart-no-data";
import { PieChartSkeleton } from "./pie-chart-skeleton";

export const description = "A pie chart with a legend";

interface ChartData {
  label: string;
  value: number;
  fill: string;
}

interface PieChartLegendProps {
  data: ChartData[] | undefined;
  title: string;
  date: Date;
  isLoading?: boolean;
  className?: string;
  type: "pie" | "bar";
}

export function ChartCard({
  data,
  title,
  date,
  type,
  isLoading,
  className,
}: PieChartLegendProps) {
  return (
    <Card className={cn("flex flex-col gap-0", className)}>
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - {title}</CardTitle>
        <CardDescription>{format(date, "MMMM - y")}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {type === "pie" ? (
          isLoading ? (
            <PieChartSkeleton />
          ) : data ? (
            <PieChartLegend data={data} />
          ) : (
            <PieChartNoData />
          )
        ) : isLoading ? (
          <PieChartSkeleton />
        ) : data ? (
          <ChartBarMixed data={data} />
        ) : (
          <PieChartNoData />
        )}
      </CardContent>
    </Card>
  );
}
