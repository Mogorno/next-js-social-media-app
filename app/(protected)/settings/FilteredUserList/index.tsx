'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { memo, useCallback, useRef, useState } from 'react';

type UserSchema = { name: string; id: number };

type FilteredUserListProps = {
    users: Array<UserSchema>;
};

const FilteredUserList = ({ users }: FilteredUserListProps) => {
    return (
        <div className="flex flex-col gap-2">
            <h1 className="text-2xl">Filtered User List</h1>
            <SearchInput />
            <UsersList users={users} />
        </div>
    );
};

export default FilteredUserList;

const useSearchInput = (): {
    isPending: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
} => {
    const router = useRouter();
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [isPending, setIsPending] = useState(false);

    const onChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (timerRef.current) clearTimeout(timerRef.current);
            setIsPending(true);
            timerRef.current = setTimeout(() => {
                router.push(`?search=${e.target.value}`);
                setIsPending(false);
            }, 1000);
        },
        [router]
    );

    return {
        isPending,
        onChange,
    };
};

const SearchInput = memo(() => {
    const { isPending, onChange } = useSearchInput();

    return (
        <input
            className={`${isPending ? 'animate-pulse outline-none bg-gray-900' : ''} w-full bg-black text-white p-2 rounded`}
            onChange={onChange}
        />
    );
});

SearchInput.displayName = 'SearchInput';

type UsersListProps = {
    users: Array<UserSchema>;
};

const useFilteredUsers = (users: Array<UserSchema>) => {
    const searchParams = useSearchParams();
    const searchValue = searchParams.get('search') ?? '';
    const filteredUsers = users.filter((user) =>
        user.name.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())
    );
    return filteredUsers;
};

const UsersList = memo(({ users }: UsersListProps) => {
    const filteredUsers = useFilteredUsers(users);
    return (
        <ul className="flex flex-col gap-2">
            {filteredUsers.map((user) => (
                <User key={user.id} {...user} />
            ))}
        </ul>
    );
});

UsersList.displayName = 'UsersList';

// я дестуктурував обєкт user таким чином в компонент User не приймає обєкта і це запобігає лишнім ререндерам
export type UserProps = UserSchema;

const User = memo(({ name }: UserProps) => {
    return (
        <li className="bg-black text-white p-1 rounded">User name: {name}</li>
    );
});

User.displayName = 'User';
