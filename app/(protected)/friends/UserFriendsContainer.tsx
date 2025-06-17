'use client';

import { startTransition, Suspense } from 'react';
import FriendsList from './FriendsContainer/FriendsList';
import SearchFriends from './SearchFriends';
// import { useFriends } from './useFriends';
import { useOptimisticFriends } from './useOptimisticFriends';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import { useFriends } from '../_components/FriendsContext';
import FriendsFilters from './FriendsContainer/FriendsFilters';
import FriendsContainer from './FriendsContainer';

const UserFriendsContainer = () => {
    const {
        useFriendsList,
        useSearchedFriendsList,
        searchFriends,
        addFriend,
        deleteFriend,
    } = useOptimisticFriends();

    const { refetchFriends } = useFriends();
    return (
        <div className="p-4 bg-mainBG text-secondaryText">
            <h1>Friends List</h1>
            <div className="relative z-10">
                <SearchFriends
                    addFriend={addFriend}
                    useSearchedFriendsList={useSearchedFriendsList}
                    searchFriends={searchFriends}
                />
            </div>
            <div className="flex flex-col gap-4 w-full mt-4">
                <ErrorBoundary
                    errorComponent={(error) => (
                        <div>
                            {error.message}
                            <h3>Something went wrong</h3>{' '}
                            <button
                                onClick={() =>
                                    startTransition(() => refetchFriends())
                                }
                            >
                                Try again
                            </button>
                        </div>
                    )}
                >
                    <Suspense fallback={<div>Loading...</div>}>
                        <FriendsContainer
                            useFriendsList={useFriendsList}
                            deleteFriend={deleteFriend}
                        />
                    </Suspense>
                </ErrorBoundary>
            </div>
        </div>
    );
};

export default UserFriendsContainer;
