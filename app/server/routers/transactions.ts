import { getTransactionsWithDailyBalance } from "@prisma/client/sql";
import { TRPCError } from "@trpc/server";
import z from "zod";
import prisma from "@/lib/prisma";
import { protectedProcedure, router } from "../trpc";
export const transactionSchema = z.object({
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
});

function normalizeDate(date: Date): Date {
	// Clone the date and set to start of day in local timezone
	const normalized = new Date(date);
	normalized.setHours(0, 0, 0, 0);
	return normalized;
}
export type TransactionSchema = z.infer<typeof transactionSchema>;

export const transactionRouter = router({
	getTransactions: protectedProcedure.query(async ({ ctx }) => {
		return await prisma.$queryRawTyped(
			getTransactionsWithDailyBalance(ctx.auth.userId),
		);
	}),
	getTransaction: protectedProcedure
		.input(
			z.object({
				id: z.string().optional(),
			}),
		)
		.query(async ({ input, ctx }) => {
			if (!input.id) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "No transaction ID given",
				});
			}
			const transaction = await prisma.transaction.findUnique({
				select: {
					id: true,
					amount: true,
					description: true,
					date: true,
					category: {
						select: {
							id: true,
							name: true,
							type: true,
						},
					},
				},
				where: { userId: ctx.auth.userId, id: input.id },
			});

			if (!transaction) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Transaction not found",
				});
			}

			return transaction;
		}),
	getTransactionByCategoryCount: protectedProcedure
		.input(
			z.object({
				categoryId: z.nanoid().optional(),
			}),
		)
		.query(async ({ input, ctx }) => {
			if (!input.categoryId) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "No Category ID given",
				});
			}
			return await prisma.transaction.count({
				where: {
					userId: ctx.auth.userId,
					categoryId: input.categoryId,
				},
			});
		}),
	createTransaction: protectedProcedure
		.input(transactionSchema)
		.mutation(async ({ input, ctx }) => {
			const userId = ctx.auth.userId;
			const { date, amount, categoryId, description } = input;
			const normalizedDate = normalizeDate(date);
			const category = await prisma.category.findUnique({
				select: { id: true, type: true },
				where: { id: input.categoryId },
			});

			if (!category?.id) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Category not found",
				});
			}

			return await prisma.transaction.create({
				data: {
					amount,
					date: normalizedDate,
					description,
					userId,
					categoryId,
				},
			});
		}),
	deleteTransaction: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ input }) => {
			return await prisma.transaction.delete({
				where: {
					id: input.id,
				},
			});
		}),
	editTransaction: protectedProcedure
		.input(transactionSchema.extend({ id: z.string() }))
		.mutation(async ({ input }) => {
			const { date, amount, categoryId, description, id } = input;

			return await prisma.transaction.update({
				data: { date, amount, categoryId, description },
				where: { id },
			});
		}),
});

export type TransactionsRouter = typeof transactionRouter;
