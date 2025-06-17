'use client';

import { useLayoutEffect, useState } from 'react';

interface SystemTheme {
    systemTheme: 'dark' | 'light';
}

interface SystemThemeHook {
    (): SystemTheme['systemTheme'];
}

const useSystemTheme: SystemThemeHook = () => {
    const [systemTheme, setSystemTheme] =
        useState<SystemTheme['systemTheme']>('light');

    useLayoutEffect(() => {
        const updateTheme = (e: MediaQueryListEvent) => {
            setSystemTheme(e.matches ? 'dark' : 'light');
        };

        if (typeof window !== 'undefined') {
            const mediaQueryList = window.matchMedia(
                '(prefers-color-scheme: dark)'
            );
            setSystemTheme(mediaQueryList.matches ? 'dark' : 'light');
            mediaQueryList.addEventListener('change', updateTheme);

            return () => {
                mediaQueryList.removeEventListener('change', updateTheme);
            };
        }
    }, []);

    return systemTheme;
};

export default useSystemTheme;
