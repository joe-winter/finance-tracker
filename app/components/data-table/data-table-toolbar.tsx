"use client";

import type { Column, Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { ExpandableSearch } from "../expandable-search";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Scroller } from "../ui/scroller";
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
			<div className="flex flex-1 items-center gap-2">
				<ExpandableSearch
					placeholder={"Search ..."}
					value={(table.getState().globalFilter as string) ?? ""}
					onChange={(event) => table.setGlobalFilter(event.target.value)}
					onClear={() => table.resetGlobalFilter()}
				/>
				{/* This is to make the scroll fill out its width. Nice trick from stack overflow. https://stackoverflow.com/questions/78341914/how-can-i-make-the-shadcn-ui-scrollarea-take-full-width-and-add-a-scroll-when-th */}
				{/* <div className="flex w-full">
          <ScrollArea className="w-0 flex-1">
            <div className="flex gap-2">
              {columns.map((column) => (
                <DataTableToolbarFilter key={column.id} column={column} />
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="w-full" />
          </ScrollArea>
        </div> */}
				<div className="flex w-full">
					<Scroller
						orientation="horizontal"
						className="w-0 flex-1"
						hideScrollbar
						asChild
					>
						<div className="flex gap-2">
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
					</Scroller>
				</div>
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
