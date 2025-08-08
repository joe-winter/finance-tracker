import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/app/components/ui/chart";

export const description = "A pie chart with a legend";

interface ChartData {
  label: string;
  value: number;
  fill: string;
}

interface PieChartLegendProps {
  data: ChartData[];
}

export function PieChartLegend({ data }: PieChartLegendProps) {
  const chartConfig = {
    value: { label: "Categories" },
    ...Object.fromEntries(
      data.map((el) => [
        el.label,
        {
          label: el.label,
        },
      ])
    ),
  };

  return (
    <Card className="flex flex-col gap-0">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Legend</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="label" />
            <ChartLegend
              content={<ChartLegendContent nameKey="label" />}
              className="w-full flex-wrap"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
