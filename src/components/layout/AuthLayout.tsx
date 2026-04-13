import { Navigate, Outlet } from "react-router-dom";

export function AuthLayout() {
    const isAuthenticated = true

    if (!isAuthenticated) {
        return <Navigate to="/reporting" replace />;
    }

    return <Outlet />;
}
