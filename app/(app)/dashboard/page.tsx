"use client";

import { TransactionType } from "@prisma/client";
import {
	endOfMonth,
	getMonth,
	getYear,
	setMonth,
	setYear,
	startOfMonth,
} from "date-fns";
import { useState } from "react";
import { trpc } from "@/app/_trpc/client";
import { ChartCard } from "@/app/components/dashboard/chart-card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/app/components/ui/select";
import type { GetTransactionTotalsByCategoryOutput } from "@/lib/types";

const charts = [
	{ type: TransactionType.EXPENSE, title: "Expenses" },
	{ type: TransactionType.INCOME, title: "Income" },
	{ type: TransactionType.SAVING, title: "Savings" },
];

const months = [
	{ value: 0, label: "January" },
	{ value: 1, label: "February" },
	{ value: 2, label: "March" },
	{ value: 3, label: "April" },
	{ value: 4, label: "May" },
	{ value: 5, label: "June" },
	{ value: 6, label: "July" },
	{ value: 7, label: "August" },
	{ value: 8, label: "September" },
	{ value: 9, label: "October" },
	{ value: 10, label: "November" },
	{ value: 11, label: "December" },
];

const getChartColors = (data: GetTransactionTotalsByCategoryOutput) => {
	return data.map((el, index) => ({
		label: el.name ?? "",
		value: Number(el.sum),
		fill: `var(--chart-${el.type.toLowerCase()}-${index + 1})`,
		type: el.type,
	}));
};

const currentYear = getYear(new Date());
const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

export default function Dashboard() {
	const [date, setDate] = useState(new Date());

	const totals = trpc.dashboard.getTransactionTotalsByCategory.useQuery({
		startDate: startOfMonth(date),
		endDate: endOfMonth(date),
	});

	const data = Object.groupBy(totals.data ?? [], ({ type }) => type);

	return (
		<div className="flex flex-col gap-4 p-4">
			<div className="flex items-center justify-between">
				<h2 className="font-semibold text-lg">Dashboard</h2>
				<div className="flex gap-2">
					<Select
						defaultValue={getMonth(new Date()).toString()}
						onValueChange={(value) => {
							setDate((prev) => setMonth(prev, Number(value)));
						}}
					>
						<SelectTrigger className="w-fit">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{months.map((month) => (
								<SelectItem value={month.value.toString()} key={month.value}>
									{month.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Select
						defaultValue={getYear(new Date()).toString()}
						onValueChange={(value) => {
							setDate((prev) => setYear(prev, Number(value)));
						}}
					>
						<SelectTrigger className="w-fit">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{years.map((year) => (
								<SelectItem value={year.toString()} key={year}>
									{year}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
				{charts.map((chart) => {
					const chartData = data[chart.type];
					return (
						<ChartCard
							key={chart.title}
							type={
								chart.type === "EXPENSE" &&
								data.EXPENSE?.length &&
								data.EXPENSE?.length > 3
									? "bar"
									: "pie"
							}
							data={chartData && getChartColors(chartData)}
							title={chart.title}
							date={date}
							isLoading={totals.isPending}
							className="col-span-full md:col-span-1"
						/>
					);
				})}
			</div>
		</div>
	);
}
