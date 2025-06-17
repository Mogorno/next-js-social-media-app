'use server';

import { AuthError } from 'next-auth';
import { signIn } from '@/auth';
import {
    LoginType,
    LoginFlattenedErrors,
} from '@/helpers/Validation/LoginSchema';
import { ZodError } from 'zod';

export interface LoginState {
    values: LoginType;
    status:
        | 'failed'
        | 'verification'
        | 'twoFactorVerification'
        | 'twoFactorVerificationFailed'
        | 'success';
    errors?: LoginFlattenedErrors['fieldErrors'];
    messages?: string[];
}

export interface LoginFn {
    (prevState: LoginState, formData: FormData): Promise<LoginState>;
}

const login: LoginFn = async (prevState, formData) => {
    const provider = formData.get('provider')?.toString() || 'credentials';

    const values: LoginType = {
        email: formData.get('email')?.toString() ?? '',
        password: formData.get('password')?.toString() ?? '',
        twoFactorCode:
            formData.get('twoFactorCode')?.toString().replaceAll(' ', '') ??
            undefined,
    };

    try {
        await signIn(provider, {
            ...values,
            redirect: false,
        });

        return {
            values: { email: '', password: '' },
            status: 'success',
        };
    } catch (error) {
        const messages = ['Something went wrong', 'Authentication failed'];

        if (error instanceof Error && error.message.includes('NEXT_REDIRECT'))
            throw error;

        if (error instanceof AuthError) {
            const { name, cause, message } = error;

            if (name === 'Validation' && cause?.err instanceof ZodError)
                return {
                    values,
                    status: 'failed',
                    errors: cause.err.flatten().fieldErrors,
                };

            if (name === 'CredentialsSignin')
                return {
                    values,
                    status: 'failed',
                    messages: ['Invalid email or password'],
                };

            if (name === 'Verification')
                return {
                    values,
                    status: 'verification',
                    messages: ['Confirmation email sent to your email'],
                };

            if (name === 'TwoFactorVerification')
                return {
                    values,
                    status: 'twoFactorVerification',
                    messages: [message],
                };
            if (name === 'TwoFactorVerificationError')
                return {
                    values,
                    status: 'twoFactorVerificationFailed',
                    messages: [message],
                };
        }

        return { values, status: 'failed', messages };
    }
};

export default login;
