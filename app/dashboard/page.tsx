"use client";

import prisma from "@/lib/prisma";
import { trpc } from "../_trpc/client";
import z from "zod";
import { PieChartLegend } from "../components/dashboard/pie-chart";

const formSchema = z.object({
	startDate: z.date(),
	endDate: z.date(),
});

export default function Dashboard() {
	const totals = trpc.dashboard.getTransactionTotalsByCategory.useQuery();

	const chartData = totals.data
		?.filter((el) => el.totalAmount !== 0)
		.map((el, index) => ({
			label:
				el.categoryName +
				" " +
				new Intl.NumberFormat("en-GB", {
					style: "currency",
					currency: "GBP",
				}).format(Number(el.totalAmount)),
			value: el.totalAmount,
			fill: `var(--chart-${index + 1})`,
		}));
	return (
		<div className="flex flex-col gap-2 px-4">
			{chartData && <PieChartLegend data={chartData} />}
		</div>
	);
}
