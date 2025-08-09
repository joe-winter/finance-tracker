import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";

import { PieChartSkeleton } from "./pie-chart-skeleton";
import { PieChartLegend } from "./pie-chart-legend";
import { format } from "date-fns";

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
}

export function PieChartCard({
  data,
  title,
  date,
  isLoading,
}: PieChartLegendProps) {
  return (
    <Card className="flex flex-col gap-0">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - {title}</CardTitle>
        <CardDescription>{format(date, "MMMM - y")}</CardDescription>
      </CardHeader>
      <CardContent className="min-h-80 flex-1 pb-0">
        {isLoading ? (
          <PieChartSkeleton />
        ) : data ? (
          <PieChartLegend data={data} />
        ) : null}
      </CardContent>
    </Card>
  );
}
