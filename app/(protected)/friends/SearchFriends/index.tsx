'use client';

import Input from '@/components/ui/Input';
import { useTransition, Suspense, useState } from 'react';
import SearchModal from './SearchModal';
import {
    AddFriendType,
    SearchFriendsType,
    UseSearchedFriendsListType,
} from '../useOptimisticFriends';
import { ErrorBoundary } from 'react-error-boundary';
import { AnimatePresence } from 'motion/react';
import { IoPersonAdd, IoSearch, IoWarning } from 'react-icons/io5';
import SearchMessage from './SearchModal/SearchMessage';
import useModalClose from '@/hooks/useModalClose';

interface SearchFriendsProps {
    addFriend: AddFriendType;
    useSearchedFriendsList: UseSearchedFriendsListType;
    searchFriends: SearchFriendsType;
}

const SearchFriends = ({
    addFriend,
    useSearchedFriendsList,
    searchFriends,
}: SearchFriendsProps) => {
    const [value, setValue] = useState('');
    const [isSearching, searchTransition] = useTransition();
    const [isAddingFriend, addFriendTransition] = useTransition();

    const handleSearchFriends = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setValue(value);
        searchTransition(() => searchFriends(value));
    };
    const handleAddFriend = (...args: Parameters<typeof addFriend>) => {
        addFriendTransition(() => addFriend(...args));
    };

    const containerRef = useModalClose<HTMLDivElement>({
        isOpen: value.length > 2,
        callback: () => {
            searchFriends('');
            setValue('');
        },
        options: {
            triggers: {
                exitKey: true,
            },
        },
    });
    return (
        <div
            ref={containerRef}
            className="relative flex items-center justify-between w-full"
        >
            <Input
                value={value}
                className="z-20 hover:opacity-100"
                onChange={handleSearchFriends}
                type="search"
                placeholder="Search friends"
            />
            <AnimatePresence propagate>
                <ErrorBoundary
                    resetKeys={[isSearching]}
                    FallbackComponent={() => (
                        <SearchMessage
                            key="search-error-message"
                            Icon={IoWarning}
                            sizeVariant="sm"
                            statusVariant="danger"
                        >
                            Something went wrong.
                        </SearchMessage>
                    )}
                >
                    <Suspense
                        fallback={
                            <SearchMessage
                                key="search-pending-message"
                                Icon={IoSearch}
                                sizeVariant="sm"
                                statusVariant="success"
                                isPending
                            >
                                Searching...
                            </SearchMessage>
                        }
                    >
                        <SearchModal
                            useSearchedFriendsList={useSearchedFriendsList}
                            addFriend={handleAddFriend}
                        />
                    </Suspense>
                </ErrorBoundary>
                {isAddingFriend && (
                    <SearchMessage
                        key="add-friend-pending-message"
                        Icon={IoPersonAdd}
                        sizeVariant="sm"
                        statusVariant="success"
                        isPending
                    >
                        Adding...
                    </SearchMessage>
                )}
            </AnimatePresence>
        </div>
    );
};
export default SearchFriends;
