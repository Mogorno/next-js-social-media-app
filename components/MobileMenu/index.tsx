'use client';

import { useMobileMenuContext } from '@/context/MobileMenuContext';
import MobileMenuButton from './MobileMenuButton';
import { linksList } from '@/helpers/NAVIGATE_LINKS';
import Link from 'next/link';
import Logo from '@/components/Navbar/Logo';

const MobileMenu = () => {
    const { isOpen } = useMobileMenuContext();
    if (!isOpen) return;

    return (
        <div className="fixed w-screen h-screen inset-0 z-50 overflow-hidden">
            <div className="relative w-full h-full bg-primaryBG text-mainText">
                <div className="absolute h-24 w-full layout flex justify-between items-center">
                    <Logo />
                    <MobileMenuButton />
                </div>
                <ul className="flex h-full flex-col justify-center items-center gap-4">
                    {linksList.map(({ title, href }, index) => (
                        <li key={index}>
                            <Link href={href}>{title}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default MobileMenu;
