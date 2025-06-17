import Themes, { Icons, Theme } from './Themes';

export type ThemeMode = Theme;

export interface ModeSettings {
    themeMode: ThemeMode;
    icons?: Partial<Icons>;
    getThemeCallback: (themes: Theme[], defaultTheme: Theme) => Theme;
}

export default class ThemeModes {
    private modesSettings: ModeSettings[] = [];

    constructor(public Themes: Themes<string>, modes?: ModeSettings[]) {
        modes && this.createMode(modes);
    }

    protected isValidModeName(name: string) {
        if (
            typeof name !== 'string' ||
            name.length < 3 ||
            this.themeModesList.includes(name)
        )
            return false;
        return true;
    }

    createMode(
        themeMode: ModeSettings['themeMode'],
        getTheme: ModeSettings['getThemeCallback'],
        icons?: ModeSettings['icons']
    ): void;
    createMode(modeSettings: ModeSettings): void;
    createMode(modesSettings: ModeSettings[]): void;
    createMode(
        themeMode: ModeSettings['themeMode'] | ModeSettings | ModeSettings[],
        getThemeCallback?: ModeSettings['getThemeCallback'],
        icons?: ModeSettings['icons']
    ) {
        if (Array.isArray(themeMode)) {
            return themeMode.forEach((item) => this.createMode(item));
        }
        let modeSettings: ModeSettings;

        if (
            typeof themeMode === 'string' &&
            typeof getThemeCallback === 'function'
        ) {
            modeSettings = { themeMode, getThemeCallback, icons };
        } else if (typeof themeMode === 'object') {
            modeSettings = { ...themeMode };
        } else {
            return;
        }
        if (
            !this.isValidModeName(modeSettings.themeMode) ||
            typeof modeSettings.getThemeCallback !== 'function'
        ) {
            throw new Error("Can't create theme mode.");
        }
        this.modesSettings.push(modeSettings);
    }

    get themeModesList() {
        return [
            ...this.Themes.themesList,
            ...this.modesSettings.map((modeSettings) => modeSettings.themeMode),
        ];
    }

    get themeModesIcons(): { [key: ThemeMode]: Partial<Icons> } {
        const themeModesIcons: { [key: ThemeMode]: Partial<Icons> } = {};
        this.Themes.themesSettingsList.forEach(
            (theme) => (themeModesIcons[theme.theme] = theme.icons)
        );
        this.modesSettings.forEach((mode) => {
            themeModesIcons[mode.themeMode] = {
                Fill: mode.icons?.Fill,
                Outline: mode.icons?.Outline,
            };
        });
        return themeModesIcons;
    }

    protected mergedModeIcons(
        mainIcon: Partial<Icons> | undefined,
        secondaryIcon: Icons
    ) {
        return {
            Fill: mainIcon?.Fill ? mainIcon.Fill : secondaryIcon.Fill,
            Outline: mainIcon?.Outline
                ? mainIcon.Outline
                : secondaryIcon.Outline,
        };
    }

    protected getModeSettings(mode: string) {
        const modeSettings = this.modesSettings.find(
            (modeSetting) => modeSetting.themeMode === mode
        );
        if (modeSettings) {
            const {
                getThemeCallback,
                icons: modeIcons,
                ...restModeSettings
            } = modeSettings;

            const theme = getThemeCallback(
                this.Themes.themesList,
                this.Themes.defaultTheme.theme
            );

            const themeSettings =
                this.Themes.getTheme(theme) ?? this.Themes.defaultTheme;

            if (!themeSettings) return undefined;

            const { icons: themeIcons, ...restThemeSettings } = themeSettings;

            return {
                ...restThemeSettings,
                icons: this.mergedModeIcons(modeIcons, themeIcons),
                ...restModeSettings,
            };
        }
    }

    getThemeMode(themeMode: string) {
        let theme = this.Themes.getTheme(themeMode);
        if (theme) return { ...theme, themeMode };
        return this.getModeSettings(themeMode);
    }
}
