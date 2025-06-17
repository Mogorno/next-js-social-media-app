'use server';

import { prisma } from '@/prisma';
import { SearchedUserFriendsPromise } from '.';
import { auth } from '@/auth';

export async function searchFriendsByIdentifier(
    identifier: string,
    userId: string
): SearchedUserFriendsPromise {
    const users = await prisma.user.findMany({
        where: {
            AND: [
                {
                    id: {
                        not: userId,
                    },
                },
                {
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
                {
                    friendshipsReceived: {
                        none: {
                            initiatorId: userId,
                        },
                    },
                },
                {
                    friendshipsInitiated: {
                        none: {
                            receiverId: userId,
                        },
                    },
                },
            ],
        },
        take: 10,
        select: {
            id: true,
            email: true,
            name: true,
            image: true,
        },
    });
    if (!users || users.length === 0) return null;
    return users;
}

export const searchCurrentUserFriendsByIdentifier = async (search: string) => {
    const session = await auth();
    if (!session || !session.user)
        throw new Error('You are not authorized to view this page.');

    return searchFriendsByIdentifier(search, session.user.id);
};
