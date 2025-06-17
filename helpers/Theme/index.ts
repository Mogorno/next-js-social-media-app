import ColorScheme from './ColorScheme';
import Themes from './Themes';
import ThemeModes, { ModeSettings } from './ThemeModes';
import {
    IoSunny,
    IoSunnyOutline,
    IoMoon,
    IoMoonOutline,
    IoColorPalette,
    IoColorPaletteOutline,
    IoDesktop,
    IoDesktopOutline,
    IoShuffle,
    IoShuffleOutline,
} from 'react-icons/io5';

const initializeColorScheme = [
    'mainBG',
    'innerBG',
    'primaryBG',
    'secondaryBG',
    'mainText',
    'innerText',
    'primaryText',
    'secondaryText',
    'errorText',
    'warningText',
    'successText',
];

const initializeColorTheme = [
    {
        theme: 'dark',
        colorScheme: {
            mainBG: '#151515',
            innerBG: '#65592D',
            primaryBG: '#1F1E1A',
            secondaryBG: '#333025',
            mainText: '#FCFCE9',
            innerText: '#151515',
            primaryText: '#786F4E',
            secondaryText: '#BEB79E',
            errorText: '#FF5C5C',
            warningText: '#FFB86C',
            successText: '#A3FFA3',
        },
        icons: { Fill: IoMoon, Outline: IoMoonOutline },
    },
    {
        theme: 'light',
        colorScheme: {
            mainBG: '#d6cfcb',
            innerBG: '#565264',
            primaryBG: '#ccb7ae',
            secondaryBG: '#a6808c',
            mainText: '#202020',
            innerText: '#FCFCE9',
            primaryText: '#565264',
            secondaryText: '#333533',
            errorText: '#FF5C5C',
            warningText: '#FFB86C',
            successText: '#A3FFA3',
        },
        icons: { Fill: IoSunny, Outline: IoSunnyOutline },
    },
];

const initializeColorThemeModes: ModeSettings[] = [
    {
        themeMode: 'system',
        getThemeCallback: (themes, defaultTheme) => {
            try {
                const darkMode = window.matchMedia(
                    '(prefers-color-scheme: dark)'
                ).matches;
                if (darkMode) return 'dark';
                return 'light';
            } catch (error) {
                return 'light';
            }
        },
        icons: {
            Fill: IoDesktop,
            Outline: IoDesktopOutline,
        },
    },
    {
        themeMode: 'default',
        getThemeCallback: (themes, defaultTheme) => {
            return defaultTheme;
        },
        icons: {
            Fill: IoColorPalette,
            Outline: IoColorPaletteOutline,
        },
    },
    {
        themeMode: 'random',
        getThemeCallback: (themes, defaultTheme) => {
            return themes[Math.floor(Math.random() * themes.length)];
        },
        icons: {
            Fill: IoShuffle,
            Outline: IoShuffleOutline,
        },
    },
];

const colorScheme = new ColorScheme(initializeColorScheme);

const themes = new Themes(colorScheme, initializeColorTheme);

const themeModes = new ThemeModes(themes, initializeColorThemeModes);

export { colorScheme, themes, themeModes };
