import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/budgetPlans/$budgetPlanId/accounts/$accountId",
)({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/budgetPlans/$budgetPlanId/accounts/$accountId"!</div>;
}
