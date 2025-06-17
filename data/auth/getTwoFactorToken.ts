import { prisma } from '@/prisma';

export const getTwoFactorTokenByToken = async (token: string) => {
    try {
        const twoFactorToken = await prisma.twoFactorToken.findUnique({
            where: {
                token,
            },
        });

        return twoFactorToken;
    } catch {
        return null;
    }
};

export const getTwoFactorTokenByIdentifier = async (identifier: string) => {
    try {
        const twoFactorToken = await prisma.twoFactorToken.findFirst({
            where: {
                identifier,
            },
        });

        return twoFactorToken;
    } catch {
        return null;
    }
};
