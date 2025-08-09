// resources/js/admin.jsx
import './bootstrap'
import '../css/app.css'; 
import 'flowbite';
import { createInertiaApp } from '@inertiajs/react'
import { createRoot }        from 'react-dom/client'
import AdminLayout           from './Layouts/AdminLayout'


// carica tutte le pagine admin *eagerly*
const adminPages = import.meta.glob('./Pages/Admin/**/*.jsx', { eager: true })

createInertiaApp({
  // Inertia::render('Dashboard') deve passare solo "Dashboard"
  resolve: name => {
    const key = `./Pages/Admin/${name}.jsx`
    const page = adminPages[key]
    if (!page) throw new Error(`Admin page not found: ${key}`)

    page.default.layout = page.default.layout || (page => <AdminLayout>{page}</AdminLayout>)
    return page
  },
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />)
  },
  progress: { color: '#29d' },
})
