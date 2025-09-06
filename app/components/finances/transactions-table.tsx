"use client";

import { useState } from "react";
import { trpc } from "@/app/_trpc/client";
import { DataTable } from "../data-table/data-table";
import { DataTableSkeleton } from "../data-table/data-table-skeleton";
import EditDialog from "./edit-dialog";
import { getTransactionTableColumns } from "./transactions-table-columns";

export default function TransactionTable() {
	const [editingId, setEditingId] = useState<string | undefined>(undefined);
	const utils = trpc.useUtils();
	const getTransaction = trpc.transaction.getTransaction.useQuery(
		{
			id: editingId,
		},
		{ enabled: !!editingId },
	);
	const getCategories = trpc.category.getCategories.useQuery();
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

	const handleEdit = (id: string) => {
		setEditingId(id);
	};

	const isEditOpen =
		!!editingId && !!getTransaction.data && !getTransaction.isLoading;

	const handleClose = () => {
		setEditingId(undefined);
	};
	return (
		<>
			{getCategories.data ? (
				<DataTable
					columns={getTransactionTableColumns({
						handleDelete,
						handleEdit,
						categories: getCategories.data,
					})}
					data={getTransactions.data ?? []}
				/>
			) : (
				<DataTableSkeleton columnCount={5} filterCount={3} />
			)}
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
