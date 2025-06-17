'use server';

import { User, Friendship } from '@prisma/client';

export type UserFriendKeys = 'id' | 'name' | 'image' | 'email';

export type SearchedUserFriend = Pick<User, UserFriendKeys>;

export interface UserFriend extends Pick<User, UserFriendKeys> {
    status: Friendship['status'];
}

export type UserFriendsPromise = Promise<UserFriend[] | null>;

export type SearchedUserFriendsPromise = Promise<SearchedUserFriend[] | null>;
