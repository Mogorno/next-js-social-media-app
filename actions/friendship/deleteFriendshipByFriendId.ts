'use server';

import { auth } from '@/auth';
import { prisma } from '@/prisma';

const deleteFriendshipByFriendId = async (friendId: string) => {
    if (!friendId) throw new Error('FriendId is required');

    const session = await auth();

    if (!session)
        throw new Error('You are not authorized to delete this friendship.');

    const userId = session.user.id;

    if (userId === friendId)
        throw new Error('You can not delete your own friendship.');

    const friendship = await prisma.friendship.findFirst({
        where: {
            OR: [
                {
                    initiatorId: userId,
                    receiverId: friendId,
                },
                {
                    initiatorId: friendId,
                    receiverId: userId,
                },
            ],
        },
    });

    if (!friendship) {
        throw new Error('Friendship not found.');
    }

    await prisma.friendship.delete({
        where: { id: friendship.id },
    });
};

export default deleteFriendshipByFriendId;
