import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";

import { PieChartSkeleton } from "./pie-chart-skeleton";
import { PieChartLegend } from "./pie-chart-legend";

export const description = "A pie chart with a legend";

interface ChartData {
  label: string;
  value: number;
  fill: string;
}

interface PieChartLegendProps {
  data: ChartData[] | undefined;
}

export function PieChartCard({ data }: PieChartLegendProps) {
  return (
    <Card className="flex flex-col gap-0">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Legend</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="min-h-80 flex-1 pb-0">
        {data ? <PieChartLegend data={data} /> : <PieChartSkeleton />}
      </CardContent>
    </Card>
  );
}
