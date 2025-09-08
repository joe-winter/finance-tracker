"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { TransactionType } from "@prisma/client";
import { Fragment, useState } from "react";
import { Form, useForm } from "react-hook-form";
import z from "zod";
import { trpc } from "@/app/_trpc/client";
import NewDialog from "@/app/components/finances/new-dialog";
import { CategoriesBadge } from "@/app/components/settings/categories-badge";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/app/components/ui/alert-dialog";
import { Button } from "@/app/components/ui/button";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/app/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/app/components/ui/select";
import type { GetCategories } from "@/lib/types";

export default function Settings() {
	const [editCategory, setEditCategory] = useState<string | null>(null);
	const [deleteCategory, setDeleteCategory] = useState<
		GetCategories[number] | null
	>(null);
	const utils = trpc.useUtils();
	const getCategories = trpc.category.getCategories.useQuery();
	const getTransactionsByCategory =
		trpc.transaction.getTransactionByCategoryCount.useQuery(
			{
				categoryId: deleteCategory?.id,
			},
			{ enabled: !!deleteCategory, refetchOnWindowFocus: false },
		);
	const deleteMutation = trpc.category.deleteCategory.useMutation();
	const formSchema = z
		.object({
			newId: z.string().optional(),
			oldId: z.string(),
		})
		.check((ctx) => {
			if (
				getTransactionsByCategory.data &&
				getTransactionsByCategory.data > 0 &&
				!ctx.value.newId
			) {
				ctx.issues.push({
					code: "invalid_value",
					input: ctx.value.newId,
					values: [],
					path: ["newId"],
					message: "Must select a category",
				});
			}
		});

	type FormSchema = z.infer<typeof formSchema>;
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			oldId: deleteCategory?.id,
		},
	});

	const handleEdit = (categoryId: string) => {
		setEditCategory(categoryId === editCategory ? null : categoryId);
	};

	const handleDelete = (category: GetCategories[number]) => {
		setDeleteCategory(category.id === deleteCategory?.id ? null : category);
		form.setValue("oldId", category.id);
	};

	const handleSubmit = (data: FormSchema) => {
		deleteMutation.mutate(data, {
			onSettled: () => {
				utils.category.getCategories.invalidate();
				setDeleteCategory(null);
			},
		});
	};

	return (
		<>
			<div className="flex flex-col gap-4 p-4">
				<div className="flex items-center justify-between">
					<h2 className="font-semibold text-lg">Categories</h2>
					<NewDialog />
				</div>
				<div className="flex flex-col gap-4">
					{Object.values(TransactionType).map((type) => (
						<Fragment key={type}>
							<p className="capitalize">{type.toLowerCase()}</p>
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								{getCategories.data
									?.filter((category) => category.type === type)
									.map((category) => (
										<CategoriesBadge
											key={category.id}
											category={category}
											isEdit={category.id === editCategory}
											isDisabled={
												!!editCategory && editCategory !== category.id
											}
											onEdit={() => handleEdit(category.id)}
											onDelete={() => handleDelete(category)}
										/>
									))}
							</div>
						</Fragment>
					))}
				</div>
			</div>
			<AlertDialog
				open={!!deleteCategory}
				onOpenChange={() => {
					setDeleteCategory(null);
					form.reset();
				}}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Category</AlertDialogTitle>
						<AlertDialogDescription>
							{getTransactionsByCategory.isPending
								? "Checking for transactions..."
								: !!getTransactionsByCategory.data &&
										getTransactionsByCategory.data > 0
									? "This category has existing transactions. Please reassign them before deletion."
									: "No transactions found for this category. It can be safely deleted."}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<Form {...form}>
						<form
							className="flex flex-col gap-4"
							onSubmit={form.handleSubmit(handleSubmit)}
						>
							{getTransactionsByCategory.data &&
							getTransactionsByCategory.data > 0 ? (
								<FormField
									control={form.control}
									name="newId"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Select New Category</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value ?? ""}
											>
												<FormControl>
													<SelectTrigger className="w-full capitalize">
														<SelectValue placeholder="Select" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{getCategories.data?.map((category) => {
														if (
															category.type === deleteCategory?.type &&
															category.id !== deleteCategory.id
														) {
															return (
																<SelectItem
																	key={category.id}
																	value={category.id}
																>
																	{category.name}
																</SelectItem>
															);
														}
													})}
												</SelectContent>
											</Select>
										</FormItem>
									)}
								/>
							) : (
								""
							)}
							<AlertDialogFooter>
								<AlertDialogCancel type="button">Cancel</AlertDialogCancel>
								<Button type="submit">Delete</Button>
							</AlertDialogFooter>
						</form>
					</Form>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
