'use client';

import RegisterForm from '../Forms/RegisterForm';
import { useActionState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import register, { RegisterState } from '@/actions/auth/register';
import { validation } from '@/helpers/Validation';
import RegisterSchema from '@/helpers/Validation/RegisterSchema';

const Register = () => {
    const searchParams = useSearchParams();

    const initialState = useMemo<RegisterState>(() => {
        const values = { email: '', password: '', name: '' };
        const errors = validation(RegisterSchema, values);
        const messages =
            searchParams.get('error') === 'OAuthAccountNotLinked'
                ? ['Email already use in different provider']
                : undefined;
        return {
            values,
            status: 'failed',
            errors,
            messages,
        };
    }, [searchParams]);

    const [state, action, isPending] = useActionState(register, initialState);

    return <RegisterForm state={state} action={action} isPending={isPending} />;
};

export default Register;
