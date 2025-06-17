'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';
import FlexMessage from '@/components/ui/FlexMessage';
import { HOME, LOGIN, REGISTER } from '@/routes';
import { isSchemaKey, validateField } from '@/helpers/Validation';
import RegisterSchema from '@/helpers/Validation/RegisterSchema';
import { RegisterState } from '@/actions/auth/register';
import { IoLockOpen, IoMailOpen, IoPerson } from 'react-icons/io5';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface RegisterFormProps {
    state: RegisterState;
    action: (payload: FormData) => void;
    isPending: boolean;
}

type RegisterFormComponent = React.FC<RegisterFormProps>;

const RegisterForm: RegisterFormComponent = ({ state, action, isPending }) => {
    const [{ values, errors, messages, status }, setFormData] = useState(state);

    const { update } = useSession();

    useEffect(() => {
        if (state.status === 'success') {
            update();
            redirect(HOME.href);
        }
        setFormData(state);
    }, [state, update]);

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            if (!isSchemaKey(RegisterSchema, name)) return;

            setFormData((prev) => {
                const { values, status } = prev;
                let errors: RegisterState['errors'] = { ...prev.errors };

                values[name] = value;

                const fieldErrors = validateField(RegisterSchema, name, value);

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

    const nameStatus = useMemo(() => {
        if (values.name.length <= 2) return undefined;
        return errors?.name || messages ? 'danger' : 'success';
    }, [values.name, errors?.name, messages]);

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

    return (
        <form
            className="flex flex-col gap-6 items-center justify-center w-80"
            action={action}
        >
            <div className="w-full">
                <Input
                    Icon={IoPerson}
                    statusVariant={nameStatus}
                    value={values.name}
                    onChange={handleChange}
                    type="text"
                    name="name"
                    autoComplete="name"
                    placeholder="Name"
                    disabled={isDisabled}
                />
                <FlexMessage
                    statusVariant="danger"
                    isVisible={!!nameStatus}
                    messages={errors?.name?.[0]}
                />
            </div>
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
                Icon={REGISTER.Icon}
                disabled={isDisabled || !!errors}
                name="provider"
                value="credentials"
                className="gap-2"
                statusVariant={isPending ? 'pending' : undefined}
            >
                {isPending ? 'Creating account...' : 'Create account'}
            </Button>
            <FlexMessage
                statusVariant={status === 'failed' ? 'danger' : 'success'}
                messages={messages?.[0]}
                className="flex justify-center items-center"
            />
            <span className="text-sm text-secondaryText">Or sign in with</span>
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
            <span className="text-sm text-secondaryText flex items-center justify-start gap-1">
                If you already have an account,
                <Button
                    Icon={LOGIN.Icon}
                    styleVariant="link"
                    sizeVariant="sm"
                    href={LOGIN.href}
                    className="flex-row-reverse gap-1 origin-bottom"
                >
                    log in here
                </Button>
            </span>
        </form>
    );
};

export default RegisterForm;
