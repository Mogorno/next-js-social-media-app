'use client';

import ResetForm from '@/components/Forms/ResetForm';
import { useActionState } from 'react';
import reset, { ResetState } from '@/actions/auth/reset';
import { validation } from '@/helpers/Validation';
import ResetSchema from '@/helpers/Validation/ResetSchema';

const initialState: ResetState = {
    values: { email: '' },
    status: 'failed',
    errors: validation(ResetSchema, { email: '' }),
};

const Reset = () => {
    const [state, action, isPending] = useActionState(reset, initialState);

    return <ResetForm state={state} action={action} isPending={isPending} />;
};

export default Reset;
