'use server';

import { auth } from '@/auth';
import { prisma } from '@/prisma';
import { UserFriend, UserFriendsPromise, UserFriendKeys } from '.';

const select: Record<UserFriendKeys, true> = {
    id: true,
    image: true,
    email: true,
    name: true,
};

export const getFriendsByUserId = async (
    userId: string
): UserFriendsPromise => {
    if (!userId) throw new Error('UserId is required');

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            friendshipsInitiated: {
                include: {
                    receiver: {
                        select,
                    },
                },
            },
            friendshipsReceived: {
                include: {
                    initiator: {
                        select,
                    },
                },
            },
        },
    });

    if (!user) throw new Error("User don't exist");

    const friends: UserFriend[] = [];

    for (const f of user.friendshipsInitiated) {
        const otherUser: UserFriend = {
            ...f.receiver,
            status: f.status,
        };
        friends.push(otherUser);
    }
    for (const f of user.friendshipsReceived) {
        const otherUser: UserFriend = {
            ...f.initiator,
            status: f.status,
        };
        friends.push(otherUser);
    }

    if (friends.length === 0) return null;

    return friends;
};

export const getCurrentUserFriends = async () => {
    const session = await auth();
    if (!session || !session.user)
        throw new Error('You are not authorized to view this page.');

    return getFriendsByUserId(session.user.id);
};
