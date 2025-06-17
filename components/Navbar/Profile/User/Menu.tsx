'use client';

import { PROFILE, LOGOUT } from '@/helpers/NAVIGATE_LINKS';
import ModalMenu, { ModalMenuProps } from '@/components/ModalMenu';
import MotionList from '@/components/ui/MotionList';
import Link from 'next/link';
import logout from '@/actions/auth/logout';
import { usePathname } from 'next/navigation';
import { Session } from 'next-auth';
import { twMerge } from 'tailwind-merge';
import { UserCard } from '@/components/UserCard';

export interface MenuProps extends ModalMenuProps {
    user: Session['user'];
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const Menu = ({
    user,
    isOpen,
    setIsOpen,
    className,
    ...restProps
}: MenuProps) => {
    const pathname = usePathname();

    return (
        <ModalMenu
            className={twMerge(
                'absolute -top-1.5 -right-1.5 rounded-lg rounded-se-[1.5rem] overflow-hidden origin-top-right pr-12',
                className
            )}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            whileOpenStyle={{
                height: '144px',
            }}
            {...restProps}
        >
            <MotionList className="relative flex flex-col gap-3 overflow-hidden p-2">
                <UserCard user={user} isResponsive />
                <MotionList.Item
                    className={pathname === PROFILE.href ? 'bg-mainBG' : ''}
                >
                    <Link
                        href={PROFILE.href + '/' + user.id}
                        className="flex w-full items-center gap-2"
                    >
                        {pathname === PROFILE.href ? (
                            <PROFILE.Icon />
                        ) : (
                            <PROFILE.IconOutline />
                        )}
                        <span>{PROFILE.title}</span>
                    </Link>
                </MotionList.Item>
                <MotionList.Item className="flex w-full items-center gap-2">
                    <LOGOUT.IconOutline />
                    <form action={logout}>
                        <button type="submit">{LOGOUT.title}</button>
                    </form>
                </MotionList.Item>
            </MotionList>
        </ModalMenu>
    );
};

export default Menu;
