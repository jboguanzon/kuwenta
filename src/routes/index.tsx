import { useLiveQuery } from "@tanstack/react-db";
import { createFileRoute } from "@tanstack/react-router";
import { budgetsCollection } from "#/db-collections";

export const Route = createFileRoute("/")({ component: App });

function App() {
	const { data: budgets, isLoading } = useLiveQuery((q) =>
		q.from({ budgetsCollection }),
	);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<main className="page-wrap px-4 pb-8 pt-14">
			<div>
				<h1>Budgets</h1>
				{budgets.map((budget) => (
					<div key={budget.id}>
						{budget.id} - {budget.name}
					</div>
				))}
			</div>
		</main>
	);
}
