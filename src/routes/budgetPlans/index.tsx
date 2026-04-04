import { useLiveQuery } from "@tanstack/react-db";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Input } from "#/components/ui/input";
import { budgetPlansCollection } from "#/db-collections/budgetPlans";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from "@/components/ui/field";

export const Route = createFileRoute("/budgetPlans/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data: budgets, isLoading: isLoadingBudgets } = useLiveQuery((q) =>
		q.from({ budgetPlansCollection }),
	);

	const budgetForm = useForm({
		defaultValues: {
			name: "",
		},
		onSubmit: async ({ value }) => {
			budgetPlansCollection.insert({
				id: crypto.randomUUID(),
				name: value.name,
				createdAt: null,
			});
		},
	});

	if (isLoadingBudgets) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<h1>Budgets</h1>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					budgetForm.handleSubmit();
				}}
			>
				<FieldSet>
					<FieldGroup>
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
									<Field>
										<FieldLabel htmlFor={field.name}>Budget Name:</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											autoComplete="off"
										/>
										<FieldDescription>Name of budget.</FieldDescription>
									</Field>
								);
							}}
						</budgetForm.Field>
						<budgetForm.Subscribe
							selector={(state) => [state.canSubmit, state.isSubmitting]}
						>
							{([canSubmit, isSubmitting]) => (
								<div className="">
									<Button type="submit" disabled={!canSubmit}>
										{isSubmitting ? "..." : "Submit"}
									</Button>
									<Button
										type="reset"
										onClick={(e) => {
											e.preventDefault();
											budgetForm.reset();
										}}
									>
										Reset
									</Button>
								</div>
							)}
						</budgetForm.Subscribe>
					</FieldGroup>
				</FieldSet>
			</form>

			<div className="flex flex-col">
				{budgets.map((budget) => (
					<Link
						key={budget.id}
						to="/budgetPlans/$budgetPlanId"
						params={{ budgetPlanId: budget.id }}
					>
						{`${budget.id} - ${budget.name} - ${budget.createdAt}`}
					</Link>
				))}
			</div>
		</div>
	);
}
