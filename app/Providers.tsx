import { auth } from '@/auth';
import { MobileMenuProvider } from '@/context/MobileMenuContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { SessionProvider } from 'next-auth/react';

interface ProviderProps {
    children: React.ReactNode;
}

const Provides = async ({ children }: ProviderProps) => {
    const session = await auth();

    return (
        <SessionProvider session={session}>
            <ThemeProvider>
                <MobileMenuProvider>{children}</MobileMenuProvider>
            </ThemeProvider>
        </SessionProvider>
    );
};

export default Provides;
