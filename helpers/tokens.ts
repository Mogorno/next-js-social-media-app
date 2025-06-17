import { getPasswordResetTokenByIdentifier } from '@/data/auth/getPasswordResetToken';
import { getTwoFactorTokenByIdentifier } from '@/data/auth/getTwoFactorToken';
import { getVerificationTokenByIdentifier } from '@/data/auth/getVerificationToken';
import { prisma } from '@/prisma';
import { getRandomInt } from '.';

export const generateVerificationToken = async (identifier: string) => {
    const existingToken = await getVerificationTokenByIdentifier(identifier);

    if (existingToken) {
        await prisma.verificationToken.delete({
            where: { id: existingToken.id },
        });
    }

    const token = crypto.randomUUID();
    // 1 hour
    const expires = new Date(new Date().getTime() + 60 * 60 * 1000);

    const verificationToken = await prisma.verificationToken.create({
        data: {
            identifier,
            token,
            expires,
        },
    });

    return verificationToken;
};

export const generatePasswordResetToken = async (identifier: string) => {
    const existingToken = await getPasswordResetTokenByIdentifier(identifier);

    if (existingToken) {
        await prisma.passwordResetToken.delete({
            where: { id: existingToken.id },
        });
    }

    const token = crypto.randomUUID();
    // 1 hour
    const expires = new Date(new Date().getTime() + 60 * 60 * 1000);

    const passwordResetToken = await prisma.passwordResetToken.create({
        data: {
            identifier,
            token,
            expires,
        },
    });

    return passwordResetToken;
};

export const generateTwoFactorToken = async (identifier: string) => {
    const existingToken = await getTwoFactorTokenByIdentifier(identifier);

    if (existingToken) {
        await prisma.twoFactorToken.delete({
            where: { id: existingToken.id },
        });
    }

    const token = getRandomInt(100_000, 1_000_000).toString();
    // 5 min
    const expires = new Date(new Date().getTime() + 5 * 60 * 1000);

    const twoFactorTokenToken = await prisma.twoFactorToken.create({
        data: {
            identifier,
            token,
            expires,
        },
    });

    return twoFactorTokenToken;
};
