'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import NextLink, { LinkProps } from 'next/link';
import ConditionIcon, {
    ConditionIconProps,
} from '@/components/ui/ConditionIcon';

type Direction = 'bottom' | 'right' | 'top' | 'left';

type HTMLLinkProps = LinkProps & React.ComponentProps<'a'>;

interface NavLinkProps extends HTMLLinkProps {
    layoutId?: string;
    title?: string;
    Icons?: ConditionIconProps['Icons'];
    direction?: Direction;
}

const directionStyles: Record<Direction, string> = {
    top: '-top-1 h-1 w-full',
    bottom: '-bottom-1 h-1 w-full ',
    right: '-right-2 h-full w-1',
    left: '-left-2 h-full w-1',
};

const NavLink = ({
    title,
    children,
    Icons,
    href,
    layoutId,
    direction = 'bottom',
    ...restProps
}: NavLinkProps) => {
    const pathName = usePathname();

    const isActive = pathName === href;

    return (
        <NextLink
            className="relative flex items-center justify-center gap-1"
            href={href}
            {...restProps}
        >
            <ConditionIcon renderIndex={isActive} Icons={Icons} />
            {isActive && (
                <motion.div
                    className={`bg-mainText absolute rounded-full ${directionStyles[direction]}`}
                    layoutId={layoutId ?? 'Links-Underline'}
                />
            )}
            {children ?? title}
        </NextLink>
    );
};

export default NavLink;
