import { memo } from 'react';
import User from './User';

type UsersListProps = {
    users: Array<{ name: string; id: number }>;
};

const UsersList = ({ users }: UsersListProps) => {
    return (
        <ul className="flex flex-col gap-2">
            {users.map((user) => (
                <User key={user.id} user={user} />
            ))}
        </ul>
    );
};

export default memo(UsersList);
