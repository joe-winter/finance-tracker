"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
	EditIcon,
	HandCoinsIcon,
	MoreHorizontalIcon,
	PiggyBankIcon,
	TrashIcon,
	TrendingDownIcon,
} from "lucide-react";
import { useState } from "react";
import { trpc } from "@/app/_trpc/client";
import type { GetTransactionsOutput } from "@/lib/types";
import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { DataTable } from "./data-table";
import EditDialog from "./edit-dialog";

export default function TransactionTable() {
	const [editingId, setEditingId] = useState<string | undefined>(undefined);
	const utils = trpc.useUtils();
	const getTransaction = trpc.transaction.getTransaction.useQuery(
		{
			id: editingId,
		},
		{ enabled: !!editingId },
	);
	const getTransactions = trpc.transaction.getTransactions.useQuery();
	const deleteMutation = trpc.transaction.deleteTransaction.useMutation();

	const handleDelete = (id: string) => {
		deleteMutation.mutate(
			{ id },
			{
				onSuccess: () => {
					utils.transaction.getTransactions.invalidate();
				},
			},
		);
	};

	const isEditOpen =
		!!editingId && !!getTransaction.data && !getTransaction.isLoading;

	const handleClose = () => {
		setEditingId(undefined);
	};
	const columns: ColumnDef<GetTransactionsOutput[number]>[] = [
		{
			accessorKey: "date",
			header: "Date",
			cell: ({ row }) => format(row.original.dailyBalance.date, "PPP"),
			sortUndefined: "last",
			sortDescFirst: false,
		},
		{
			accessorKey: "type",
			header: "Type",
			cell: ({ row }) => (
				<div className="flex items-center gap-2 capitalize">
					{row.original.category.type === "INCOME" && (
						<HandCoinsIcon className="size-4" />
					)}
					{row.original.category.type === "EXPENSE" && (
						<TrendingDownIcon className="size-4" />
					)}
					{row.original.category.type === "SAVING" && (
						<PiggyBankIcon className="size-4" />
					)}
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
			cell: ({ row }) =>
				new Intl.NumberFormat("en-GB", {
					style: "currency",
					currency: "GBP",
				}).format(Number(row.original.amount)),
		},
		{
			accessorKey: "balance",
			header: "Balance",
			cell: ({ row }) =>
				new Intl.NumberFormat("en-GB", {
					style: "currency",
					currency: "GBP",
				}).format(Number(row.original.dailyBalance.balance)),
		},
		{
			accessorKey: "description",
			header: "Description",
			cell: ({ row }) => (
				<p className="max-w-20 overflow-hidden text-ellipsis">
					{row.original.description}
				</p>
			),
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
							<DropdownMenuItem onClick={() => setEditingId(row.original.id)}>
								<EditIcon size={16} />
								Edit
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];
	return (
		<>
			<DataTable columns={columns} data={getTransactions.data ?? []} />
			{isEditOpen && getTransaction.data && (
				<EditDialog
					data={getTransaction.data}
					isOpen={isEditOpen}
					handleClose={handleClose}
				/>
			)}
		</>
	);
}
