'use client';

import {
    createContext,
    useContext,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from 'react';

import { themeModes } from '@/helpers/Theme';

type ThemesModes = typeof themeModes;

interface ThemeProviderProps {
    children: React.ReactNode;
}

interface ThemeContextType {
    themeModesList: ThemesModes['themeModesList'];
    icons: ThemesModes['Themes']['themesSettings'][number]['icons'];
    colorScheme: ThemesModes['Themes']['themesSettings'][number]['colorScheme'];
    themeMode: ThemesModes['modesSettings'][number]['themeMode'];
    theme: ThemesModes['Themes']['themesSettings'][number]['theme'];
    themeSettingsList: ThemesModes['Themes']['themesSettings'];
    themeModesIcons: ThemesModes['themeModesIcons'];
    defaultThemeMode: NonNullable<ReturnType<ThemesModes['getThemeMode']>>;
    findThemeMode: ThemesModes['getThemeMode'];
    findTheme: ThemesModes['Themes']['getTheme'];
    setThemeMode: (
        themeMode: ThemesModes['modesSettings'][number]['themeMode']
    ) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const themeModesList = themeModes.themeModesList;
    const themeModesIcons = themeModes.themeModesIcons;
    const defaultTheme = themeModes.Themes.defaultTheme;
    const defaultThemeMode = { ...defaultTheme, themeMode: defaultTheme.theme };
    const themeSettingsList = themeModes.Themes.themesSettingsList;
    const findThemeMode = (themeMode: string) => {
        return themeModes.getThemeMode(themeMode);
    };

    const findTheme = (theme: string) => themeModes.Themes.getTheme(theme);

    const [themeModeState, setThemeModeState] = useState(defaultTheme.theme);

    const themeModeSettings = useRef(defaultTheme);

    const setThemeMode = (themeMode: string) => {
        const newThemeMode = themeModes.getThemeMode(themeMode);
        if (newThemeMode) {
            const { themeMode, ...restProps } = newThemeMode;
            setThemeModeState(themeMode);
            themeModeSettings.current = restProps;
        }
    };

    useLayoutEffect(() => {
        const savedThemeMod = localStorage.getItem('themeMode');
        if (!!savedThemeMod) {
            setThemeMode(savedThemeMod);
        } else {
            setThemeMode('system');
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (themeModeState === 'system') {
                window.document.documentElement.removeAttribute('data-theme');
            } else {
                window.document.documentElement.setAttribute(
                    'data-theme',
                    themeModeSettings.current.theme
                );
            }
            localStorage.setItem('themeMode', themeModeState);
        }
    }, [themeModeState]);
    return (
        <ThemeContext.Provider
            value={{
                ...themeModeSettings.current,
                themeMode: themeModeState,
                themeModesList,
                themeModesIcons,
                themeSettingsList,
                defaultThemeMode,
                setThemeMode,
                findThemeMode,
                findTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};
