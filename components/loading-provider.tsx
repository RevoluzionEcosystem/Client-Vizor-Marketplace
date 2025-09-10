'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import PageLoader from './modules/page-loader';

export function LoadingProvider({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(false);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const handleStartLoading = () => setIsLoading(true);
        const handleStopLoading = () => setIsLoading(false);

        // When the pathname or searchParams change, show the loader briefly
        handleStartLoading();
        const timer = setTimeout(() => {
            handleStopLoading();
        }, 500); // Adjust timing as needed

        return () => clearTimeout(timer);
    }, [pathname, searchParams]);

    return (
        <>
            {isLoading && (
                    <PageLoader />
            )}
            {children}
        </>
    );
}

export default LoadingProvider;