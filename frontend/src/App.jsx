import '@/style/index.css'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import Home from "@/layouts/home"
import ProjectDetail from "@/pages/projectDetail"
import { AnimatePresence } from 'framer-motion'
import { LanguageProvider } from '@/context/languageContext'
import PageTransition from '@/components/pageTransition'
import Login from '@/pages/admin/login'
import Dashboard from '@/pages/admin/dashboard'
import ProjectEdit from '@/components/projectEdit'
import ProjectNew from '@/components/projectNew'
import NotFound from '@/components/notFound'
import { AuthProvider } from '@/context/authContext'
import ProtectedRoute from '@/components/admin/protectedRoute'

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Home />
            </PageTransition>
          }
        />
        <Route
          path="/project/:id"
          element={
            <PageTransition>
              <ProjectDetail />
            </PageTransition>
          }
        />
        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/projects/new"
          element={
            <ProtectedRoute>
              <ProjectNew />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/projects/:id/edit"
          element={
            <ProtectedRoute>
              <ProjectEdit />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </AuthProvider >
    </LanguageProvider>
  );
}

export default App;