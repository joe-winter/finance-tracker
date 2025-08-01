import type { GetTransactionsOutput } from "@/lib/types";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../data-table";
import { format } from "date-fns";

const columns: ColumnDef<GetTransactionsOutput[number]>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => format(row.original.date, "PPP"),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.original.category.type.toLowerCase()}
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => row.original.category.name,
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "balance",
    header: "Balance",
    cell: ({ row }) => row.original.dailyBalance.balance,
  },
  {
    accessorKey: "description",
    header: "Description",
  },
];

interface TransactionTableProps {
  data: GetTransactionsOutput;
}

export const TransactionTable = ({ data }: TransactionTableProps) => {
  return <DataTable columns={columns} data={data} />;
};
