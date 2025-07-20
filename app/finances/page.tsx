"use client";

import { trpc } from "../_trpc/client";

export default function Finances() {
  const getTransactions = trpc.transaction.getTransactions.useQuery();

  return (
    <div>
      {getTransactions.data?.map((el, index) => (
        <div key={index}>{el.amount}</div>
      ))}
    </div>
  );
}
