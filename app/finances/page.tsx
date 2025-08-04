import TransactionTable from "../components/finances/transactions-table";
import TransactionForm from "../components/finances/transaction-form";

export default async function Finances() {
	return (
		<div className="flex flex-col gap-4 p-4">
			<div className="flex items-center justify-between">
				<h2>Transaction Table</h2>

				<TransactionForm />
			</div>
			<TransactionTable />
		</div>
	);
}
