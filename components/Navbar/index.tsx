'use client';

import MobileMenuButton from '../MobileMenu/MobileMenuButton';
import Logo from './Logo';
import ThemeController from '@/components/ThemeController';
import Profile from './Profile';
import NavLinks from './NavLinks';

const Navbar = () => {
    return (
        <div className="bg-primaryBG text-mainText flex h-12 items-center justify-between layout fixed top-0 left-0 right-0 z-50">
            {/* Left */}
            <Logo />

            {/* Center */}
            <NavLinks />

            {/* Right */}
            <div className="flex items-center justify-end gap-2">
                <ThemeController />
                <Profile />
                <MobileMenuButton />
            </div>
        </div>
    );
};

export default Navbar;
