"use client";

import { trpc } from "../_trpc/client";
import z from "zod";
import { PieChartLegend } from "../components/dashboard/pie-chart";
import { ChartPieSeparatorNone } from "../components/dashboard/test";
import type { GetTransactionTotalsByCategoryOutput } from "@/lib/types";
import { TransactionType } from "@prisma/client";

const formSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
});

const chartColors = {
  EXPENSE: "red",
  INCOME: "green",
  SAVING: "blue",
};

const getChartColors = (data: GetTransactionTotalsByCategoryOutput) => {
  return data.map((el, index) => ({
    label: el.name,
    value: Number(el.sum),
    fill: `var(--chart-${chartColors[el.type]}-${index + 1})`,
    type: el.type,
  }));
};

export default function Dashboard() {
  const totals = trpc.dashboard.getTransactionTotalsByCategory.useQuery();

  const data = Object.groupBy(totals.data ?? [], ({ type }) => type);

  return (
    <div className="flex flex-col gap-4 px-4">
      {data.EXPENSE && <PieChartLegend data={getChartColors(data.EXPENSE)} />}
      {data.INCOME && <PieChartLegend data={getChartColors(data.INCOME)} />}
      {data.SAVING && <PieChartLegend data={getChartColors(data.SAVING)} />}
    </div>
  );
}
