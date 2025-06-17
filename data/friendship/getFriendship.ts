import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getFriendshipById = async (
    initiatorId: string,
    receiverId: string
) => {
    const friendship = await prisma.friendship.findFirst({
        where: {
            OR: [
                { initiatorId, receiverId },
                { initiatorId: receiverId, receiverId: initiatorId },
            ],
        },
    });

    return friendship;
};
