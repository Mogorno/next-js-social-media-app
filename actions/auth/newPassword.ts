'use server';

import ResetSchema, {
    NewPasswordType,
    NewPasswordFlattenedErrors,
} from '@/helpers/Validation/NewPasswordSchema';
import { ZodError } from 'zod';
import { getPasswordResetTokenByToken } from '@/data/auth/getPasswordResetToken';
import { getUserByEmail } from '@/data/user/getUser';
import { prisma } from '@/prisma';
import { hashPassword } from '@/helpers/bcrypt';
import { compare } from 'bcrypt-ts';

export interface NewPasswordState {
    values: NewPasswordType;
    status: 'failed' | 'success';
    errors?: NewPasswordFlattenedErrors['fieldErrors'];
    messages?: string[];
}

interface ResetFn {
    (
        prevState: NewPasswordState,
        formData: FormData
    ): Promise<NewPasswordState>;
}

const newPassword: ResetFn = async (prevState, formData) => {
    const token = formData.get('token')?.toString() ?? '';

    const values = {
        password: formData.get('password')?.toString() ?? '',
    };

    if (!token)
        return { values, status: 'failed', messages: ['Invalid token'] };

    try {
        const { password } = await ResetSchema.parseAsync(values);

        const existingToken = await getPasswordResetTokenByToken(token);

        if (!existingToken)
            return {
                values,
                status: 'failed',
                messages: ['Invalid token'],
            };

        const hasExpired = new Date(existingToken.expires) < new Date();

        if (hasExpired)
            return {
                values,
                status: 'failed',
                messages: ['Token has expired'],
            };

        const existingUser = await getUserByEmail(existingToken.identifier);

        if (!existingUser)
            return {
                values,
                status: 'failed',
                messages: ['Email does not exist'],
            };

        const passwordIsMatch = await compare(
            password,
            existingUser.hashPassword ?? ''
        );

        if (passwordIsMatch)
            return {
                values,
                status: 'failed',
                messages: [
                    'Your new password cannot be the same as your current password.',
                ],
            };

        const hashedPassword = await hashPassword(password);

        await prisma.user.update({
            where: { email: existingToken.identifier },
            data: {
                hashPassword: hashedPassword,
            },
        });

        await prisma.passwordResetToken.delete({
            where: { id: existingToken.id },
        });

        return {
            values,
            status: 'success',
            messages: ['Password changed successfully'],
        };
    } catch (error) {
        const messages = ['Something went wrong'];

        if (error instanceof Error && error.message.includes('NEXT_REDIRECT'))
            throw error;

        if (error instanceof ZodError) {
            return {
                values,
                status: 'failed',
                errors: error.flatten().fieldErrors,
            };
        }

        return { values, status: 'failed', messages };
    }
};

export default newPassword;
