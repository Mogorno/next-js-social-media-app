'use client';

import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import FlexMessage from '@/components/ui/FlexMessage';
import { ResetState } from '@/actions/auth/reset';
import { AUTH_RESET, REGISTER } from '@/routes';
import { validateField, isSchemaKey } from '@/helpers/Validation';
import ResetSchema from '@/helpers/Validation/ResetSchema';
import { IoMailOpen } from 'react-icons/io5';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import useTimer from '@/hooks/useTimer';

interface ResetFormProps {
    state: ResetState;
    action: (payload: FormData) => void;
    isPending: boolean;
}

const ResetForm: React.FC<ResetFormProps> = ({ state, action, isPending }) => {
    const [{ values, errors, messages, status }, setFormData] =
        useState<ResetState>(state);

    const [timer, setTimer] = useTimer(undefined, {
        name: 'ResetPasswordTimer',
        callback: () =>
            setFormData((prev) => ({
                ...prev,
                status: 'failed',
                messages: undefined,
            })),
    });

    useEffect(() => {
        if (state.status === 'success') {
            setTimer(60 * 1000);
        }

        setFormData(state);
    }, [state, setTimer]);

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            if (!isSchemaKey(ResetSchema, name)) return;

            setFormData((prev) => {
                const { values, status } = prev;
                let errors: ResetState['errors'] = { ...prev.errors };

                values[name] = value;

                const fieldErrors = validateField(ResetSchema, name, value);

                if (fieldErrors) errors = { ...errors, [name]: fieldErrors };
                else delete errors[name];

                if (Object.keys(errors).length === 0) errors = undefined;

                return {
                    status,
                    errors,
                    values,
                };
            });
        },
        [setFormData]
    );

    const emailStatus = useMemo(() => {
        if (values.email.length <= 2) return undefined;
        return errors?.email || messages ? 'danger' : 'success';
    }, [values.email, errors?.email, messages]);

    const isDisabled = useMemo(
        () => isPending || status === 'success' || !!timer,
        [isPending, status, timer]
    );
    return (
        <form
            className="flex flex-col gap-6 items-center justify-center w-80"
            action={action}
        >
            <div className="w-full">
                <Input
                    Icon={IoMailOpen}
                    statusVariant={emailStatus}
                    value={values.email}
                    onChange={handleChange}
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="E-mail"
                    disabled={isDisabled}
                />
                <FlexMessage
                    statusVariant="danger"
                    isVisible={!!emailStatus}
                    messages={errors?.email?.[0]}
                />
            </div>

            <Button
                Icon={AUTH_RESET.Icon}
                disabled={isDisabled || !!errors}
                name="provider"
                value="credentials"
                className="gap-2"
                statusVariant={isPending ? 'pending' : undefined}
            >
                {timer
                    ? `Resend email in ${timer} seconds`
                    : isPending
                      ? 'Sending e-mail...'
                      : 'Send reset e-mail'}
            </Button>
            <FlexMessage
                statusVariant={status === 'failed' ? 'danger' : 'success'}
                messages={messages?.[0]}
                className="flex justify-center items-center"
            />
            <Button
                Icon={REGISTER.Icon}
                styleVariant="link"
                sizeVariant="sm"
                href={REGISTER.href}
                className="flex-row-reverse gap-1 origin-bottom"
            >
                Back to login
            </Button>
        </form>
    );
};

export default memo(ResetForm);
