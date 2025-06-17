'use client';

import { DEFAULT_LOGIN_REDIRECT, LOGIN } from '@/routes';
import { redirect, useSearchParams } from 'next/navigation';
import { IoKey, IoMailUnread, IoReload } from 'react-icons/io5';
import { motion, Variants } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import newVerification, {
    NewVerificationState,
} from '@/actions/auth/newVerification';
import FlexMessage, { StatusVariantKeys } from '../ui/FlexMessage';
import Button from '../ui/Button';
import useTimer from '@/hooks/useTimer';
import { useSession } from 'next-auth/react';

type MessageStatusVariants = {
    [K in NewVerificationState['status']]: StatusVariantKeys;
};

const variants: Variants = {
    open: {
        height: 'auto',
        opacity: 1,
        scale: 1,
    },
    close: {
        height: 0,
        opacity: 0,
        scale: 0.5,
    },
};

const PendingComponent = () => (
    <motion.div
        initial="close"
        animate="open"
        exit="close"
        variants={variants}
        className="flex flex-col items-center justify-center"
    >
        <h2 className="text-lg text-mainText">
            <IoMailUnread className="inline-block mr-4 animate-ping" />
            <span className="animate-pulse">Confirming your email</span>
            {[...Array(3)].map((_, index) => (
                <motion.div
                    key={index}
                    className="inline-block w-2 h-2 rounded-full bg-mainText"
                    animate={{ scale: [0, 1, 0] }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        repeatDelay: 1,
                        delay: index / 3,
                    }}
                />
            ))}
        </h2>
        <p className="p-2">
            We&apos;ve sent you an email with a link to verify your email.
        </p>
    </motion.div>
);

const RedirectComponent = () => {
    const [timer] = useTimer(5 * 1000, {
        name: 'NewVerification',
        callback: useCallback(() => redirect(DEFAULT_LOGIN_REDIRECT), []),
    });
    return (
        <div className="flex flex-col items-center justify-center gap-2 mb-6">
            <h3 className="text-secondaryText text-md">
                You will be redirected to the app in:
            </h3>
            <span className="text-4xl font-bold text-mainText">{timer}</span>
        </div>
    );
};

const messageStatusVariants: MessageStatusVariants = {
    pending: 'info',
    error: 'danger',
    success: 'success',
};

const NewVerification = () => {
    const [state, setState] = useState<NewVerificationState>({
        status: 'pending',
    });

    const { update } = useSession();

    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const isCalled = useRef(false);

    const onSubmit = useCallback(async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (!token)
            return setState({ status: 'error', message: 'Token not found' });

        try {
            const newState = await newVerification(token);
            if (newState.status === 'success') {
                update();
            }
            setState(newState);
        } catch {
            setState({ status: 'error', message: 'Something went wrong' });
        }
    }, [token, update]);

    useEffect(() => {
        if (!isCalled.current) {
            onSubmit();
            isCalled.current = true;
        }
    }, [onSubmit]);

    const messages = useMemo(
        () =>
            state.status === 'pending' ? <PendingComponent /> : state.message,
        [state.status, state.message]
    );

    return (
        <div className="flex flex-col items-center justify-center bg-mainBG">
            <h1 className="p-8 my-10 text-2xl text-mainText font-bold">
                <IoKey className="inline-block mr-2" />
                Authentication
            </h1>
            {state.status === 'success' && <RedirectComponent />}
            <FlexMessage
                messages={messages}
                statusVariant={messageStatusVariants[state.status]}
            />
            <div className="flex items-center justify-center gap-2 text-lg mt-10">
                <Button styleVariant="link" Icon={IoReload}>
                    Resend email
                </Button>
                <div className="w-0.5 h-8 bg-mainText rounded-full" />
                <Button styleVariant="link" Icon={LOGIN.Icon} href={LOGIN.href}>
                    Back to login
                </Button>
            </div>
        </div>
    );
};

export default NewVerification;
