import { SearchedUserFriend, UserFriend } from '@/data/friendship';
import { DeleteFriendType, UseFriendsListType } from '../useOptimisticFriends';
import FriendsFilters from './FriendsFilters';
import FriendsList from './FriendsList';
import { useState, useTransition } from 'react';

interface FriendsContainerProps {
    useFriendsList: UseFriendsListType;
    deleteFriend: DeleteFriendType;
}

const FriendsContainer = ({
    useFriendsList,
    deleteFriend,
}: FriendsContainerProps) => {
    const friends = useFriendsList();
    const [isPending, startTransition] = useTransition();
    const [errors, setErrors] = useState<
        Record<UserFriend['id'], NodeJS.Timeout>
    >({});

    const handleDeleteFriend = (friend: SearchedUserFriend) => {
        return () =>
            startTransition(() => {
                deleteFriend(friend, (error, f) => {
                    setErrors((prev) => {
                        return {
                            ...prev,
                            [f.id]: setTimeout(
                                () =>
                                    setErrors((prev) => {
                                        const newErrors = { ...prev };
                                        delete newErrors[f.id];
                                        return newErrors;
                                    }),
                                5000
                            ),
                        };
                    });
                });
            });
    };
    return (
        <div className="relative flex flex-col gap-4">
            {isPending && (
                <div className="absolute top-0 right-0 ml-auto animate-pulse">
                    Deleting...
                </div>
            )}
            <FriendsFilters />
            <FriendsList
                friends={friends ?? []}
                errors={errors}
                deleteFriend={handleDeleteFriend}
            />
        </div>
    );
};

export default FriendsContainer;
