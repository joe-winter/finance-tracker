"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";

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
    <ChartContainer config={chartConfig} className="aspect-auto h-full">
      <BarChart
        accessibilityLayer
        data={data}
        margin={{
          left: 10,
          top: 10,
        }}
      >
        <XAxis
          dataKey="label"
          type="category"
          tickLine={false}
          tickMargin={10}
          interval="preserveEnd"
          axisLine={false}
          tickFormatter={(value) => {
            const label =
              chartConfig[value as keyof typeof chartConfig]?.label || "";
            const maxLength = 8; // max characters before truncating
            return label.length > maxLength
              ? `${label.slice(0, maxLength - 3)}…`
              : label;
          }}
        />
        <YAxis dataKey="value" type="number" hide scale="sqrt" />
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
