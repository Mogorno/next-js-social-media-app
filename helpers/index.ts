export function isArrayNonNullable<T>(
    array: (T | null | undefined | 0 | '' | false)[]
): array is T[] {
    return !array.some((item) => !item);
}

type DebouncedFn<T extends unknown[]> = ((...args: T) => void) & {
    clear: () => void;
    delay: (newDelay: number) => void;
};

export function debounce<T extends unknown[]>(
    callback: (...args: T) => void | Promise<void>,
    delay: number
): DebouncedFn<T> {
    const settings: {
        timer: ReturnType<typeof setTimeout> | null;
        delay: number;
    } = {
        timer: null,
        delay,
    };

    const debouncedFn = function (...args: T) {
        if (settings.timer) {
            clearTimeout(settings.timer);
        }
        settings.timer = setTimeout(() => callback(...args), settings.delay);
    };

    debouncedFn.clear = () => {
        if (settings.timer) clearTimeout(settings.timer);
        settings.timer = null;
    };

    debouncedFn.delay = (newDelay: number) => {
        settings.delay = newDelay;
    };

    return debouncedFn;
}

export function getRandomInt(min: number, max: number): number {
    const range = max - min + 1;
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return min + (array[0] % range);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function sortByStringKey<T extends Record<string, any>>(
    array: T[],
    key: keyof T
): T[] {
    if (!Array.isArray(array) || !isArrayNonNullable(array)) return [];
    return [...array].sort((a, b) => a[key].localeCompare(b[key]));
}
