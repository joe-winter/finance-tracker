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
}

interface PieChartLegendProps {
	data: ChartData[];
}

export function PieChartLegend({ data }: PieChartLegendProps) {
	const chartConfig = {
		title: { label: "Categories" },
		...Object.fromEntries(
			data.map((el) => [
				el.label,
				{
					label: el.label,
				},
			]),
		),
	};

	return (
		<Card className="flex flex-col">
			<CardHeader className="items-center pb-0">
				<CardTitle>Pie Chart - Legend</CardTitle>
				<CardDescription>January - June 2024</CardDescription>
			</CardHeader>
			<CardContent className="size-fit">
				<ChartContainer config={chartConfig} className="aspect-square">
					<PieChart cx={250} cy={250}>
						<Pie
							data={data}
							dataKey="value"
							nameKey="label"
							className="size-full"
						/>
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
