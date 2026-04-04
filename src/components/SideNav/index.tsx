import { Link } from "@tanstack/react-router";
import BetterAuthHeader from "../../integrations/better-auth/header-user.tsx";
import ThemeToggle from "../ThemeToggle.tsx";
import { Button } from "../ui/button.tsx";
import FinancialAccounts from "./FinancialAccounts.tsx";

export default function SideNav() {
	return (
		<nav className="flex flex-col">
			<Link to="/budgets">Switch Budgets</Link>

			<div className="flex flex-col">
				<BetterAuthHeader />
				<ThemeToggle />
			</div>

			<div className="flex">
				<Link
					to="/"
					className="nav-link"
					activeProps={{ className: "nav-link is-active" }}
				>
					Home
				</Link>
			</div>

			<FinancialAccounts />
		</nav>
	);
}
