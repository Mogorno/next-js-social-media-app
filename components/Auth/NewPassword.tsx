'use client';

import { useActionState, useMemo } from 'react';
import newPassword, { NewPasswordState } from '@/actions/auth/newPassword';
import { validation } from '@/helpers/Validation';
import NewPasswordSchema from '@/helpers/Validation/NewPasswordSchema';
import NewPasswordForm from '../Forms/NewPasswordForm';
import { useSearchParams } from 'next/navigation';

const NewPassword = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get('token') ?? '';

    const initialState = useMemo<NewPasswordState>(() => {
        const values = { password: '' };
        const validationErrors = validation(NewPasswordSchema, values);
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

    const [state, action, isPending] = useActionState(
        newPassword,
        initialState
    );

    return (
        <NewPasswordForm
            token={token}
            state={state}
            action={action}
            isPending={isPending}
        />
    );
};

export default NewPassword;
