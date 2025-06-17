import { prisma } from '@/prisma';

export const getPasswordResetTokenByToken = async (token: string) => {
    try {
        const passwordResetToken = await prisma.passwordResetToken.findUnique({
            where: {
                token,
            },
        });

        return passwordResetToken;
    } catch {
        return null;
    }
};

export const getPasswordResetTokenByIdentifier = async (identifier: string) => {
    try {
        const passwordResetToken = await prisma.passwordResetToken.findFirst({
            where: {
                identifier,
            },
        });

        return passwordResetToken;
    } catch {
        return null;
    }
};
