import NewDialog from "../components/finances/new-dialog";
import TransactionTable from "../components/finances/transactions-table";

export default async function Finances() {
	return (
		<div className="flex flex-col gap-4 p-4">
			<div className="flex items-center justify-between">
				<h2 className="font-semibold text-lg">Transactions</h2>

				<NewDialog />
			</div>
			<TransactionTable />
		</div>
	);
}
