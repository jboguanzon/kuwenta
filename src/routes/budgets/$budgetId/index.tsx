import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/budgets/$budgetId/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/budgets/$budgetId/"!</div>
}
