"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

export const description = "A mixed bar chart";

interface ChartData {
  label: string;
  value: number;
  fill: string;
}

interface PieChartLegendProps {
  data: ChartData[];
}

export function ChartBarMixed({ data }: PieChartLegendProps) {
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
  } satisfies ChartConfig;
  return (
    <ChartContainer config={chartConfig}>
      <BarChart
        accessibilityLayer
        data={data}
        layout="vertical"
        margin={{
          left: 10,
        }}
        className="h-full"
      >
        <YAxis
          dataKey="label"
          type="category"
          interval={0}
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => {
            const label =
              chartConfig[value as keyof typeof chartConfig]?.label || "";
            const maxLength = 10; // max characters before truncating
            return label.length > maxLength
              ? `${label.slice(0, maxLength - 3)}…`
              : label;
          }}
        />
        <XAxis dataKey="value" type="number" hide />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent indicator="line" hideLabel nameKey="label" />
          }
        />
        <Bar dataKey="value" layout="vertical" radius={5} />
      </BarChart>
    </ChartContainer>
  );
}
