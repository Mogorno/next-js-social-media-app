'use server';

import { AuthError } from 'next-auth';
import { signIn } from '@/auth';
import { hashPassword } from '@/helpers/bcrypt';
import { prisma } from '@/prisma';
import RegisterSchema, {
    RegisterType,
    RegisterFlattenedErrors,
} from '@/helpers/Validation/RegisterSchema';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { ZodError } from 'zod';

export interface RegisterState {
    values: RegisterType;
    status: 'failed' | 'verification' | 'success';
    errors?: RegisterFlattenedErrors['fieldErrors'];
    messages?: string[];
}

export interface RegisterFn {
    (prevState: RegisterState, formData: FormData): Promise<RegisterState>;
}

const register: RegisterFn = async (prevState, formData) => {
    const provider = formData.get('provider')?.toString() || 'credentials';

    const values = {
        name: formData.get('name')?.toString() ?? '',
        email: formData.get('email')?.toString() ?? '',
        password: formData.get('password')?.toString() ?? '',
    };

    try {
        if (provider !== 'credentials') {
            await signIn(provider, {
                redirectTo: DEFAULT_LOGIN_REDIRECT,
            });
        }

        const { email, password, name } =
            await RegisterSchema.parseAsync(values);

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return {
                values,
                status: 'failed',
                messages: ['User with this email already exists'],
            };
        }

        const hashedPassword = await hashPassword(password);

        await prisma.user.create({
            data: {
                name,
                email,
                hashPassword: hashedPassword,
            },
        });

        await signIn('credentials', {
            email,
            password,
            redirect: false,
        });

        return {
            status: 'success',
            values: { email: '', password: '', name: '' },
        };
    } catch (error) {
        const messages = ['Something went wrong', 'Registration is failed'];

        if (error instanceof Error && error.message.includes('NEXT_REDIRECT'))
            throw error;

        if (error instanceof ZodError) {
            return {
                values,
                status: 'failed',
                errors: error.flatten().fieldErrors,
            };
        }

        if (error instanceof AuthError) {
            const { name, cause } = error;

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
        }

        return { values, status: 'failed', messages };
    }
};

export default register;
