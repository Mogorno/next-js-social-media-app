'use client';

import NavigateLink from '@/components/Navbar/NavLinks/NavLink';
import { LOGIN, REGISTER } from '@/helpers/NAVIGATE_LINKS';

const Auth = () => {
    return (
        <>
            <NavigateLink
                Icons={[LOGIN.IconOutline, LOGIN.Icon]}
                title={LOGIN.title}
                href={LOGIN.href}
            />
            |
            <NavigateLink
                Icons={[REGISTER.IconOutline, REGISTER.Icon]}
                title={REGISTER.title}
                href={REGISTER.href}
            />
        </>
    );
};

export default Auth;
