import {
  createHashHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from '@tanstack/react-router'

import { RmaCreateContainer } from '@/pages/rma/create/rma-create.container'
import { RmaListContainer } from '@/pages/rma/list/rma-list.container'
import { RmaUpdateContainer } from '@/pages/rma/update/rma-update.container'
import { Layout } from '@/components/app/layout/layout.app'

const rootRoute = createRootRoute({
  component: function RootRoute() {
    return (
      <Layout>
        <Outlet />
      </Layout>
    )
  },
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: function IndexRoute() {
    return <Navigate to="/rma" />
  },
})

const rmaListRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/rma',
  component: RmaListContainer,
})

const rmaCreateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/rma/create',
  component: RmaCreateContainer,
})

const rmaUpdateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/rma/$rmaId',
  component: function RmaUpdateRoute() {
    const { rmaId } = rmaUpdateRoute.useParams()

    return <RmaUpdateContainer rmaId={rmaId} />
  },
})

const routeTree = rootRoute.addChildren([indexRoute, rmaListRoute, rmaCreateRoute, rmaUpdateRoute])

const hashHistory = createHashHistory()

const router = createRouter({ routeTree, history: hashHistory })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export function RouterConfig() {
  return <RouterProvider router={router} />
}
