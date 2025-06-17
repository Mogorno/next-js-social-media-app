export type ColorSchemeValue = React.CSSProperties['color'];

export default class ColorScheme<ColorSchemeKey extends string> {
    constructor(colorSchemeKeys: ColorSchemeKey[]) {
        this.colorSchemeKeys = this.validateColorSchemeKeys(colorSchemeKeys);
    }

    public colorSchemeKeys: ColorSchemeKey[];

    protected validateColorSchemeKeys(
        array: ColorSchemeKey[]
    ): ColorSchemeKey[] {
        if (Array.isArray(array)) {
            array.forEach((item, index) => {
                for (let i = index + 1; i < array.length; i++) {
                    if (item.toLowerCase() === array[i].toLowerCase()) {
                        throw new Error(
                            `Array: ${JSON.stringify(array)} don't unique.`
                        );
                    }
                }
            });
            return array;
        }
        throw new Error(`Enter array of strings.`);
    }

    isCompatibleObject(
        object: any
    ): object is { [key in ColorSchemeKey]: ColorSchemeValue } {
        if (typeof object === 'object' && object !== null) {
            const objectKeys = Object.keys(object);

            if (objectKeys.length !== this.colorSchemeKeys.length) {
                return false;
            }
            for (let key of objectKeys) {
                if (
                    !this.colorSchemeKeys.includes(key as ColorSchemeKey) ||
                    typeof object[key] !== 'string'
                ) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    get tailwindColorScheme() {
        return this.colorSchemeKeys.reduce((acc, key) => {
            acc[key] = `var(--${key})`;
            return acc;
        }, {} as Record<ColorSchemeKey, `var(--${ColorSchemeKey})`>);
    }
}
