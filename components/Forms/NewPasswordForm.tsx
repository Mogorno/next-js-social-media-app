'use client';

import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import FlexMessage from '@/components/ui/FlexMessage';
import { NewPasswordState } from '@/actions/auth/newPassword';
import { AUTH_NEW_PASSWORD, LOGIN } from '@/routes';
import { validateField, isSchemaKey } from '@/helpers/Validation';
import NewPasswordSchema from '@/helpers/Validation/NewPasswordSchema';
import { IoLockOpen } from 'react-icons/io5';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface NewPasswordFormProps {
    token: string;
    state: NewPasswordState;
    action: (payload: FormData) => void;
    isPending: boolean;
}

const NewPasswordForm: React.FC<NewPasswordFormProps> = ({
    token,
    state,
    action,
    isPending,
}) => {
    const [{ values, errors, messages, status }, setFormData] =
        useState<NewPasswordState>(state);

    useEffect(() => {
        setFormData(state);
    }, [state]);

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            if (!isSchemaKey(NewPasswordSchema, name)) return;

            setFormData((prev) => {
                const { values, status } = prev;
                let errors: NewPasswordState['errors'] = { ...prev.errors };

                values[name] = value;

                const fieldErrors = validateField(
                    NewPasswordSchema,
                    name,
                    value
                );

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

    const passwordStatus = useMemo(() => {
        if (values.password.length <= 2) return undefined;
        return errors?.password || messages ? 'danger' : 'success';
    }, [values.password, errors?.password, messages]);

    const isDisabled = useMemo(
        () => isPending || status === 'success',
        [isPending, status]
    );

    return (
        <form
            className="flex flex-col gap-6 items-center justify-center w-80"
            action={action}
        >
            <input type="hidden" name="token" value={token} />
            <div className="w-full">
                <Input
                    Icon={IoLockOpen}
                    statusVariant={passwordStatus}
                    value={values?.password}
                    onChange={handleChange}
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    placeholder="Password"
                    disabled={isDisabled}
                />
                <FlexMessage
                    statusVariant="danger"
                    isVisible={!!passwordStatus}
                    messages={errors?.password?.[0]}
                />
            </div>
            <Button
                Icon={AUTH_NEW_PASSWORD.Icon}
                disabled={isDisabled || !!errors}
                name="provider"
                value="credentials"
                className="gap-2"
                statusVariant={isPending ? 'pending' : undefined}
            >
                {isPending ? 'Saving new password...' : 'Reset password'}
            </Button>
            <FlexMessage
                statusVariant={status === 'failed' ? 'danger' : 'success'}
                messages={messages?.[0]}
                className="flex justify-center items-center"
            />
            <Button
                Icon={LOGIN.Icon}
                styleVariant="link"
                sizeVariant="sm"
                href={LOGIN.href}
                className="flex-row-reverse gap-1 origin-bottom"
            >
                Back to login
            </Button>
        </form>
    );
};

export default memo(NewPasswordForm);
