'use client';

import { Session } from 'next-auth';
import { useState } from 'react';
import Menu from './Menu';
import { UserCard, UserCardProps } from '@/components/UserCard';

export interface UserProps extends UserCardProps {
    user: Session['user'];
    showEmail?: boolean;
    showName?: boolean;
    menuClassName?: string;
}

const User = ({ user, menuClassName, ...restProps }: UserProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const handleOnClick = () => setIsOpen((prev) => !prev);
    return (
        <UserCard
            onClick={handleOnClick}
            user={user}
            isResponsive
            {...restProps}
        >
            <Menu
                user={user}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                className={menuClassName}
            />
        </UserCard>
    );
};

export default User;
