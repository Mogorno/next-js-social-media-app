'use client';

import { createContext, useContext, useState } from 'react';

interface MobileMenuProviderProps {
    children: React.ReactNode;
}

interface ToggleFunction {
    (): void;
}

interface ContextValues {
    isOpen: boolean;
    toggle: ToggleFunction;
}

const MobileMenuContext = createContext<ContextValues | undefined>(undefined);

export const useMobileMenuContext = () => {
    const context = useContext(MobileMenuContext);
    if (!context) {
        throw new Error(
            'useMobileMenuContext must be used within a MobileMenuProvider'
        );
    }
    return context;
};

export const MobileMenuProvider = ({ children }: MobileMenuProviderProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const toggle: ToggleFunction = () => {
        setIsOpen((prev) => !prev);
    };

    const values: ContextValues = {
        isOpen,
        toggle,
    };

    return (
        <MobileMenuContext.Provider value={values}>
            {children}
        </MobileMenuContext.Provider>
    );
};
