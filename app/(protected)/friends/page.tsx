'use server';

import UserFriendsContainer from './UserFriendsContainer';
import { getCurrentUserFriends } from '@/data/friendship/getFriends';
import { FriendsProvider } from '../_components/FriendsContext';
import { SearchedFriendsProvider } from '../_components/SearchedFriendsContext/index';

export default async function Friends() {
    const userFriendsPromise = getCurrentUserFriends();

    return (
        <FriendsProvider defaultFriendsPromise={userFriendsPromise}>
            <SearchedFriendsProvider>
                <UserFriendsContainer />
            </SearchedFriendsProvider>
        </FriendsProvider>
    );
}
