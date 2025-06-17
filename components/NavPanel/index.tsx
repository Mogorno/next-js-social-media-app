'use client';

import { HOME, FRIENDS, SETTINGS, GROUP, STORIES } from '@/routes';
import NavLink from '../Navbar/NavLinks/NavLink';
import Profile from '../Navbar/Profile';
import { twMerge } from 'tailwind-merge';

const navigateLinks = [HOME, FRIENDS, SETTINGS, GROUP, STORIES];
const NavPanel: React.FC<React.ComponentProps<'aside'>> = ({
    className,
    ...restProps
}) => {
    return (
        <aside
            className={twMerge(
                'col-span-2 bg-secondaryBG p-4 shadow-md',
                className
            )}
            {...restProps}
        >
            <nav className="flex flex-col justify-start items-start gap-2 text-mainText">
                {navigateLinks.map(
                    ({ pathname, Icon, IconOutline, title }, index) => (
                        <NavLink
                            direction="right"
                            layoutId="NavPanel-Links"
                            Icons={[IconOutline, Icon]}
                            key={index}
                            href={pathname}
                        >
                            <span className={'hidden md:inline'}>{title}</span>
                        </NavLink>
                    )
                )}
                <Profile
                    className="z-10"
                    menuClassName="!origin-bottom-left !-translate-y-full !top-[calc(100%+8px)] w-48 -left-0 rounded pr-2 overflow-hidden"
                />
            </nav>
        </aside>
    );
};

export default NavPanel;
