"use client";

import type { Column, Table } from "@tanstack/react-table";
import { SearchIcon, X } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { DataTableDateFilter } from "./data-table-date-filter";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
// import { DataTableSliderFilter } from "./data-table-slider-filter";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableToolbarProps<TData> extends React.ComponentProps<"div"> {
	table: Table<TData>;
}

export function DataTableToolbar<TData>({
	table,
	children,
	className,
	...props
}: DataTableToolbarProps<TData>) {
	const isFiltered = table.getState().columnFilters.length > 0;

	const columns = React.useMemo(
		() => table.getAllColumns().filter((column) => column.getCanFilter()),
		[table],
	);

	const onReset = React.useCallback(() => {
		table.resetColumnFilters();
	}, [table]);

	return (
		<div
			role="toolbar"
			aria-orientation="horizontal"
			className={cn(
				"flex w-full items-start justify-between gap-2 p-1",
				className,
			)}
			{...props}
		>
			<div className="flex flex-1 flex-wrap items-center gap-2">
				<div className="*:not-first:mt-2">
					<div className="relative">
						<Input
							id="global-filter"
							className="peer h-8 w-40 ps-9 lg:w-56"
							placeholder={"Search ..."}
							value={(table.getState().globalFilter as string) ?? ""}
							onChange={(event) => table.setGlobalFilter(event.target.value)}
						/>
						<div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
							<SearchIcon size={16} aria-hidden="true" />
						</div>
					</div>
				</div>
				{columns.map((column) => (
					<DataTableToolbarFilter key={column.id} column={column} />
				))}
				{isFiltered && (
					<Button
						aria-label="Reset filters"
						variant="outline"
						size="sm"
						className="border-dashed"
						onClick={onReset}
					>
						<X />
						Reset
					</Button>
				)}
			</div>
			<div className="flex items-center gap-2">
				{children}
				<DataTableViewOptions table={table} />
			</div>
		</div>
	);
}
interface DataTableToolbarFilterProps<TData> {
	column: Column<TData>;
}

function DataTableToolbarFilter<TData>({
	column,
}: DataTableToolbarFilterProps<TData>) {
	{
		const columnMeta = column.columnDef.meta;

		const onFilterRender = React.useCallback(() => {
			if (!columnMeta?.variant) return null;

			switch (columnMeta.variant) {
				case "text":
					return (
						<Input
							placeholder={columnMeta.placeholder ?? columnMeta.label}
							value={(column.getFilterValue() as string) ?? ""}
							onChange={(event) => column.setFilterValue(event.target.value)}
							className="h-8 w-40 lg:w-56"
						/>
					);

				case "number":
					return (
						<div className="relative">
							<Input
								type="number"
								inputMode="numeric"
								placeholder={columnMeta.placeholder ?? columnMeta.label}
								value={(column.getFilterValue() as string) ?? ""}
								onChange={(event) => column.setFilterValue(event.target.value)}
								className={cn("h-8 w-[120px]", columnMeta.unit && "pr-8")}
							/>
							{columnMeta.unit && (
								<span className="absolute top-0 right-0 bottom-0 flex items-center rounded-r-md bg-accent px-2 text-muted-foreground text-sm">
									{columnMeta.unit}
								</span>
							)}
						</div>
					);

				// case "range":
				//   return (
				//     <DataTableSliderFilter
				//       column={column}
				//       title={columnMeta.label ?? column.id}
				//     />
				//   );

				case "date":
				case "dateRange":
					return (
						<DataTableDateFilter
							column={column}
							title={columnMeta.label ?? column.id}
							multiple={columnMeta.variant === "dateRange"}
						/>
					);

				case "select":
				case "multiSelect":
					return (
						<DataTableFacetedFilter
							column={column}
							title={columnMeta.label ?? column.id}
							options={columnMeta.options}
							multiple={columnMeta.variant === "multiSelect"}
						/>
					);

				default:
					return null;
			}
		}, [column, columnMeta]);

		return onFilterRender();
	}
}
