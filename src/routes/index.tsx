import { createFileRoute, getRouteApi, Link } from "@tanstack/react-router";
import { authClient } from "#/lib/auth-client";

export const Route = createFileRoute("/")({ component: App, loader: () => {} });
const routeApi = getRouteApi("/");

function App() {
	const { data: session, isPending } = authClient.useSession();

	if (isPending) {
		return (
			<div className="h-32 w-32 bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
		);
	}

	if (session?.user) {
		return (
			<Link
				to="/budgetPlans"
				className="h-9 px-4 text-sm font-medium bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors inline-flex items-center"
			>
				Budgets
			</Link>
		);
	}

	return (
		<Link
			to="/demo/better-auth"
			className="h-9 px-4 text-sm font-medium bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors inline-flex items-center"
		>
			Sign in
		</Link>
	);
}
