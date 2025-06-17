'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface DebounceConfig {
    delay?: number;
    initialDelay?: boolean;
    staticTimeout?: boolean;
}

function useDebouncedValue<T>(
    initialValue: T,
    {
        delay = 100,
        initialDelay = false,
        staticTimeout = false,
    }: DebounceConfig = {}
): [T, (newValue: T | ((prevValue: T) => T)) => void] {
    const [value, setValue] = useState<T>(initialValue);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const latestValueRef = useRef<T>(initialValue);
    const isPendingRef = useRef<boolean>(false);

    const setDebouncedValue = useCallback(
        (newValue: T | ((prevValue: T) => T)) => {
            const resolvedNewValue =
                typeof newValue === 'function'
                    ? (newValue as (prevValue: T) => T)(latestValueRef.current)
                    : newValue;

            latestValueRef.current = resolvedNewValue;

            const deleteTimeout = () => {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            };

            if (staticTimeout) {
                const setValueWithPending = () => {
                    deleteTimeout();

                    setValue(latestValueRef.current);

                    isPendingRef.current = true;

                    timeoutRef.current = setTimeout(() => {
                        if (isPendingRef.current) {
                            isPendingRef.current = false;
                            deleteTimeout();
                        } else {
                            setValueWithPending();
                        }
                    }, delay);
                };

                if (!timeoutRef.current) {
                    if (initialDelay) {
                        timeoutRef.current = setTimeout(
                            setValueWithPending,
                            delay
                        );
                    } else {
                        setValueWithPending();
                    }
                } else {
                    isPendingRef.current = false;
                }
            } else {
                const setValueWithPending = () => {
                    deleteTimeout();

                    setValue(latestValueRef.current);

                    timeoutRef.current = setTimeout(deleteTimeout, delay);
                };

                if (!timeoutRef.current && !initialDelay) {
                    setValueWithPending();
                } else {
                    deleteTimeout();
                    timeoutRef.current = setTimeout(setValueWithPending, delay);
                }
            }
        },
        [delay, initialDelay, staticTimeout]
    );

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return [value, setDebouncedValue];
}

export default useDebouncedValue;
