import { useLiveQuery } from "@tanstack/react-db";
import { useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { budgetsCollection } from "#/db-collections";

export const Route = createFileRoute("/")({ component: App });

function App() {
	const { data: budgets, isLoading } = useLiveQuery((q) =>
		q.from({ budgetsCollection }),
	);

	const budgetForm = useForm({
		defaultValues: {
			name: "",
		},
		onSubmit: async ({ value }) => {
			console.log(value);
			budgetsCollection.insert({
				id: crypto.randomUUID(),
				name: value.name,
				createdAt: null,
			});
		},
	});

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<main className="page-wrap px-4 pb-8 pt-14">
			<div>
				<h1>Budgets</h1>

				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						budgetForm.handleSubmit();
					}}
				>
					<budgetForm.Field
						name="name"
						validators={{
							onChange: ({ value }) => {
								!value ? "Name cannot be empty" : undefined;
							},
						}}
					>
						{(field) => {
							return (
								<>
									<label htmlFor={field.name}>Budget Name:</label>
									<input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
									/>
								</>
							);
						}}
					</budgetForm.Field>
					<budgetForm.Subscribe
						selector={(state) => [state.canSubmit, state.isSubmitting]}
					>
						{([canSubmit, isSubmitting]) => (
							<>
								<button type="submit" disabled={!canSubmit}>
									{isSubmitting ? "..." : "Submit"}
								</button>
								<button
									type="reset"
									onClick={(e) => {
										e.preventDefault();
										budgetForm.reset();
									}}
								>
									Reset
								</button>
							</>
						)}
					</budgetForm.Subscribe>
				</form>

				{budgets.map((budget) => (
					<div key={budget.id}>
						{budget.id} - {budget.name}
					</div>
				))}
			</div>
		</main>
	);
}
