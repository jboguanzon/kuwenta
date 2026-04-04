import { createFileRoute } from "@tanstack/react-router";

import {
	createColumnHelper,
	type ExpandedState,
	flexRender,
	getCoreRowModel,
	getExpandedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

const activeMonths = ["2026-01", "2026-02", "2026-03", "2026-04"];

type BudgetAllocation = {
	id: string;
	budgeted: number;
	spent: number;
	balance: number;
};

type BudgetEntry = {
	id: string;
	name: string;
	month: string;
	budgeted: number;
	spent: number;
	balance: number;
	subEntries?: BudgetEntry[];
};

type GroupedBudgetEntry = {
	id: string;
	name: string;
	allocations: Record<string, BudgetAllocation>;
	subEntries?: GroupedBudgetEntry[];
};

const defaultGroupedData: GroupedBudgetEntry[] = [
	{
		id: "e-1",
		name: "Needs Group",
		allocations: {
			"2026-01": { id: "1-01", budgeted: 10000, spent: 4500, balance: 5500 },
			"2026-02": { id: "1-02", budgeted: 10000, spent: 5200, balance: 4800 },
			"2026-03": { id: "1-03", budgeted: 10000, spent: 4800, balance: 5200 },
		},
		subEntries: [
			{
				id: "se-1",
				name: "Needs 1",
				allocations: {
					"2026-01": { id: "4-01", budgeted: 4000, spent: 1500, balance: 2500 },
					"2026-02": { id: "4-02", budgeted: 4000, spent: 2000, balance: 2000 },
					"2026-03": { id: "4-03", budgeted: 4000, spent: 1800, balance: 2200 },
				},
			},
			{
				id: "se-2",
				name: "Needs 2",
				allocations: {
					"2026-01": { id: "5-01", budgeted: 6000, spent: 3000, balance: 3000 },
					"2026-02": { id: "5-02", budgeted: 6000, spent: 3200, balance: 2800 },
					"2026-03": { id: "5-03", budgeted: 6000, spent: 3000, balance: 3000 },
				},
			},
			{
				id: "se-2",
				name: "Needs 3 GROUP",
				allocations: {
					"2026-01": { id: "5-01", budgeted: 6000, spent: 3000, balance: 3000 },
					"2026-02": { id: "5-02", budgeted: 6000, spent: 3200, balance: 2800 },
					"2026-03": { id: "5-03", budgeted: 6000, spent: 3000, balance: 3000 },
				},
				subEntries: [
					{
						id: "sse-1",
						name: "Needs 3 SUB-NEED",
						allocations: {
							"2026-01": {
								id: "6-01",
								budgeted: 6000,
								spent: 3000,
								balance: 3000,
							},
							"2026-02": {
								id: "6-02",
								budgeted: 6000,
								spent: 3200,
								balance: 2800,
							},
							"2026-03": {
								id: "6-03",
								budgeted: 6000,
								spent: 3000,
								balance: 3000,
							},
						},
					},
				],
			},
		],
	},
	{
		id: "e-2",
		name: "Wants Group",
		allocations: {
			"2026-01": { id: "2-01", budgeted: 2500, spent: 500, balance: 2000 },
			"2026-02": { id: "2-02", budgeted: 2500, spent: 800, balance: 1700 },
			"2026-03": { id: "2-03", budgeted: 2500, spent: 600, balance: 1900 },
		},
		subEntries: [],
	},
	{
		id: "e-2",
		name: "Investments Group",
		allocations: {
			"2026-01": { id: "3-01", budgeted: 100000, spent: 90000, balance: 10000 },
			"2026-02": { id: "3-02", budgeted: 100000, spent: 95000, balance: 5000 },
			"2026-03": { id: "3-03", budgeted: 100000, spent: 88000, balance: 12000 },
		},
		subEntries: [],
	},
];

// const columnHelper = createColumnHelper<BudgetEntry>();
const columnHelper = createColumnHelper<GroupedBudgetEntry>();
const columns = [
	columnHelper.accessor("name", {
		header: () => "Categories",
		cell: ({ row, getValue }) => (
			<div>
				{row.getCanExpand() && (
					<button type="button" onClick={row.getToggleExpandedHandler()}>
						{row.getIsExpanded() ? "▼" : "▶"}
					</button>
				)}
				{getValue()}
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
	const [data, _setData] = useState(() => [...defaultGroupedData]);
	const [expanded, setExpanded] = useState<ExpandedState>({});

	const table = useReactTable({
		data,
		columns,
		state: { expanded },
		onExpandedChange: setExpanded,
		getSubRows: (row) => row.subEntries,
		getCoreRowModel: getCoreRowModel(),
		getExpandedRowModel: getExpandedRowModel(),
	})

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
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	)
}
