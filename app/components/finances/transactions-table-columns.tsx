import { TransactionType } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
	CalendarIcon,
	CircleDashedIcon,
	EditIcon,
	HandCoinsIcon,
	MoreHorizontalIcon,
	PiggyBankIcon,
	TrashIcon,
	TrendingDownIcon,
} from "lucide-react";
import type { GetCategories, GetTransactionsOutput } from "@/lib/types";
import { DataTableHeader } from "../data-table/data-table-header";
import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface TransactionTableColumnsProps {
	handleDelete: (id: string) => void;
	handleEdit: (id: string) => void;
	categories: GetCategories;
}

export const getTransactionTableColumns = ({
	handleDelete,
	handleEdit,
	categories,
}: TransactionTableColumnsProps): ColumnDef<
	GetTransactionsOutput[number]
>[] => {
	return [
		{
			id: "date",
			accessorKey: "date",
			header: ({ column }) => <DataTableHeader column={column} title="Date" />,
			cell: ({ row }) => format(row.original.date, "PPP"),
			filterFn: "inNumberRange",
			meta: {
				label: "Date",
				variant: "dateRange",
				icon: CalendarIcon,
			},

			sortUndefined: "last",
			enableColumnFilter: true,
		},
		{
			accessorKey: "type",
			header: ({ column }) => <DataTableHeader column={column} title="Type" />,
			cell: ({ row }) => (
				<div className="flex items-center gap-2 capitalize">
					{row.original.type === "INCOME" && (
						<HandCoinsIcon className="size-4" />
					)}
					{row.original.type === "EXPENSE" && (
						<TrendingDownIcon className="size-4" />
					)}
					{row.original.type === "SAVING" && (
						<PiggyBankIcon className="size-4" />
					)}
					{row.original.type.toLowerCase()}
				</div>
			),
			filterFn: "arrIncludesSome",
			meta: {
				label: "Type",
				variant: "multiSelect",
				options: Object.keys(TransactionType).map((type) => ({
					label: type.charAt(0).toUpperCase() + type.slice(1).toLowerCase(),
					value: type,
				})),
				icon: CircleDashedIcon,
			},
			enableColumnFilter: true,
			enableGlobalFilter: true,
		},
		{
			accessorKey: "name",
			header: ({ column }) => (
				<DataTableHeader column={column} title="Category" />
			),
			cell: ({ row }) => row.original.name,
			filterFn: "arrIncludesSome",
			meta: {
				label: "Categories",
				variant: "multiSelect",
				options: categories?.map((category) => ({
					label:
						category.name.charAt(0).toUpperCase() +
						category.name.slice(1).toLowerCase(),
					value: category.name,
				})),
				icon: CircleDashedIcon,
			},
			enableColumnFilter: true,
			enableGlobalFilter: true,
		},
		{
			accessorKey: "amount",
			header: ({ column }) => (
				<DataTableHeader column={column} title="Amount" />
			),
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
				}).format(Number(row.original.balance)),
		},
		{
			accessorKey: "description",
			header: "Description",
			cell: ({ row }) => (
				<p className="max-w-20 overflow-hidden text-ellipsis">
					{row.original.description}
				</p>
			),
			enableGlobalFilter: true,
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
							<DropdownMenuItem onClick={() => handleEdit(row.original.id)}>
								<EditIcon size={16} />
								Edit
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];
};
