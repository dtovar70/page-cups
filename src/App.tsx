import { createBrowserRouter, RouterProvider } from 'react-router'

import { routes } from '@/configs/routes.config'

const router = createBrowserRouter(routes)

export function App() {
    return <RouterProvider router={router} />
}
