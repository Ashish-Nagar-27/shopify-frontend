import { useLocation } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from './ErrorFallback';
import type { ReactNode } from 'react';

export function RouteErrorBoundary({ children }: { children: ReactNode }) {
    const location = useLocation();

    return (
        <ErrorBoundary
            FallbackComponent={ErrorFallback}
            resetKeys={[location.pathname]}
            onError={(error, info) => console.error(error, info)}
        >
            {children}
        </ErrorBoundary>
    );
}