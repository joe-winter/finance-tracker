"use client";

import type { GetTransactionsOutput } from "@/lib/types";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { EditIcon, MoreHorizontalIcon, TrashIcon } from "lucide-react";
import { DataTable } from "./data-table";
import { trpc } from "@/app/_trpc/client";

export default function TransactionTable() {
  const utils = trpc.useUtils();
  const getTransactions = trpc.transaction.getTransactions.useQuery({});
  const deleteMutation = trpc.transaction.deleteTransaction.useMutation();

  const handleDelete = (id: string) => {
    deleteMutation.mutate(
      { id },
      {
        onSuccess: () => {
          utils.transaction.getTransactions.invalidate();
        },
      }
    );
  };

  const columns: ColumnDef<GetTransactionsOutput[number]>[] = [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => format(row.original.dailyBalance.date, "PPP"),
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
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                variant="destructive"
                onClick={() => handleDelete(row.original.id)}
              >
                <TrashIcon size={16} />
                Delete
              </DropdownMenuItem>
              <DropdownMenuItem>
                <EditIcon size={16} />
                Edit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  return <DataTable columns={columns} data={getTransactions.data ?? []} />;
}
