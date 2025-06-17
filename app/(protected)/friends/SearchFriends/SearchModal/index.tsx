'use client';

import MotionList from '@/components/ui/MotionList';
import { SearchedUserFriend } from '@/data/friendship';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import {
    AddFriendType,
    UseSearchedFriendsListType,
} from '../../useOptimisticFriends';
import { IoPersonAdd } from 'react-icons/io5';
import { useState } from 'react';
import { UserCard } from '@/components/UserCard';

interface SearchModalProps {
    useSearchedFriendsList: UseSearchedFriendsListType;
    addFriend: AddFriendType;
}

const SearchModal = ({
    addFriend,
    useSearchedFriendsList,
}: SearchModalProps) => {
    const users = useSearchedFriendsList() as SearchedUserFriend[];
    const [error, setError] = useState<SearchedUserFriend[] | null>(null);
    const handleAddFriend = (friend: SearchedUserFriend) => {
        addFriend(friend, (error, f) => {
            setError((prev) => (prev ? [...prev, f] : [f]));
            setTimeout(
                () =>
                    setError((prev) => {
                        if (!prev) return null;
                        return prev.filter((prevF) => prevF.id !== f.id);
                    }),
                5000
            );
        });
    };

    return (
        <AnimatePresence propagate>
            {users && users.length > 0 && (
                <motion.div
                    key="modal-search"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute left-0 flex items-center justify-center origin-top top-full mt-4"
                >
                    <LayoutGroup>
                        <MotionList
                            className="relative rounded flex flex-col gap-1 overflow-hidden"
                            layout
                        >
                            {users.map((user) => (
                                <MotionList.Item
                                    layout
                                    className={`${error?.some((f) => f.id === user.id) ? 'ring-1 ring-errorText' : ''} rounded-none flex flex-shrink-0 flex-grow-0 justify-between gap-2`}
                                    key={`Search-${user.id}`}
                                >
                                    <UserCard user={user} />

                                    <button
                                        onClick={() => handleAddFriend(user)}
                                        className="flex items-center gap-2 rounded bg-secondaryBG px-4 py-2 text-secondaryText transition-all hover:text-mainText hover:bg-primaryBG"
                                    >
                                        <span className="hidden sm:inline">
                                            Add friend
                                        </span>
                                        <IoPersonAdd className="text-2xl font-bold" />
                                    </button>
                                </MotionList.Item>
                            ))}
                        </MotionList>
                    </LayoutGroup>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SearchModal;
