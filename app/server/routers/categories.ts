import z from "zod";
import prisma from "@/lib/prisma";
import { protectedProcedure, router } from "../trpc";
import { TransactionType } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const categorySchema = z.object({
	name: z.string().min(1).max(30),
	type: z.enum(Object.values(TransactionType)),
});

const updateCategorySchema = z.object({
	name: z.string().min(1).max(30),
	id: z.string(),
});

const deleteCategorySchema = z.object({
	newId: z.nanoid().optional(),
	oldId: z.nanoid(),
});

export type categorySchema = z.infer<typeof categorySchema>;

export const categoryRouter = router({
	getCategories: protectedProcedure.query(async ({ ctx }) => {
		return await prisma.category.findMany({
			where: { userId: ctx.auth.userId },
			orderBy: { createdAt: "desc" },
		});
	}),
	createCategory: protectedProcedure
		.input(categorySchema)
		.mutation(async ({ input, ctx }) => {
			return await prisma.category.create({
				data: { ...input, userId: ctx.auth.userId },
			});
		}),

	deleteCategory: protectedProcedure
		.input(deleteCategorySchema)
		.mutation(async ({ input, ctx }) => {
			const transactionCount = await prisma.transaction.count({
				where: {
					userId: ctx.auth.userId,
					categoryId: input.oldId,
				},
			});
			if (transactionCount === 0) {
				return await prisma.category.delete({
					where: {
						id: input.oldId,
						userId: ctx.auth.userId,
					},
				});
			}
			if (!input.newId) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "No new category given",
				});
			}
			const category = await prisma.category.findUnique({
				select: { id: true, type: true },
				where: { id: input.newId, userId: ctx.auth.userId },
			});

			if (!category?.id) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Category not found",
				});
			}
			// If the new category is the same as the category on the transactions
			if (input.newId === input.oldId) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Must select a different category",
				});
			}
			return await prisma.$transaction(async (tx) => {
				await tx.transaction.updateMany({
					data: {
						categoryId: input.newId,
					},
					where: {
						categoryId: input.oldId,
						userId: ctx.auth.userId,
					},
				});
				return await tx.category.delete({
					where: { id: input.oldId },
				});
			});
		}),
	updateCategory: protectedProcedure
		.input(updateCategorySchema)
		.mutation(async ({ input }) => {
			return await prisma.category.update({
				data: { name: input.name },
				where: { id: input.id },
			});
		}),
});

export type CategoryRouter = typeof categoryRouter;
