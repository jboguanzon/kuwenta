import { useLiveQuery } from "@tanstack/react-db";
import { useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { Input } from "#/components/ui/input";
import { financialAccountsCollection } from "#/db-collections/financialAccounts";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from "@/components/ui/field";

export const Route = createFileRoute("/budgets/$budgetId/accounts/")({
	component: RouteComponent,
});

function RouteComponent() {
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

	if (isLoadingFinancialAccounts) {
		return <div>Loading...</div>;
	}

	return (
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
	);
}
