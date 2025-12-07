import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import TestPage from "./pages/TestPage";
import Welcome from "./pages/Welcome"
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import GoogleCallback from "./pages/GoogleCallback";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/auth/google-callback" element={<GoogleCallback />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            {/* Toutes les routes utilisant le layout */}
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
                <Route path="/" element={<Welcome />} />
                <Route path="/test" element={<TestPage />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<div className="p-6">Page non trouvée</div>} />
        </Routes>
    );
}

export default App;
