'use client';

import LoginForm from '@/components/Forms/LoginForm';
import { useActionState, useCallback, useMemo } from 'react';
import { redirect, useSearchParams } from 'next/navigation';
import login, { LoginState, LoginFn } from '@/actions/auth/login';
import LoginSchema from '@/helpers/Validation/LoginSchema';
import { validation } from '@/helpers/Validation';
import { useSession } from 'next-auth/react';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';

const Login = () => {
    const searchParams = useSearchParams();
    const { update } = useSession();
    const initialState = useMemo<LoginState>(() => {
        const values = { email: '', password: '' };
        const validationErrors = validation(LoginSchema, values);
        const messages =
            searchParams.get('error') === 'OAuthAccountNotLinked'
                ? ['Email already use in different provider']
                : undefined;

        return {
            values,
            status: 'failed',
            errors: { ...validationErrors },
            messages,
        };
    }, [searchParams]);

    const actionWithUpdatingSession: LoginFn = useCallback(
        (...args) =>
            login(...args).then((res) => {
                if (res.status === 'success') {
                    update();
                    redirect(DEFAULT_LOGIN_REDIRECT);
                }
                return res;
            }),
        [update]
    );

    const [state, action, isPending] = useActionState(
        actionWithUpdatingSession,
        initialState
    );

    return <LoginForm state={state} action={action} isPending={isPending} />;
};

export default Login;
