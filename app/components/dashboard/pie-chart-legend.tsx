import { Pie, PieChart } from "recharts";
import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "../ui/chart";

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
			]),
		),
	} satisfies ChartConfig;
	return (
		<ChartContainer
			config={chartConfig}
			className="mx-auto aspect-square pb-0 [&_.recharts-pie-label-text]:fill-foreground"
		>
			<PieChart>
				<ChartTooltip content={<ChartTooltipContent hideLabel />} />
				<Pie data={data} dataKey="value" nameKey="label" />

				<ChartLegend
					content={<ChartLegendContent nameKey="label" />}
					className="grid w-full grid-cols-2 gap-1"
				/>
			</PieChart>
		</ChartContainer>
	);
};
