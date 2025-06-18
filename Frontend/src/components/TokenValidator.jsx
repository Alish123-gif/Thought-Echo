"use client";

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { checkTokenAndLogout } from '@/utils/auth';

const TokenValidator = () => {
    const { data: session, status } = useSession();
    const hasValidated = useRef(false);
    const lastValidation = useRef(0);

    useEffect(() => {
        const validateTokenOnVisit = async () => {
            // Only validate if:
            // 1. Session is loaded (not loading)
            // 2. User is authenticated
            // 3. Haven't validated recently (throttle to prevent excessive requests)
            const now = Date.now();
            const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds

            if (
                status === 'authenticated' &&
                session?.accessToken &&
                (!hasValidated.current || (now - lastValidation.current) > fiveMinutes)
            ) {
                hasValidated.current = true;
                lastValidation.current = now;

                await checkTokenAndLogout();
            }
        };

        validateTokenOnVisit();
    }, [session, status]);

    // Also validate on page visibility change (when user returns to tab)
    useEffect(() => {
        const handleVisibilityChange = async () => {
            if (document.visibilityState === 'visible' && session?.accessToken) {
                const now = Date.now();
                const fiveMinutes = 5 * 60 * 1000;

                // Only validate if it's been more than 5 minutes since last validation
                if ((now - lastValidation.current) > fiveMinutes) {
                    lastValidation.current = now;
                    await checkTokenAndLogout();
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [session]);

    // This component doesn't render anything
    return null;
};

export default TokenValidator;
