import z from "zod";
import prisma from "@/lib/prisma";
import { protectedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { endOfDay, isSameDay } from "date-fns";

export const transactionSchema = z.object({
	amount: z
		.string()
		.regex(/^(0|[1-9]\d*)\.\d{1,2}$/, {
			message: "Must be a number with exactly 2 decimal places",
		})
		.refine((val) => parseFloat(val) > 0, {
			message: "Money amount must be greater than 0",
		}),
	date: z.preprocess((arg) => {
		if (typeof arg === "string") return new Date(arg);
		return arg;
	}, z.date()),
	description: z.string().min(1).max(500),
	categoryId: z.string(),
});

export type TransactionSchema = z.infer<typeof transactionSchema>;

export const transactionRouter = router({
	getTransactions: protectedProcedure
		.input(
			z.object({
				skip: z.number().default(0).optional(),
				take: z.number().default(10).optional(),
			}),
		)
		.query(async ({ input, ctx }) => {
			return await prisma.transaction.findMany({
				skip: input.skip,
				take: input.take,
				select: {
					id: true,
					amount: true,
					description: true,
					category: {
						select: {
							name: true,
							type: true,
						},
					},
					dailyBalance: {
						select: {
							balance: true,
							date: true,
						},
					},
				},
				where: { userId: ctx.auth.userId },
				orderBy: [
					{
						date: "desc",
					},
					{ createdAt: "desc" },
				],
			});
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
					category: {
						select: {
							id: true,
							name: true,
							type: true,
						},
					},
					dailyBalance: {
						select: {
							balance: true,
							date: true,
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
			const normalizedDate = endOfDay(date);
			const amountNumber = parseFloat(amount);
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

			const latestBalance = await prisma.dailyBalance.findFirst({
				select: {
					balance: true,
				},
				where: {
					userId,
					date: { lte: normalizedDate },
				},
				orderBy: {
					date: "desc",
				},
			});

			const balanceChange =
				category.type === "INCOME" ? amountNumber : -amountNumber;

			const initialBalance = latestBalance?.balance
				? latestBalance.balance.add(balanceChange)
				: balanceChange;

			return await prisma.$transaction(async (tx) => {
				const balance = await tx.dailyBalance.upsert({
					where: {
						userId_date: {
							userId,
							date: normalizedDate,
						},
					},
					create: {
						userId,
						balance: initialBalance,
						date: normalizedDate,
					},
					update: {
						userId,
						balance: {
							...(category.type === "INCOME"
								? { increment: amountNumber }
								: { decrement: amountNumber }),
						},
						date: normalizedDate,
					},
					select: {
						id: true,
					},
				});

				await tx.dailyBalance.updateMany({
					data: {
						balance: {
							...(category.type === "INCOME"
								? { increment: amountNumber }
								: { decrement: amountNumber }),
						},
					},
					where: {
						userId,
						date: { gt: normalizedDate },
					},
				});

				return await tx.transaction.create({
					data: {
						amount: amountNumber,
						date: normalizedDate,
						description,
						userId,
						categoryId,
						dailyBalanceId: balance.id,
					},
				});
			});
		}),
	deleteTransaction: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ input, ctx }) => {
			const userId = ctx.auth.userId;

			return await prisma.$transaction(async (tx) => {
				const transaction = await tx.transaction.delete({
					where: {
						id: input.id,
					},
					select: {
						amount: true,
						category: {
							select: {
								type: true,
							},
						},
						dailyBalance: {
							select: {
								date: true,
							},
						},
					},
				});

				await tx.dailyBalance.updateMany({
					data: {
						balance: {
							...(transaction.category.type === "INCOME"
								? { decrement: transaction.amount }
								: { increment: transaction.amount }),
						},
					},
					where: {
						userId,
						date: { gte: transaction.dailyBalance.date },
					},
				});
			});
		}),
	editTransaction: protectedProcedure
		.input(transactionSchema.extend({ id: z.string() }))
		.mutation(async ({ input, ctx }) => {
			const userId = ctx.auth.userId;
			const { date, amount, categoryId, description, id } = input;
			const normalizedDate = endOfDay(date);

			const transaction = await prisma.transaction.findUnique({
				where: { id },
				select: {
					dailyBalanceId: true,
					amount: true,
					date: true,
					category: { select: { type: true, id: true } },
				},
			});

			if (!transaction) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Transaction not found",
				});
			}

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

			return await prisma.$transaction(async (tx) => {
				const transaction = await tx.transaction.delete({
					where: {
						id,
					},
					select: {
						amount: true,
						category: {
							select: {
								type: true,
							},
						},
						dailyBalance: {
							select: {
								date: true,
							},
						},
					},
				});

				await tx.dailyBalance.updateMany({
					data: {
						balance: {
							...(transaction.category.type === "INCOME"
								? { decrement: transaction.amount }
								: { increment: transaction.amount }),
						},
					},
					where: {
						userId,
						date: { gte: transaction.dailyBalance.date },
					},
				});

				const latestBalance = await tx.dailyBalance.findFirst({
					select: { balance: true },
					where: {
						userId,
						date: { lte: normalizedDate },
					},
					orderBy: { date: "desc" },
				});

				const balanceChange = category.type === "INCOME" ? amount : -amount;
				const initialBalance = latestBalance?.balance
					? latestBalance.balance.add(balanceChange)
					: balanceChange;

				const balance = await tx.dailyBalance.upsert({
					where: {
						userId_date: {
							userId,
							date: normalizedDate,
						},
					},
					create: {
						userId,
						balance: initialBalance,
						date: normalizedDate,
					},
					update: {
						balance: {
							...(category.type === "INCOME"
								? { increment: amount }
								: { decrement: amount }),
						},
					},
					select: { id: true },
				});

				await tx.dailyBalance.updateMany({
					data: {
						balance: {
							...(category.type === "INCOME"
								? { increment: amount }
								: { decrement: amount }),
						},
					},
					where: {
						userId,
						date: { gt: normalizedDate },
					},
				});

				return await tx.transaction.create({
					data: {
						amount,
						date: normalizedDate,
						description,
						userId,
						categoryId,
						dailyBalanceId: balance.id,
					},
				});
			});
		}),
});

export type TransactionsRouter = typeof transactionRouter;
