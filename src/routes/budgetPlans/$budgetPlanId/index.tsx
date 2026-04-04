import { eq, useLiveQuery } from "@tanstack/react-db";
import { createFileRoute } from "@tanstack/react-router";
import {
	createColumnHelper,
	type ExpandedState,
	flexRender,
	getCoreRowModel,
	getExpandedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import AddCategoryDropdown from "#/components/AddCategoryDropdown";
import { budgetsCollection } from "#/db-collections/budgets";
import { categoriesCollection } from "#/db-collections/categories";
import { toAmountDatabaseUnit, toAmountDisplayUnit } from "#/lib/utils";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

const activeMonths = ["2026-01", "2026-02", "2026-03"];

type BudgetRow = {
	categoryId: string;
	categoryName: string;
	parentId: string | null;
	budgetId: string | null;
	month: string | null;
	amount: number | null;
};

type BudgetAllocation = {
	budgetId: string | null;
	budgeted: number;
	spent: number;
	balance: number;
};

type GroupedBudgetEntry = {
	categoryId: string;
	name: string;
	allocations: Record<string, BudgetAllocation>;
	subEntries?: GroupedBudgetEntry[];
};

// const columnHelper = createColumnHelper<BudgetEntry>();
const columnHelper = createColumnHelper<GroupedBudgetEntry>();
const columns = [
	columnHelper.accessor((row) => row.name, {
		id: "categories",
		header: () => (
			<div className="flex items-center">
				<span>Categories</span>
				<AddCategoryDropdown />
			</div>
		),
		cell: ({ row, getValue }) => (
			<div className="flex grow">
				<div className="flex gap-2">
					{row.getCanExpand() && (
						<button type="button" onClick={row.getToggleExpandedHandler()}>
							{row.getIsExpanded() ? "▼" : "▶"}
						</button>
					)}
					<span className="flex items-center">{getValue()}</span>
				</div>
				<AddCategoryDropdown parentCategoryId={row.original.categoryId} />
			</div>
		),
	}),
	...activeMonths.flatMap((month) =>
		columnHelper.group({
			id: month,
			header: month,
			columns: [
				columnHelper.accessor((row) => row.allocations[month]?.budgeted, {
					id: `${month}_budgeted`,
					header: "Budgeted",
					cell: ({ row, getValue }) => {
						const dataValue: number | null = getValue();
						const [displayValue, setDisplayValue] = useState(
							(toAmountDisplayUnit(dataValue) || 0).toFixed(2).toString(),
						);
						const [isEditing, setIsEditing] = useState(false);

						const onBlur = () => {
							setIsEditing(false);
							setDisplayValue((value) => Number(value).toFixed(2).toString());

							// TODO: do not create budget entry if value did not change
							const categoryId = row.original.categoryId;
							const budgetId = row.original.allocations[month]?.budgetId;
							if (budgetId) {
								budgetsCollection.update(budgetId, (draft) => {
									draft.categoryId = categoryId;
									draft.amount =
										toAmountDatabaseUnit(Number(displayValue)) || 0;
									// TODO: fix expected Date, got string error when not setting createdAt to null
									draft.createdAt = null;
								});
							} else {
								budgetsCollection.insert({
									id: crypto.randomUUID(),
									month: month,
									categoryId: categoryId,
									amount: toAmountDatabaseUnit(Number(displayValue)) || 0,
									createdAt: null,
								});
							}
						};

						const onClick = () => {
							// TODO: handle non-editable category groups more elegantly
							if (row.original.subEntries?.length) return;
							setIsEditing(true);
						};

						// TODO: calculate totals for category groups

						if (isEditing) {
							return (
								<input
									type="text"
									value={displayValue}
									onChange={(e) => setDisplayValue(e.target.value)}
									onBlur={onBlur}
								/>
							);
						}

						return (
							<button type="button" onClick={onClick}>
								{displayValue}
							</button>
						);
					},
				}),
				columnHelper.accessor((row) => row.allocations[month]?.spent, {
					id: `${month}_spent`,
					header: "Spent",
				}),
				columnHelper.accessor((row) => row.allocations[month]?.balance, {
					id: `${month}_balance`,
					header: "Balance",
				}),
			],
		}),
	),
];

export const Route = createFileRoute("/budgetPlans/$budgetPlanId/")({
	component: RouteComponent,
});

function RouteComponent() {
	// const [data, _setData] = useState(() => [...defaultData]);
	// const [data, _setData] = useState(() => [...defaultGroupedData]);
	const [expanded, setExpanded] = useState<ExpandedState>({});

	const { data, isLoading } = useLiveQuery((q) =>
		q
			.from({ category: categoriesCollection })
			.join(
				{ budget: budgetsCollection },
				({ category, budget }) => eq(category.id, budget.categoryId),
				"left",
			)
			// .where(
			// 	({ budget }) =>
			// 		budget.month == null || inArray(budget.month, activeMonths),
			// )
			.select(({ category, budget }) => ({
				categoryId: category.id,
				categoryName: category.name,
				parentId: category.parentId,
				budgetId: budget.id ?? null,
				month: budget.month ?? null,
				amount: budget.amount ?? null,
			}))
			.orderBy(({ category }) => category.createdAt, "asc"),
	);

	const tableData = useMemo<GroupedBudgetEntry[]>(() => {
		const rows = data as BudgetRow[] | undefined;
		if (!rows) return [];

		const categoryMeta = new Map<
			string,
			{ name: string; parentId: string | null }
		>();
		const allocationsByCategory = new Map<
			string,
			Record<string, BudgetAllocation>
		>();
		const childrenByCategory = new Map<string, string[]>();

		rows.forEach((row) => {
			if (!categoryMeta.has(row.categoryId)) {
				categoryMeta.set(row.categoryId, {
					name: row.categoryName,
					parentId: row.parentId,
				});
			}

			if (!allocationsByCategory.has(row.categoryId)) {
				allocationsByCategory.set(row.categoryId, {});
			}

			if (row.parentId) {
				const existing = childrenByCategory.get(row.parentId) ?? [];
				if (!existing.includes(row.categoryId)) {
					existing.push(row.categoryId);
					childrenByCategory.set(row.parentId, existing);
				}
			}

			if (row.budgetId && row.month && row.amount != null) {
				const allocations = allocationsByCategory.get(row.categoryId);
				if (allocations) {
					allocations[row.month] = {
						budgetId: row.budgetId,
						budgeted: row.amount,
						spent: 0,
						balance: 0,
					};
				}
			}
		});

		const buildEntry = (categoryId: string): GroupedBudgetEntry | null => {
			const meta = categoryMeta.get(categoryId);
			if (!meta) return null;

			const subEntries = (childrenByCategory.get(categoryId) ?? [])
				.map(buildEntry)
				.filter((entry): entry is GroupedBudgetEntry => entry !== null);

			return {
				categoryId,
				name: meta.name,
				allocations: allocationsByCategory.get(categoryId) ?? {},
				subEntries: subEntries.length ? subEntries : undefined,
			};
		};

		return Array.from(categoryMeta.entries())
			.filter(([, meta]) => meta.parentId === null)
			.map(([id]) => buildEntry(id))
			.filter((entry): entry is GroupedBudgetEntry => entry !== null);
	}, [data]);

	const table = useReactTable({
		data: tableData,
		columns: columns,
		state: { expanded },
		onExpandedChange: setExpanded,
		getSubRows: (row) => row.subEntries,
		getCoreRowModel: getCoreRowModel(),
		getExpandedRowModel: getExpandedRowModel(),
	});

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<div>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id} colSpan={header.colSpan}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.map((row) => (
							<TableRow key={row.id}>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>
										<div className="flex gap-1">
											{cell.column.id === "categories" && row.depth > 0
												? ">".repeat(row.depth)
												: null}
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</div>
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
