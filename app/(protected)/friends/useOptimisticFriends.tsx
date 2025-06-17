'use client';

import deleteFriendshipByFriendId from '@/actions/friendship/deleteFriendshipByFriendId';
import { sendFriendRequest } from '@/actions/friendship/sendFriendRequest';
import { UserFriend, SearchedUserFriend } from '@/data/friendship';
import {
    startTransition,
    use,
    useCallback,
    useOptimistic,
    useRef,
} from 'react';
import { useFriends } from '../_components/FriendsContext';
import { useSearchedFriends } from '../_components/SearchedFriendsContext';

export type UseFriendsListType = () => UserFriend[] | null;
export type UseSearchedFriendsListType = () => SearchedUserFriend[] | null;
export type SearchFriendsType = (
    search: string,
    errorCallback?: (error: Error, value: string) => void
) => void;
export type AddFriendType = (
    newFriend: SearchedUserFriend,
    errorCallback?: (error: Error, data: SearchedUserFriend) => void
) => void;
export type DeleteFriendType = (
    friend: SearchedUserFriend,
    errorCallback?: (error: Error, data: SearchedUserFriend) => void
) => void;

type UseOptimisticFriends = () => {
    useFriendsList: UseFriendsListType;
    useSearchedFriendsList: UseSearchedFriendsListType;
    searchFriends: SearchFriendsType;
    addFriend: AddFriendType;
    deleteFriend: DeleteFriendType;
};

const hasInSearchedFriends = (
    search: string,
    user: SearchedUserFriend
): boolean => {
    const { name, email } = user;
    if (search.length < 3) return false;
    if (typeof name === 'string' && name.includes(search)) return true;
    if (typeof email === 'string' && email.includes(search)) return true;
    return false;
};

export const useOptimisticFriends: UseOptimisticFriends = () => {
    const searchRef = useRef('');

    const { friendsPromise, refetchFriends } = useFriends();
    const { searchedFriendsPromise, searchFriends, debounceSearchFriends } =
        useSearchedFriends();

    const [addedFriends, optimisticAddFriend] = useOptimistic(
        [] as UserFriend[],
        (addedFriends, friend: UserFriend) => [...addedFriends, friend]
    );

    const [deletedFriendsIds, optimisticDeleteFriend] = useOptimistic(
        [] as string[],
        (deletedFriendsIds, id: string) => deletedFriendsIds.concat(id)
    );

    const [addedSearchedFriends, optimisticAddSearchedFriend] = useOptimistic(
        [] as SearchedUserFriend[],
        (addedFriends, friend: SearchedUserFriend) => [...addedFriends, friend]
    );

    const [deletedSearchedFriendsIds, optimisticDeleteSearchedFriend] =
        useOptimistic([] as string[], (deletedFriendsIds, id: string) =>
            deletedFriendsIds.concat(id)
        );

    const useFriendsList: UseFriendsListType = () => {
        if (!friendsPromise) return null;

        const friends = use(friendsPromise) ?? [];

        const optimisticFriends = friends
            .concat(addedFriends)
            .filter((friend) => !deletedFriendsIds.includes(friend.id));

        if (optimisticFriends.length === 0) return null;

        return optimisticFriends;
    };

    const useSearchedFriendsList: UseSearchedFriendsListType = () => {
        if (!searchedFriendsPromise) return null;

        const searchedFriendsList = use(searchedFriendsPromise) ?? [];

        const optimisticSearchedFriends = searchedFriendsList
            .concat(addedSearchedFriends)
            .filter((friend) => !deletedSearchedFriendsIds.includes(friend.id));

        if (optimisticSearchedFriends.length === 0) return null;

        return optimisticSearchedFriends;
    };

    const handleSearchFriends: SearchFriendsType = useCallback(
        (search, errorCallback) => {
            searchRef.current = search;
            try {
                startTransition(() => debounceSearchFriends(search));
            } catch (error) {
                if (errorCallback) errorCallback(error as Error, search);
            }
        },
        [debounceSearchFriends]
    );

    const addFriend: AddFriendType = useCallback(
        (newFriend, errorCallback) =>
            startTransition(async () => {
                try {
                    const newFriendData: UserFriend = {
                        ...newFriend,
                        status: 'PENDING',
                    };
                    optimisticDeleteSearchedFriend(newFriendData.id);
                    optimisticAddFriend(newFriendData);

                    await sendFriendRequest(newFriendData.id);

                    startTransition(() => {
                        refetchFriends();
                        searchFriends(searchRef.current);
                    });
                } catch (error) {
                    if (errorCallback) errorCallback(error as Error, newFriend);
                }
            }),
        [
            optimisticAddFriend,
            optimisticDeleteSearchedFriend,
            refetchFriends,
            searchFriends,
        ]
    );

    const deleteFriend: DeleteFriendType = useCallback(
        (friend, errorCallback) =>
            startTransition(async () => {
                try {
                    const isOptimisticSearchedFriend = hasInSearchedFriends(
                        searchRef.current,
                        friend
                    );

                    if (isOptimisticSearchedFriend)
                        optimisticAddSearchedFriend(friend);

                    optimisticDeleteFriend(friend.id);

                    await deleteFriendshipByFriendId(friend.id);

                    startTransition(() => {
                        refetchFriends();
                        if (isOptimisticSearchedFriend)
                            searchFriends(searchRef.current);
                    });
                } catch (error) {
                    if (errorCallback) errorCallback(error as Error, friend);
                }
            }),
        [
            optimisticAddSearchedFriend,
            optimisticDeleteFriend,
            refetchFriends,
            searchFriends,
        ]
    );
    return {
        searchFriends: handleSearchFriends,
        addFriend,
        deleteFriend,
        useFriendsList,
        useSearchedFriendsList,
    } as const;
};
