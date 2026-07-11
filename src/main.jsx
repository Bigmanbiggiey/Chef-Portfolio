import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Lazy-loaded so the admin dashboard (and its Supabase auth/storage code)
// ships as a separate chunk, not bundled into what every public visitor downloads.
const AdminApp = lazy(() => import('./admin/AdminApp.jsx'));

const isAdmin = window.location.pathname.startsWith('/admin');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isAdmin ? (
      <Suspense fallback={<div className="min-h-screen bg-gray-100" />}>
        <AdminApp />
      </Suspense>
    ) : (
      <App />
    )}
  </React.StrictMode>
);
