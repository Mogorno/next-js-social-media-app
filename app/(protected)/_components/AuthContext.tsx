'use client';

import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { Session } from '@auth/core/types';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { createContext, useContext } from 'react';

interface AuthProviderProps {
    children: React.ReactNode;
}

const AuthContext = createContext<Session['user'] | undefined>(undefined);

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within a AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const session = useSession();
    if (session.status === 'unauthenticated') redirect(DEFAULT_LOGIN_REDIRECT);
    if (session.status === 'loading') return <div>Loading...</div>;
    if (!session.data || !session.data.user)
        return redirect(DEFAULT_LOGIN_REDIRECT);

    return (
        <AuthContext.Provider value={session.data.user}>
            {children}
        </AuthContext.Provider>
    );
};
