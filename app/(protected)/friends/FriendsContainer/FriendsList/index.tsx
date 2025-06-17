import { DeleteFriendType } from '../../useOptimisticFriends';
import FriendCard from './FriendCard';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { UserFriend } from '@/data/friendship';

interface FriendsListProps {
    errors: Record<UserFriend['id'], NodeJS.Timeout>;
    friends: UserFriend[];
    deleteFriend: (friends: Parameters<DeleteFriendType>[0]) => () => void;
}

const FriendsList = ({ friends, errors, deleteFriend }: FriendsListProps) => {
    const searchParams = useSearchParams();
    const sortMethod = searchParams.get('sort') ?? 'asc';
    const sortedFriends = friends.sort((a, b) => {
        const aName = a.name ?? a.id;
        const bName = b.name ?? b.id;
        if (sortMethod === 'asc') {
            return aName.localeCompare(bName);
        }
        return bName.localeCompare(aName);
    });

    return (
        <LayoutGroup id="user-friends-list">
            <motion.ul layout className={`flex flex-col gap-2`}>
                <AnimatePresence>
                    {sortedFriends &&
                        sortedFriends.map((user) => (
                            <FriendCard
                                key={user.id}
                                {...user}
                                hasError={user.id in errors}
                                deleteFriend={deleteFriend(user)}
                            />
                        ))}
                </AnimatePresence>
            </motion.ul>
        </LayoutGroup>
    );
};

export default FriendsList;
