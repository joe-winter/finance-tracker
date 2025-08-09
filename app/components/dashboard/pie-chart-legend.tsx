import { Pie, PieChart } from "recharts";
import { ChartContainer, ChartLegend, ChartLegendContent } from "../ui/chart";

interface ChartData {
  label: string;
  value: number;
  fill: string;
}

interface PieChartLegendProps {
  data: ChartData[];
}
export const PieChartLegend = ({ data }: PieChartLegendProps) => {
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
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-80"
    >
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          labelLine={false}
          label={({ payload, ...props }) => {
            return (
              <text
                cx={props.cx}
                cy={props.cy}
                x={props.x}
                y={props.y}
                textAnchor={props.textAnchor}
                dominantBaseline={props.dominantBaseline}
                fill="hsla(var(--foreground))"
              >
                {payload.visitors}
              </text>
            );
          }}
          nameKey="label"
        />

        <ChartLegend
          content={<ChartLegendContent nameKey="label" />}
          className="w-full flex-wrap"
        />
      </PieChart>
    </ChartContainer>
  );
};
