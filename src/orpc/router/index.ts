import { addBudgetPlan, listBudgetPlans } from "./budgetPlans";
import { addBudget, listBudgets, updateBudget } from "./budgets";
import { addCategory, listCategories } from "./categories";
import {
	addFinancialAccount,
	listFinancialAccounts,
} from "./financialAccounts";
import { addTodo, listTodos } from "./todos";

export default {
	listTodos,
	addTodo,
	listBudgetPlans,
	addBudgetPlan,
	listBudgets,
	addBudget,
	updateBudget,
	listCategories,
	addCategory,
	listFinancialAccounts,
	addFinancialAccount,
};
