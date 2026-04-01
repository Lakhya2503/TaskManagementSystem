import { Navigate, Route, Routes } from 'react-router-dom';
import PagesLayout from './components/Layout/PagesLayout';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import Login from './components/auth/Login';
import AcceptInvite from './components/components/AcceptInvite';
import WorkPlaceHome from './components/components/WorkPlaceHome';
import WorkspaceRoleRouter from './components/dashboard/WorkspaceRoleRouter';
import About from './pages/About';
import Contact from './pages/Contact';
import Help from './pages/Help';
import Home from './pages/Home';
import NotFoundPage from './pages/NotFoundPage';
import Register from './pages/Register';
import ForgotPasswordRequset from './components/auth/ForgotPasswordRequset'
import ResetPassword from './components/auth/ResetPassword'



const App = () => {
  return (
    <Routes>
      {/* Public Routes with Layout */}
      <Route element={<PagesLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/help" element={<Help />} />
      </Route>

      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password-request" element={<ForgotPasswordRequset />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/register" element={<Register />} />
      <Route path="/accept-invite" element={<AcceptInvite />} />

      {/* Protected Workspace Routes with Nested Structure */}
      <Route element={<ProtectedRoute />}>
        {/* Main workspace routing based on role */}
        <Route path="/workspace/:workspaceId/*" element={<WorkspaceRoleRouter />} />

        {/* Redirect root workspaces to first workspace (handled by component usually) */}
        <Route path="/workspaces" element={<WorkPlaceHome />} />
        <Route path="/dashboard" element={<Navigate to="/workspaces" replace />} />
      </Route>

      {/* 404 Page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};



export default App;
