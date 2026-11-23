import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ToastProvider } from './components/Common/Toast'
import { Layout } from './Layout'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { DashboardPage } from './pages/DashboardPage'
import { CasesListPage } from './pages/CasesListPage'
import { CaseDetailPage } from './pages/CaseDetailPage'
import { EntitiesPage } from './pages/EntitiesPage'
import { FindingsPage } from './pages/FindingsPage'
import { ProfilePage } from './pages/ProfilePage'
import { SearchPage } from './pages/SearchPage'
import { ModulesHubPage } from './pages/ModulesHubPage'
import { BranchDetailPage } from './pages/BranchDetailPage'
import { NotFoundPage } from './pages/NotFoundPage'

function App() {
  return (
    <ToastProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* Standalone auth routes (no app shell) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* App shell routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/modules" element={<ModulesHubPage />} />
            <Route path="/modules/:branchId" element={<BranchDetailPage />} />
            <Route path="/cases" element={<CasesListPage />} />
            <Route path="/cases/:id" element={<CaseDetailPage />} />
            <Route path="/entities" element={<EntitiesPage />} />
            <Route path="/findings" element={<FindingsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  )
}

export default App
