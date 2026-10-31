import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/layout/Layout";
import SakuraBackground from "./components/layout/SakuraBackground";
import ErrorBoundary from "./components/common/ErrorBoundary";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Schedule from "./pages/Schedule";
import Subjects from "./pages/Subjects";
import Tasks from "./pages/Tasks";
import Exams from "./pages/Exams";
import Notes from "./pages/Notes";
import Goals from "./pages/Goals";
import Settings from "./pages/Settings";

function ProtectedLayout({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-sakura border-t-petal" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return <Layout />;
}

function Public({ children }) {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <SakuraBackground />
      <ErrorBoundary>
        <Routes>
          <Route path="/login" element={<Public><Login /></Public>} />
          <Route path="/cadastro" element={<Public><Register /></Public>} />

          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/cronograma" element={<Schedule />} />
            <Route path="/materias" element={<Subjects />} />
            <Route path="/tarefas" element={<Tasks />} />
            <Route path="/provas" element={<Exams />} />
            <Route path="/anotacoes" element={<Notes />} />
            <Route path="/metas" element={<Goals />} />
            <Route path="/configuracoes" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </ErrorBoundary>
    </AuthProvider>
  );
}
