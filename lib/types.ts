// @filename: client.ts

import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/app/server/routers/_app";

type RouterInput = inferRouterInputs<AppRouter>;
type RouterOutput = inferRouterOutputs<AppRouter>;

export type DeleteCategoryOutput = RouterOutput["category"]["deleteCategory"];

export type GetTransactionsOutput =
  RouterOutput["transaction"]["getTransactions"];
export type GetTransactionOutput =
  RouterOutput["transaction"]["getTransaction"];

export type GetCategories = RouterOutput["category"]["getCategories"];
