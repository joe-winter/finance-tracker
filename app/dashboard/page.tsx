"use client";

import { trpc } from "../_trpc/client";
import type { GetTransactionTotalsByCategoryOutput } from "@/lib/types";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { PieChartSkeleton } from "../components/dashboard/pie-chart-skeleton";
import { PieChartCard } from "../components/dashboard/pie-chart-card";

const chartColors = {
  EXPENSE: "red",
  INCOME: "green",
  SAVING: "blue",
};

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
    label: `${el.name} - ${new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(Number(el.sum))}`,
    value: Number(el.sum),
    fill: `var(--chart-${chartColors[el.type]}-${index + 1})`,
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

  console.log(date);

  const data = Object.groupBy(totals.data ?? [], ({ type }) => type);

  return (
    <div className="flex flex-col gap-4 px-4">
      <div className="flex gap-4">
        <Select
          defaultValue={getMonth(new Date()).toString()}
          onValueChange={(value) => {
            setDate((prev) => setMonth(prev, Number(value)));
          }}
        >
          <SelectTrigger className="w-full">
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
          <SelectTrigger className="w-full">
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

      <PieChartCard data={data.EXPENSE && getChartColors(data.EXPENSE)} />
      <PieChartCard data={data.INCOME && getChartColors(data.INCOME)} />
      <PieChartCard data={data.SAVING && getChartColors(data.SAVING)} />
    </div>
  );
}
