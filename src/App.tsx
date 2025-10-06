import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useAuthStore } from './stores/useAuthStore'
import { ROUTES } from './constants/routes'

// Lazy load pages
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import GatheringDetail from './pages/GatheringDetail'
import GatheringCreate from './pages/GatheringCreate'

// Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5분
    },
  },
})

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  return <>{children}</>
}

// Public Route Component (로그인한 사용자는 접근 불가)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()

  if (isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />
  }

  return <>{children}</>
}

function App() {
  const { initialize, isAuthenticated, isInitialized } = useAuthStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  // 초기화 중 로딩 표시
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route
            path={ROUTES.LOGIN}
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path={ROUTES.SIGNUP}
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path={ROUTES.HOME}
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gatherings/:id"
            element={
              <ProtectedRoute>
                <GatheringDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gatherings/create"
            element={
              <ProtectedRoute>
                <GatheringCreate />
              </ProtectedRoute>
            }
          />

          {/* Redirect to home or login */}
          <Route
            path="/"
            element={
              <Navigate to={isAuthenticated ? ROUTES.HOME : ROUTES.LOGIN} replace />
            }
          />

          {/* 404 Page */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-gray-600">페이지를 찾을 수 없습니다.</p>
                </div>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </QueryClientProvider>
  )
}

export default App
