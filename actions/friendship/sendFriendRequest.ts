'use server';

import { auth } from '@/auth';
import { getFriendshipById } from '@/data/friendship/getFriendship';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function sendFriendRequest(receiverId: string) {
    const session = await auth();
    if (!session?.user)
        throw new Error('You are not authorized to add a friend.');

    const initiatorId = session.user.id;

    if (initiatorId === receiverId) {
        throw new Error("You can't send a friend request to yourself.");
    }

    const existingFriendship = await getFriendshipById(initiatorId, receiverId);

    if (existingFriendship) {
        if (existingFriendship.status === 'PENDING') {
            throw new Error('Friend request already sent or received.');
        }
        if (existingFriendship.status === 'ACCEPTED') {
            throw new Error('You are already friends.');
        }
    }

    const friendRequest = await prisma.friendship.create({
        data: {
            initiatorId,
            receiverId,
        },
    });

    return friendRequest;
}
