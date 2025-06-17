'use client';

import { getCurrentUserFriends } from '@/data/friendship/getFriends';
import { UserFriendsPromise } from '@/data/friendship';

import {
    createContext,
    Dispatch,
    SetStateAction,
    startTransition,
    use,
    useState,
} from 'react';

type FriendsContextType = {
    friendsPromise: UserFriendsPromise;
    refetchFriends: () => void;
    setFriendsPromise: Dispatch<SetStateAction<UserFriendsPromise>>;
};

const FriendsContext = createContext<FriendsContextType | null>(null);

export function FriendsProvider({
    defaultFriendsPromise = new Promise((resolve) => resolve(null)),
    children,
}: {
    defaultFriendsPromise?: UserFriendsPromise;
    children: React.ReactNode;
}) {
    const [friendsPromise, setFriendsPromise] = useState(defaultFriendsPromise);

    const refetchFriends = () =>
        startTransition(() => setFriendsPromise(getCurrentUserFriends()));

    return (
        <FriendsContext
            value={{ friendsPromise, refetchFriends, setFriendsPromise }}
        >
            {children}
        </FriendsContext>
    );
}

export function useFriends() {
    const context = use(FriendsContext);
    if (!context) {
        throw new Error('useFriends must be used within a FriendsProvider');
    }
    return context;
}
