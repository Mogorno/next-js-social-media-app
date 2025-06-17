'use client';

import { useState, useEffect, useCallback } from 'react';

const getLocalStorageTimer = (name: string) => {
    const timer = window.localStorage.getItem(name);
    if (!timer) return null;
    const parserTimer = JSON.parse(timer) as number;
    const timeLeft = new Date(parserTimer).getTime() - new Date().getTime();
    return timeLeft > 0 ? timeLeft : null;
};

const setLocalStorageTimer = (name: string, time: number) =>
    window.localStorage.setItem(
        name,
        JSON.stringify(new Date().getTime() + time)
    );

const deleteLocalStorageTimer = (name: string) =>
    window.localStorage.removeItem(name);

const format = {
    s: 1000,
    ms: 10,
};

function useTimer(
    timeout?: number,
    config?: { name?: string; timeFormat?: 's' | 'ms'; callback?: () => void }
): [number, (timeout: number) => void] {
    const { timeFormat = 's', name, callback } = config ?? {};

    const timerName = name ?? 'timer-0';

    const [timeLeft, setTimeLeft] = useState(
        timeout ?? getLocalStorageTimer(timerName) ?? 0
    );

    useEffect(() => {
        if (timeLeft <= 0) return undefined;

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                const currentTime = prev - format[timeFormat];
                if (currentTime <= 0) {
                    if (typeof timeout === 'undefined')
                        deleteLocalStorageTimer(timerName);
                    if (callback) callback();
                    return 0;
                }
                return currentTime;
            });
        }, format[timeFormat]);

        return () => clearInterval(interval);
    }, [timeLeft, callback, timeFormat, timerName, timeout]);

    const handleSetTimer = useCallback(
        (time: number) => {
            setTimeLeft(time);
            if (typeof timeout === 'undefined')
                setLocalStorageTimer(timerName, time);
        },
        [timerName, timeout]
    );

    const time = Math.floor(timeLeft / format[timeFormat]);
    return [time, handleSetTimer];
}

export default useTimer;
