'use client';

import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import FlexMessage from '@/components/ui/FlexMessage';
import { LoginState } from '@/actions/auth/login';
import { AUTH_RESET, LOGIN, REGISTER } from '@/routes';
import { validateField, isSchemaKey } from '@/helpers/Validation';
import LoginSchema from '@/helpers/Validation/LoginSchema';
import { IoMailOpen, IoLockOpen, IoShield } from 'react-icons/io5';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface LoginFormProps {
    state: LoginState;
    action: (payload: FormData) => void;
    isPending: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ state, action, isPending }) => {
    const [{ values, errors, messages, status }, setFormData] =
        useState<LoginState>(state);

    useEffect(() => {
        setFormData(state);
    }, [state]);

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            if (!isSchemaKey(LoginSchema, name)) return;
            if (status === 'twoFactorVerification' && name !== 'twoFactorCode')
                return;

            setFormData((prev) => {
                const { values, status } = prev;
                let errors: LoginState['errors'] = { ...prev.errors };

                values[name] = value;

                const fieldErrors = validateField(LoginSchema, name, value);

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
        [setFormData, status]
    );

    const twoFactorCodeStatus = useMemo(() => {
        if (values?.twoFactorCode && values.twoFactorCode.length <= 2)
            return undefined;
        return errors?.twoFactorCode || messages ? 'danger' : 'success';
    }, [values.twoFactorCode, errors?.twoFactorCode, messages]);

    const emailStatus = useMemo(() => {
        if (values.email.length <= 2) return undefined;
        return errors?.email || messages ? 'danger' : 'success';
    }, [values.email, errors?.email, messages]);

    const passwordStatus = useMemo(() => {
        if (values.password.length <= 2) return undefined;
        return errors?.password || messages ? 'danger' : 'success';
    }, [values.password, errors?.password, messages]);

    const isDisabled = useMemo(
        () => isPending || status === 'verification',
        [isPending, status]
    );

    const handleSetDefaultStatus = useCallback(() => {
        setFormData((prev) => ({
            ...prev,
            status: 'failed',
        }));
    }, [setFormData]);

    const isTwoFactor =
        status === 'twoFactorVerification' ||
        status === 'twoFactorVerificationFailed';
    return (
        <form
            action={action}
            className="flex flex-col gap-6 items-center justify-center w-80"
        >
            <div className="w-full" hidden={!isTwoFactor}>
                <Input
                    Icon={IoShield}
                    statusVariant={twoFactorCodeStatus}
                    value={values.twoFactorCode ?? ''}
                    onChange={handleChange}
                    type="text"
                    name="twoFactorCode"
                    autoComplete="one-time-code"
                    placeholder="Two Factor Code"
                    disabled={isDisabled}
                />
                <FlexMessage
                    statusVariant="danger"
                    isVisible={!!twoFactorCodeStatus}
                    messages={errors?.twoFactorCode?.[0]}
                />
            </div>
            <div className="w-full" hidden={isTwoFactor}>
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
            <div className="w-full" hidden={isTwoFactor}>
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
                hidden={isTwoFactor}
                href={AUTH_RESET.href}
                styleVariant="link"
                sizeVariant="sm"
                className={isTwoFactor ? 'hidden' : 'origin-bottom'}
            >
                Forgot password?
            </Button>
            <Button
                Icon={LOGIN.Icon}
                disabled={isDisabled || !!errors}
                name="provider"
                value="credentials"
                className="gap-2"
                statusVariant={isPending ? 'pending' : undefined}
            >
                {isPending
                    ? 'Logging in...'
                    : isTwoFactor
                      ? 'Confirm'
                      : 'Login'}
            </Button>
            <FlexMessage
                statusVariant={
                    status === 'failed' ||
                    status === 'twoFactorVerificationFailed'
                        ? 'danger'
                        : 'success'
                }
                messages={messages?.[0]}
                className="flex justify-center items-center"
            />
            <span hidden={isTwoFactor} className="text-sm text-secondaryText">
                Or sign in with
            </span>
            <Button
                provider="github"
                disabled={isPending}
                statusVariant={isPending ? 'pending' : undefined}
            />
            <Button
                provider="google"
                disabled={isPending}
                statusVariant={isPending ? 'pending' : undefined}
            />
            <Button
                onClick={handleSetDefaultStatus}
                Icon={LOGIN.Icon}
                styleVariant="link"
                sizeVariant="sm"
                className={
                    !isTwoFactor
                        ? 'hidden'
                        : 'flex-row-reverse gap-1 origin-bottom'
                }
            >
                Back to login
            </Button>
            <span className="text-sm text-secondaryText flex items-center justify-start gap-1">
                Don&apos;t have an account?
                <Button
                    Icon={REGISTER.Icon}
                    styleVariant="link"
                    sizeVariant="sm"
                    href={REGISTER.href}
                    className="flex-row-reverse gap-1 origin-bottom"
                >
                    Create one
                </Button>
            </span>
        </form>
    );
};

export default memo(LoginForm);
