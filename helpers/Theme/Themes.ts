import ColorScheme, { ColorSchemeValue } from './ColorScheme';
import { IconType } from 'react-icons';

export type Theme = string;

export interface Icons {
    Fill: IconType;
    Outline: IconType;
}

export interface ThemeSettings<T extends string> {
    theme: Theme;
    icons: Icons;
    colorScheme: Record<T, ColorSchemeValue>;
}

export default class Themes<T extends string> {
    private themesSettings: ThemeSettings<T>[] = [];
    private themeByDefault: number;

    get defaultTheme(): ThemeSettings<T> {
        const theme = this.themesSettings[this.themeByDefault];
        if (!theme) throw new Error("Default theme don't exist.");
        return theme;
    }

    set defaultTheme(theme: string | number) {
        let themeIndex;
        if (typeof theme === 'string') {
            themeIndex = this.themesSettings.findIndex(
                (themeSetting) => themeSetting.theme === theme
            );
        } else if (typeof theme === 'string') {
            themeIndex = this.themesSettings.indexOf(theme);
        }

        if (typeof themeIndex === 'number' && themeIndex !== -1) {
            this.defaultTheme = themeIndex;
            return;
        }

        throw new Error(
            `Theme with name: ${JSON.stringify(theme)} is don't exist.`
        );
    }

    get themesSettingsList() {
        return this.themesSettings;
    }

    constructor(
        public ColorScheme: ColorScheme<T>,
        themes: Array<ThemeSettings<T>>
    ) {
        this.createTheme(themes);
        if (this.themesList.length === 0)
            throw new Error('Failed to create theme object. Try again.');
        this.themeByDefault = 0;
    }

    protected isValidThemeName(theme: string) {
        if (
            typeof theme === 'string' &&
            theme.length > 2 &&
            !this.themesList.includes(theme)
        )
            return true;
        return false;
    }

    createTheme(
        theme: Theme,
        colorScheme: ThemeSettings<T>['colorScheme'],
        icons: Icons
    ): void;
    createTheme(themeSettings: ThemeSettings<T>): void;
    createTheme(themeSettingsList: ThemeSettings<T>[]): void;
    createTheme(
        theme: Theme | ThemeSettings<T> | ThemeSettings<T>[],
        colorScheme?: ThemeSettings<T>['colorScheme'],
        icons?: Icons
    ) {
        if (Array.isArray(theme)) {
            return theme.forEach((theme) => this.createTheme(theme));
        }

        let themeSettings: ThemeSettings<T>;

        if (
            typeof theme === 'string' &&
            typeof colorScheme === 'object' &&
            typeof icons === 'object'
        ) {
            themeSettings = { theme, colorScheme, icons };
        } else if (typeof theme === 'object') {
            themeSettings = { ...theme };
        } else {
            return;
        }

        if (
            !this.isValidThemeName(themeSettings.theme) ||
            !this.ColorScheme.isCompatibleObject(themeSettings.colorScheme)
        ) {
            throw new Error(`Wrong theme Name or settings options.`);
        }

        this.themesSettings.push(themeSettings);
    }

    get themesList() {
        return this.themesSettings.map((themeSettings) => themeSettings.theme);
    }

    getTheme(name: string) {
        return this.themesSettings.find(
            (themeSettings) => themeSettings.theme === name
        );
    }

    protected createNestedCSS(...args: string[]) {
        if (args.length < 2) {
            throw new Error('Required min 2 args.');
        }

        let cssTemplate = '';
        let closingBrackets = '';

        args.forEach((arg, index) => {
            if (index < args.length - 1) {
                cssTemplate += `${arg} {\n`;
                closingBrackets = `}\n` + closingBrackets;
            } else {
                cssTemplate += arg + '\n';
            }
        });

        return (cssTemplate += closingBrackets);
    }

    protected parseToCSSVariables(
        colorScheme: ThemeSettings<T>['colorScheme']
    ) {
        return Object.entries(colorScheme)
            .map(([key, value]) => `--${key}: ${value ? value : ''};`)
            .join('\n');
    }

    createTailwindThemeVariables(prefersColorScheme: [string, Theme][]) {
        const root = this.createNestedCSS(
            ':root',
            this.parseToCSSVariables(this.defaultTheme.colorScheme)
        );

        const prefersColorRoot = prefersColorScheme.map(
            ([prefersColor, theme]) => {
                const themeSettings = this.getTheme(theme);

                if (!themeSettings) {
                    console.error(`Theme with name: ${theme} is don't exist.`);
                    return '';
                }

                return this.createNestedCSS(
                    `@media (prefers-color-scheme: ${prefersColor})`,
                    ':root',
                    this.parseToCSSVariables(themeSettings.colorScheme)
                );
            }
        );

        const dataThemes = this.themesSettings
            .map((themeSettings) =>
                this.createNestedCSS(
                    `[data-theme='${themeSettings.theme}']`,
                    this.parseToCSSVariables(themeSettings.colorScheme)
                )
            )
            .join('\n');

        return `${root}\n${prefersColorRoot}\n${dataThemes}`;
    }
}
