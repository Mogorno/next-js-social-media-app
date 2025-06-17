import { AnimatePresence } from 'motion/react';
import React, { Suspense, Fragment, useState } from 'react';

const infiniteThenable = { then() {} };

type Status = 'idle' | 'loading' | 'loaded' | 'completed';

function Suspender({
    children,
    status,
    setStatus,
}: {
    setStatus: (status: Status) => void;
    status: Status;
    children: React.ReactNode;
}) {
    if (status === 'loading') {
        queueMicrotask(() => setStatus('loaded'));
    }
    if (status === 'completed') {
        queueMicrotask(() => setStatus('idle'));
    }
    if (status === 'completed' || status === 'idle')
        return <Fragment>{children}</Fragment>;
    throw infiniteThenable;
}

interface Props {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

function Fallback({
    status,
    setStatus,
    fallback,
}: {
    status: Status;
    setStatus: (status: Status) => void;
    fallback: React.ReactNode;
}) {
    if (status === 'completed') return null;
    if (status === 'idle') {
        queueMicrotask(() => setStatus('loading'));
    }
    return (
        <AnimatePresence
            onExitComplete={() => {
                if (status === 'loaded') setStatus('completed');
            }}
        >
            {status === 'loading' && fallback}
        </AnimatePresence>
    );
}

export function MotionSuspense({ children, fallback = null }: Props) {
    const [status, setStatus] = useState<Status>('idle');
    console.log(status);
    return (
        <AnimatePresence>
            <Suspense fallback={<AnimatePresence>{fallback}</AnimatePresence>}>
                <Suspender status={status} setStatus={setStatus}>
                    {children}
                </Suspender>
            </Suspense>
        </AnimatePresence>
    );
}
