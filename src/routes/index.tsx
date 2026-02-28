import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
	useReducer,
	useSpacetimeDB,
	useSpacetimeDBQuery,
} from "spacetimedb/tanstack";
import { reducers, tables } from "../module_bindings";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	const [userEmail, setUserEmail] = useState("");
	const [userDisplayName, setUserDisplayName] = useState("");
	const [userDefaultCurrency, setUserDefaultCurrency] = useState("");

	const [budgetName, setBudgetName] = useState("");
	const [budgetUserId, setBudgetUserId] = useState("");
	const [budgetCurrency, setBudgetCurrency] = useState("");

	const conn = useSpacetimeDB();
	const { isActive: connected } = conn;

	// Subscribe to all people in the database
	const [users] = useSpacetimeDBQuery(tables.users);
	const [budgets] = useSpacetimeDBQuery(tables.budgets);

	const addUserReducer = useReducer(reducers.addUser);
	const addBudgetReducer = useReducer(reducers.addBudget);

	const addUser = (e: React.SubmitEvent) => {
		e.preventDefault();
		if (
			!userEmail.trim() ||
			!userDisplayName.trim() ||
			!userDefaultCurrency.trim() ||
			!connected
		)
			return;

		addUserReducer({
			email: userEmail,
			displayName: userDisplayName,
			defaultCurrency: userDefaultCurrency,
		});
		setUserEmail("");
		setUserDisplayName("");
		setUserDefaultCurrency("");
	};

	const addBudget = (e: React.SubmitEvent) => {
		e.preventDefault();
		if (
			!budgetName.trim() ||
			!budgetUserId.trim() ||
			!budgetCurrency.trim() ||
			!connected
		)
			return;

		try {
			const userId = BigInt(budgetUserId);

			addBudgetReducer({
				name: budgetName,
				userId: userId,
				currency: budgetCurrency,
			});
		} catch {
			console.error("Error converting to BigInt");
		}

		setBudgetName("");
		setBudgetUserId("");
		setBudgetCurrency("");
	};

	return (
		<div style={{ padding: "2rem" }}>
			<h1>Kuwenta App</h1>

			<div style={{ marginBottom: "1rem" }}>
				Status:{" "}
				<strong style={{ color: connected ? "green" : "red" }}>
					{connected ? "Connected" : "Disconnected"}
				</strong>
			</div>

			<div>
				<form onSubmit={addUser} style={{ marginBottom: "2rem" }}>
					<input
						type="email"
						placeholder="Enter email"
						value={userEmail}
						onChange={(e) => setUserEmail(e.target.value)}
						style={{ padding: "0.5rem", marginRight: "0.5rem" }}
						disabled={!connected}
					/>
					<input
						type="text"
						placeholder="Enter display name"
						value={userDisplayName}
						onChange={(e) => setUserDisplayName(e.target.value)}
						style={{ padding: "0.5rem", marginRight: "0.5rem" }}
						disabled={!connected}
					/>
					<input
						type="text"
						placeholder="Enter default currency (e.g. PHP, USD, JPY)"
						value={userDefaultCurrency}
						onChange={(e) => setUserDefaultCurrency(e.target.value)}
						style={{ padding: "0.5rem", marginRight: "0.5rem" }}
						disabled={!connected}
					/>
					<button
						type="submit"
						style={{ padding: "0.5rem 1rem" }}
						disabled={!connected}
					>
						Add User
					</button>
				</form>

				<div>
					<h2>Users ({users.length})</h2>
					{users.length === 0 ? (
						<p>No users yet. Add someone above!</p>
					) : (
						<ul>
							{users.map((user, index) => (
								<li key={`${index}-${user.name}`}>
									{user.id} - {user.email} - {user.displayName} -{" "}
									{user.defaultCurrency}
								</li>
							))}
						</ul>
					)}
				</div>
			</div>

			<div>
				<form onSubmit={addBudget} style={{ marginBottom: "2rem" }}>
					<input
						type="text"
						placeholder="Enter budget name"
						value={budgetName}
						onChange={(e) => setBudgetName(e.target.value)}
						style={{ padding: "0.5rem", marginRight: "0.5rem" }}
						disabled={!connected}
					/>
					<input
						type="text"
						placeholder="Enter budget user id"
						value={budgetUserId}
						onChange={(e) => setBudgetUserId(e.target.value)}
						style={{ padding: "0.5rem", marginRight: "0.5rem" }}
						disabled={!connected}
					/>
					<input
						type="text"
						placeholder="Enter budget currency (e.g. PHP, USD, JPY)"
						value={budgetCurrency}
						onChange={(e) => setBudgetCurrency(e.target.value)}
						style={{ padding: "0.5rem", marginRight: "0.5rem" }}
						disabled={!connected}
					/>
					<button
						type="submit"
						style={{ padding: "0.5rem 1rem" }}
						disabled={!connected}
					>
						Add Budget
					</button>
				</form>

				<div>
					<h2>Budgets ({budgets.length})</h2>
					{budgets.length === 0 ? (
						<p>No budgets yet. Add some above!</p>
					) : (
						<ul>
							{budgets.map((budget, index) => (
								<li key={`${index}-${budget.name}`}>
									{budget.id} - {budget.name} - {budget.userId} -{" "}
									{budget.currency}
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</div>
	);
}
