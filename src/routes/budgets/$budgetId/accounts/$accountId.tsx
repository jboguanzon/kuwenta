import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/budgets/$budgetId/accounts/$accountId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/budgets/$budgetId/accounts/$accountId"!</div>
}
