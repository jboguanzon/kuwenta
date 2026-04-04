import { createFileRoute, Outlet } from "@tanstack/react-router";
import SideNav from "#/components/SideNav";

export const Route = createFileRoute("/budgetPlans/$budgetPlanId")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex flex-row h-full">
			<aside className="w-3xs h-full border-r-2">
				<SideNav />
			</aside>
			<main className="w-full">
				<Outlet />
			</main>
		</div>
	)
}
