import type { GetTransactionsOutput } from "@/lib/types";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../data-table";

const columns: ColumnDef<GetTransactionsOutput[number]>[] = [
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.type.toLowerCase()}</div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => row.original.category?.name,
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "balance",
    header: "Balance",
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
