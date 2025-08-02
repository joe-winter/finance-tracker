import TransactionTable from "../components/finances/transactions-table";
import TransactionForm from "../components/finances/transaction-form";

export default async function Finances() {
  return (
    <div className="flex flex-col gap-4">
      <TransactionForm />
      <TransactionTable />
    </div>
  );
}
