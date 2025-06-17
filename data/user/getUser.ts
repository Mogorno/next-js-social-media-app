'use server';

import { prisma } from '@/prisma';

export const getUserByEmail = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    return user;
};

export const getUserById = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: {
            id,
        },
    });

    return user;
};

export const getUsersByIdentifier = async (identifier: string) => {
    const users = await prisma.user.findMany({
        where: {
            OR: [
                {
                    name: {
                        contains: identifier,
                        mode: 'insensitive',
                    },
                },
                {
                    email: {
                        contains: identifier,
                        mode: 'insensitive',
                    },
                },
            ],
        },
        take: 10,
    });

    return users;
};
