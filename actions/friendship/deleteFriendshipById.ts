'use server';

import { auth } from '@/auth';
import { prisma } from '@/prisma';

export async function deleteFriendshipById(friendshipId: string) {
    const session = await auth();

    if (!session)
        throw new Error('You are not authorized to delete this friendship.');

    const userId = session.user.id;

    const friendship = await prisma.friendship.findUnique({
        where: { id: friendshipId },
    });

    if (!friendship) {
        throw new Error('Friendship not found.');
    }

    const isUserInvolved =
        friendship.initiatorId === userId || friendship.receiverId === userId;

    if (!isUserInvolved) {
        throw new Error('You are not authorized to delete this friendship.');
    }

    await prisma.friendship.delete({
        where: { id: friendshipId },
    });
}
