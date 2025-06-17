import { useCallback, useRef } from 'react';

const useDebounce = <T extends (...args: unknown[]) => void>(
    fn: T,
    delay: number
) => {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const debouncedFn = useCallback(
        (...args: Parameters<T>) => {
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
                fn(...args);
            }, delay);
        },
        [fn, delay]
    );
    return debouncedFn;
};

export default useDebounce;

export const debounce = <T extends (...args: unknown[]) => void>(
    fn: T,
    delay: number
) => {
    const timer: { current: ReturnType<typeof setTimeout> | null } = {
        current: null,
    };

    return function (this: any, ...args: Parameters<T>) {
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
};
