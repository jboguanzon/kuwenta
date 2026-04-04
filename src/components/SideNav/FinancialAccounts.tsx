import { useLiveQuery } from "@tanstack/react-db";
import { Link, useParams } from "@tanstack/react-router";
import { financialAccountsCollection } from "#/db-collections/financialAccounts";

export default function FinancialAccounts() {
	const { budgetPlanId } = useParams({ from: "/budgetPlans/$budgetPlanId" });

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
						to="/budgetPlans/$budgetPlanId/accounts/$accountId"
						params={{
							budgetPlanId: budgetPlanId,
							accountId: financialAccount.id,
						}}
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
			<Link
				to="/budgetPlans/$budgetPlanId/accounts"
				params={{ budgetPlanId: budgetPlanId }}
			>
				Add Account
			</Link>
		</div>
	);
}
