import { UserFriendship } from '@/data/friendship/getFriends';

const addFriend = ({
    refetch,
    optimistic,
}: {
    refetch: Function;
    optimistic: Function;
}) => {
    return async (
        _: {
            friend: { email: string; name: string; image: string };
            errors?: string;
        },
        FormData: FormData
    ) => {
        const newFriend: UserFriendship = {
            id: FormData.get('id') ?? '',
            email: FormData.get('email') ?? null,
            name: FormData.get('name') ?? null,
            image: FormData.get('image') ?? null,
            friendshipId: crypto.randomUUID(),
            status: 'PENDING',
        };
        const { friend, errors } = FormData;
    };
};

export default addFriend;
