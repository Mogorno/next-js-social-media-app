import NavPanel from '@/components/NavPanel';
import { AuthProvider } from './_components/AuthContext';

interface ProtectedLayoutProps extends React.ComponentProps<'div'> {
    children: React.ReactNode;
}

const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ children }) => {
    return (
        <AuthProvider>
            <div className="h-full w-full flex items-center justify-center">
                <NavPanel className="w-1/5 h-full" />
                <main className="flex-1 w-full h-full"> {children}</main>
            </div>
        </AuthProvider>
    );
};

export default ProtectedLayout;
