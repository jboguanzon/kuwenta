import { useLiveQuery } from "@tanstack/react-db";
import { useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { Input } from "#/components/ui/input";
import { budgetsCollection } from "#/db-collections/budgets";
import { financialAccountsCollection } from "#/db-collections/financialAccounts";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from "@/components/ui/field";

export const Route = createFileRoute("/")({ component: App });

function App() {
	const { data: budgets, isLoading: isLoadingBudgets } = useLiveQuery((q) =>
		q.from({ budgetsCollection }),
	);
	const { data: financialAccounts, isLoading: isLoadingFinancialAccounts } =
		useLiveQuery((q) => q.from({ financialAccountsCollection }));

	const financialAccountForm = useForm({
		defaultValues: {
			name: "",
			currentBalance: "",
		},
		onSubmit: async ({ value }) => {
			financialAccountsCollection.insert({
				id: crypto.randomUUID(),
				name: value.name,
				currentBalance: value.currentBalance
					? Number(value.currentBalance)
					: null,
				createdAt: null,
			});
		},
	});

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

	if (isLoadingBudgets && isLoadingFinancialAccounts) {
		return <div>Loading...</div>;
	}

	return (
		<main className="page-wrap px-4 pb-8 pt-14">
			<div>
				<h1>Financial Accounts</h1>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						financialAccountForm.handleSubmit();
					}}
				>
					<FieldSet>
						<FieldGroup>
							<financialAccountForm.Field
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
											<FieldLabel htmlFor={field.name}>
												Financial Account Name
											</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												autoComplete="off"
											/>
											<FieldDescription>
												Name of financial account.
											</FieldDescription>
										</Field>
									);
								}}
							</financialAccountForm.Field>
							<financialAccountForm.Field name="currentBalance">
								{(field) => {
									return (
										<Field>
											<FieldLabel htmlFor={field.name}>
												Current Balance
											</FieldLabel>
											<Input
												type="number"
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												autoComplete="off"
											/>
											<FieldDescription>
												Current balance of financial account.
											</FieldDescription>
										</Field>
									);
								}}
							</financialAccountForm.Field>
							<financialAccountForm.Subscribe
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
												financialAccountForm.reset();
											}}
										>
											Reset
										</Button>
									</div>
								)}
							</financialAccountForm.Subscribe>
						</FieldGroup>
					</FieldSet>
				</form>

				{financialAccounts.map((financialAccount) => (
					<div key={financialAccount.id}>
						{`${financialAccount.id} - ${financialAccount.name} - ${financialAccount.currentBalance} - ${financialAccount.createdAt}`}
					</div>
				))}
			</div>
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

				{budgets.map((budget) => (
					<div key={budget.id}>
						{`${budget.id} - ${budget.name} - ${budget.createdAt}`}
					</div>
				))}
			</div>
		</main>
	);
}
