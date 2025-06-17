'use client';

import { createContext, Dispatch, SetStateAction, use, useState } from 'react';
import { SearchedUserFriendsPromise } from '@/data/friendship';
import { searchCurrentUserFriendsByIdentifier } from '@/data/friendship/searchFriends';
import { debounce } from '@/helpers';

type DebounceSearchFriendsType = (
    search: string,
    delay?: number,
    length?: number
) => void;

type SearchedFriendsContextType = {
    searchedFriendsPromise: SearchedUserFriendsPromise;
    setSearchedFriendsPromise: Dispatch<
        SetStateAction<SearchedUserFriendsPromise>
    >;
    searchFriends: (search: string) => void;
    clearSearchedFriends: () => void;
    debounceSearchFriends: DebounceSearchFriendsType;
};

const SearchedFriendsContext = createContext<SearchedFriendsContextType | null>(
    null
);

export function SearchedFriendsProvider({
    defaultSearchedFriendsPromise = new Promise((resolve) => resolve(null)),
    children,
}: {
    defaultSearchedFriendsPromise?: SearchedUserFriendsPromise;
    children: React.ReactNode;
}) {
    const [searchedFriendsPromise, setSearchedFriendsPromise] = useState(
        defaultSearchedFriendsPromise
    );

    const searchFriends = (search: string) => {
        const searchedFriends = searchCurrentUserFriendsByIdentifier(search);
        setSearchedFriendsPromise(searchedFriends);
    };

    const debounceSearch = debounce(searchFriends, 1000);

    const debounceSearchFriends: DebounceSearchFriendsType = (
        search,
        delay,
        length = 3
    ) => {
        if (delay) debounceSearch.delay(delay);
        if (search.length < length) return clearSearchedFriends();

        debounceSearch(search);
    };

    const clearSearchedFriends = () => {
        debounceSearch.clear();
        setSearchedFriendsPromise(new Promise((resolve) => resolve(null)));
    };

    return (
        <SearchedFriendsContext
            value={{
                searchedFriendsPromise,
                searchFriends,
                setSearchedFriendsPromise,
                clearSearchedFriends,
                debounceSearchFriends,
            }}
        >
            {children}
        </SearchedFriendsContext>
    );
}

export function useSearchedFriends() {
    const context = use(SearchedFriendsContext);
    if (!context) {
        throw new Error(
            'useSearchedFriends must be used within a SearchedFriendsProvider'
        );
    }
    return context;
}
