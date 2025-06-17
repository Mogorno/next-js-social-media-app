'use server';

import { getUserByEmail } from '@/data/user/getUser';
import { getVerificationTokenByToken } from '@/data/auth/getVerificationToken';
import { prisma } from '@/prisma';
import { signIn } from '@/auth';

export interface NewVerificationState {
    status: 'error' | 'success' | 'pending';
    message?: string | string[];
}

type NewVerificationType = (token: string) => Promise<NewVerificationState>;

const newVerification: NewVerificationType = async (token) => {
    const existingToken = await getVerificationTokenByToken(token);

    if (!existingToken) {
        return {
            status: 'error',
            message: 'Token does not exist!',
        };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
        return {
            status: 'error',
            message: 'Token has expired!',
        };
    }

    const existingUser = await getUserByEmail(existingToken.identifier);

    if (!existingUser) {
        return {
            status: 'error',
            message: 'Email does not exist!',
        };
    }

    await prisma.user.update({
        where: { id: existingUser.id },
        data: { emailVerified: new Date(), email: existingToken.identifier },
    });

    await prisma.verificationToken.delete({ where: { id: existingToken.id } });

    await signIn('credentials', {
        ...existingUser,
        isNewAccount: true,
        redirect: false,
    });

    return { status: 'success', message: 'Email verified!' };
};

export default newVerification;
