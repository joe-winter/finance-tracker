"use client";

import { trpc } from "../_trpc/client";

export default function Finances() {
  const getTransactions = trpc.transaction.getTransactions.useQuery();

  return (
    <div>
      {getTransactions.data?.map((el) => (
        <div key={el.id}>{el.amount}</div>
      ))}
    </div>
  );
}
