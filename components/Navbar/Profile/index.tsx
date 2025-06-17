'use client';

import { useSession } from 'next-auth/react';
import Loader from './Loader';
import AuthLinks from './AuthLinks';
import User from './User';
import { UserProps } from './User';

const Profile: React.FC<Omit<UserProps, 'user'>> = (props) => {
    const session = useSession();

    if (session.status === 'loading') return <Loader />;

    if (session.status === 'authenticated')
        return <User user={session.data.user} {...props} />;

    return <AuthLinks />;
};

export default Profile;
