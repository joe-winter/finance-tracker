"use client";

import {
	CheckIcon,
	EditIcon,
	HandCoinsIcon,
	PiggyBankIcon,
	TrashIcon,
	TrendingDownIcon,
	XIcon,
} from "lucide-react";
import type { DeleteCategoryOutput } from "@/lib/types";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { trpc } from "@/app/_trpc/client";

interface CategoriesBadgeProps {
	category: DeleteCategoryOutput;
	isEdit: boolean;
	isDisabled: boolean;
	onEdit: () => void;
	onDelete: () => void;
}

const formSchema = z.object({ name: z.string().min(1).max(30) });

type FormSchema = z.infer<typeof formSchema>;

export const CategoriesBadge = ({
	category,
	isEdit,
	isDisabled,
	onEdit,
	onDelete,
}: CategoriesBadgeProps) => {
	const utils = trpc.useUtils();
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: category.name,
		},
	});
	const updateMutation = trpc.category.updateCategory.useMutation({
		onMutate: () => {
			utils.category.getCategories.cancel();
			const prevCategories = utils.category.getCategories.getData();

			utils.category.getCategories.setData(undefined, (old) => {
				if (!old) return old;

				const updated = old.map((el) => {
					if (el.type === category.type && el.name === category.name) {
						return { ...el, name: form.getValues("name") };
					}
					return el;
				});

				return updated;
			});

			return { prevCategories };
		},
	});

	const handleEdit = (data: FormSchema) => {
		updateMutation.mutate(
			{ id: category.id, name: data.name },
			{
				onSuccess: () => {
					onEdit();
				},
				onSettled: () => {
					utils.category.getCategories.invalidate();
				},
			},
		);
	};
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleEdit)}
				className={cn(
					"flex h-9 w-full shrink-0 items-center justify-between gap-2 whitespace-nowrap rounded-md border bg-background px-4 py-2 font-medium text-sm shadow-xs outline-none transition-all hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 has-[>svg]:px-3 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:border-input dark:bg-input/30 dark:aria-invalid:ring-destructive/40 dark:hover:bg-input/50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
					{ "opacity-50": isDisabled },
				)}
			>
				<div className="flex w-full items-center gap-2">
					{category.type === "INCOME" && <HandCoinsIcon className="size-4" />}
					{category.type === "EXPENSE" && (
						<TrendingDownIcon className="size-4" />
					)}
					{category.type === "SAVING" && <PiggyBankIcon className="size-4" />}

					{isEdit ? (
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem className="w-full">
									<FormControl>
										<input
											className="w-full border-none outline-0"
											{...field}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
					) : (
						<span>{category.name}</span>
					)}
				</div>

				<div className="flex gap-2">
					{isEdit ? (
						<>
							<Button
								variant="ghost"
								size="icon"
								className="group size-4"
								onClick={(e) => {
									e.stopPropagation();
									onEdit();
								}}
								disabled={isDisabled}
								type="button"
							>
								<XIcon className="size-4 stroke-muted-foreground group-hover:stroke-destructive" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="group size-4"
								disabled={isDisabled}
								type="submit"
							>
								<CheckIcon className="size-4 stroke-muted-foreground group-hover:stroke-green-500" />
							</Button>
						</>
					) : (
						<>
							<Button
								variant="ghost"
								size="icon"
								className="group size-4"
								onClick={(e) => {
									e.stopPropagation();
									onEdit();
								}}
								disabled={isDisabled}
								type="button"
							>
								<EditIcon className="size-4 stroke-muted-foreground group-hover:stroke-primary" />
							</Button>
							<Button
								className="group size-4"
								variant="ghost"
								size="icon"
								disabled={isDisabled}
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									onDelete();
								}}
							>
								<TrashIcon className="size-4 stroke-muted-foreground group-hover:stroke-destructive" />
							</Button>
						</>
					)}
				</div>
			</form>
		</Form>
	);
};
