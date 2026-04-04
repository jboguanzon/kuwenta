import { useLiveQuery } from "@tanstack/react-db";
import { Link, useParams } from "@tanstack/react-router";
import { financialAccountsCollection } from "#/db-collections/financialAccounts";

export default function FinancialAccounts() {
	const { budgetId } = useParams({ from: "/budgets/$budgetId" });

	const { data: financialAccounts, isLoading } = useLiveQuery((q) =>
		q.from({ financialAccountsCollection }),
	);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="flex flex-col gap-10">
			<div className="flex flex-col gap-2">
				{financialAccounts.map((financialAccount) => (
					<Link
						key={financialAccount.id}
						to="/budgets/$budgetId/accounts/$accountId"
						params={{ budgetId: budgetId, accountId: financialAccount.id }}
						className="flex justify-between"
					>
						<span>{financialAccount.name}</span>
						<span>
							{financialAccount.currentBalance
								? financialAccount.currentBalance
								: "null"}
						</span>
					</Link>
				))}
			</div>
			<Link to="/budgets/$budgetId/accounts" params={{ budgetId: budgetId }}>
				Add Account
			</Link>
		</div>
	);
}
