import { useEffect, RefObject, useRef, useCallback } from 'react';

type CloseModalOptions = {
    closeDelay?: {
        mouseLeave?: number;
        outsideClick?: number;
        exitKey?: number;
    };
    targetKeys?: string[];
    triggers?: {
        mouseLeave?: boolean;
        outsideClick?: boolean;
        exitKey?: boolean;
    };
};

interface UseModalCloseParams {
    isOpen: boolean;
    callback?: () => void;
    options?: CloseModalOptions;
}

const DEFAULT_VALUES: CloseModalOptions = {
    closeDelay: {
        mouseLeave: 500,
    },
    targetKeys: ['Escape'],
    triggers: {
        mouseLeave: true,
        outsideClick: true,
        exitKey: true,
    },
};

const useModalClose = <T extends HTMLElement = HTMLElement>({
    isOpen,
    callback,
    options,
}: UseModalCloseParams): RefObject<T | null> => {
    const modalRef = useRef<T | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const { closeDelay, targetKeys, triggers } = {
        ...DEFAULT_VALUES,
        ...options,
    };

    const removeTimer = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = null;
    }, [timerRef]);

    const cb = useCallback(
        (delay?: number) => {
            if (!callback) return;
            if (delay) {
                if (timerRef.current) return;

                timerRef.current = setTimeout(() => {
                    callback();
                    timerRef.current = null;
                }, delay);
            } else callback();
        },
        [callback]
    );

    const onMouseLeave = useCallback(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (event: MouseEvent) => {
            cb(closeDelay?.mouseLeave);
        },
        [cb, closeDelay]
    );

    const onMouseEnter = useCallback(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (event: MouseEvent) => {
            removeTimer();
        },
        [removeTimer]
    );

    const onClickOutside = useCallback(
        (event: MouseEvent) => {
            if (
                !modalRef.current ||
                modalRef.current.contains(event.target as Node)
            ) {
                removeTimer();
                return;
            }
            cb(closeDelay?.outsideClick);
        },
        [modalRef, cb, removeTimer, closeDelay]
    );

    const onKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (targetKeys?.includes(event.key)) {
                cb(closeDelay?.exitKey);
            }
        },
        [targetKeys, closeDelay, cb]
    );

    useEffect(() => {
        if (!isOpen || !modalRef.current || !callback) return;

        const element = modalRef.current;

        if (triggers?.mouseLeave) {
            element.addEventListener('mouseleave', onMouseLeave);
            element.addEventListener('mouseenter', onMouseEnter);
        }
        if (triggers?.outsideClick) {
            document.addEventListener('mousedown', onClickOutside);
        }
        if (triggers?.exitKey) {
            window.addEventListener('keydown', onKeyDown);
        }

        return () => {
            if (triggers?.mouseLeave) {
                element.removeEventListener('mouseleave', onMouseLeave);
                element.removeEventListener('mouseenter', onMouseEnter);
            }
            if (triggers?.outsideClick) {
                document.removeEventListener('mousedown', onClickOutside);
            }
            if (triggers?.exitKey) {
                window.removeEventListener('keydown', onKeyDown);
            }

            removeTimer();
        };
    }, [
        triggers,
        isOpen,
        modalRef,
        callback,
        onMouseLeave,
        onMouseEnter,
        onClickOutside,
        onKeyDown,
        removeTimer,
    ]);
    return modalRef;
};

export default useModalClose;
