import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { AccessDenied } from "./AccessDenied";

export type UserRole = "root" | "admin" | "readonly";

export interface RoleGuardProps {
    children?: ReactNode;
    /**
     * If true, only root users (where user.role does not exist) can view this component.
     */
    rootOnly?: boolean;

    /**
     * Roles allowed to view the children.
     * "root" represents when user.role is undefined (account owner).
     */
    allowedRoles?: UserRole[];

    /**
     * Roles disallowed from viewing the children.
     * e.g. disallowedRoles={['readonly']}
     */
    disallowedRoles?: UserRole[];

    /**
     * Custom fallback component when access is denied.
     * Defaults to <AccessDenied />
     */
    fallback?: ReactNode;

    /**
     * Optional custom title or description for the default AccessDenied fallback
     */
    title?: ReactNode;
    description?: ReactNode;
    className?: string;
}

/**
 * Hook to inspect current user role status conveniently.
 */
export function useUserRole() {
    const { user } = useAuthStore();
    const isRoot = !user?.role;
    const isAdmin = user?.role === "admin";
    const isReadOnly = user?.role === "readonly";
    const role: UserRole = user?.role || "root";

    return { user, role, isRoot, isAdmin, isReadOnly };
}

/**
 * Wrapper component to guard access based on user role.
 */
export function RoleGuard({
    children,
    rootOnly,
    allowedRoles,
    disallowedRoles,
    fallback,
    title,
    description,
    className,
}: RoleGuardProps) {
    const { role } = useUserRole();

    let hasAccess = true;

    if (rootOnly) {
        hasAccess = role === "root";
    } else if (allowedRoles && allowedRoles.length > 0) {
        hasAccess = allowedRoles.includes(role);
    } else if (disallowedRoles && disallowedRoles.length > 0) {
        hasAccess = !disallowedRoles.includes(role);
    }

    if (!hasAccess) {
        if (fallback !== undefined) {
            return <>{fallback}</>;
        }
        return (
            <AccessDenied
                title={title}
                description={description}
                className={className}
            />
        );
    }

    return children !== undefined ? <>{children}</> : <Outlet />;
}

export default RoleGuard;
