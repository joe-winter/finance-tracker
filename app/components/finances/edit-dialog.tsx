"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { TransactionType } from "@prisma/client";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { useForm } from "react-hook-form";
import z from "zod";
import { trpc } from "@/app/_trpc/client";
import type { GetTransactionOutput } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { dateToString } from "./new-dialog";

const formSchema = z.object({
	amount: z
		.string()
		.regex(/^(0|[1-9]\d*)\.\d{1,2}$/, {
			message: "Must be a number with exactly 2 decimal places",
		})
		.refine((val) => parseFloat(val) > 0, {
			message: "Money amount must be greater than 0",
		}),
	date: z.date(),
	description: z.string().min(1).max(500),
	categoryId: z.string(),
	id: z.string(),
});

type FormSchema = z.infer<typeof formSchema>;

interface EditDialog {
	data: GetTransactionOutput;
	isOpen: boolean;
	handleClose: () => void;
}

export default function EditDialog({ data, handleClose, isOpen }: EditDialog) {
	const utils = trpc.useUtils();
	const [calendarOpen, setCalendarOpen] = useState(false);
	const getCategories = trpc.category.getCategories.useQuery();
	const editMutation = trpc.transaction.editTransaction.useMutation();
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			amount: data.amount.toString(),
			date: data.dailyBalance.date ?? "",
			description: data.description,
			categoryId: data.category.id,
			id: data.id,
		},
	});

	console.log("form state", form.formState);

	const handleSubmit = (data: FormSchema) => {
		editMutation.mutate(data, {
			onSettled: () => {
				utils.transaction.getTransactions.invalidate();
				form.reset();
				handleClose();
			},
		});
	};
	return (
		<Dialog
			open={isOpen}
			onOpenChange={() => {
				form.reset();
				handleClose();
			}}
		>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Edit transaction</DialogTitle>
					<DialogDescription>Edit your transaction here</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit, (err) => {
							console.log(err);
						})}
						className="grid gap-4"
					>
						<FormField
							control={form.control}
							name="amount"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Amount</FormLabel>
									<FormControl>
										<CurrencyInput
											name={field.name}
											className={cn(
												"flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30",
												"focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
												"aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
											)}
											value={field.value}
											onValueChange={field.onChange}
											onBlur={field.onBlur}
											placeholder="Enter amount"
											prefix="£"
											step={0.01}
											decimalsLimit={2}
											allowNegativeValue={false}
											decimalScale={2}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="date"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Date</FormLabel>
									<Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant={"outline"}
													className={cn(
														"pl-3 text-left font-normal",
														!field.value && "text-muted-foreground",
													)}
												>
													{field.value ? (
														format(field.value, "PPP")
													) : (
														<span>Pick a date</span>
													)}
													<CalendarIcon className="ml-auto size-4 opacity-50" />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0" align="start">
											<Calendar
												mode="single"
												selected={new Date(field.value)}
												onSelect={(value) => {
													field.onChange(dateToString(value));
													setCalendarOpen(false);
												}}
												captionLayout="dropdown"
											/>
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="categoryId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Category</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger className="w-full capitalize">
												<SelectValue placeholder="Select" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{Object.values(TransactionType).map((type) => (
												<SelectGroup key={type}>
													<SelectLabel className="capitalize">
														{type.toLowerCase()}
													</SelectLabel>
													{getCategories.data
														?.filter((category) => category.type === type)
														.map((category) => (
															<SelectItem key={category.id} value={category.id}>
																{category.name}
															</SelectItem>
														))}
												</SelectGroup>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem className="size-full">
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea placeholder="..." className="h-full" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter>
							<DialogClose asChild>
								<Button variant="outline" type="button">
									Cancel
								</Button>
							</DialogClose>
							<Button type="submit">Confirm</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
