'use client';

import { motion, Variants, HTMLMotionProps } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

export interface MotionListItemProps extends HTMLMotionProps<'li'> {
    children: React.ReactNode;
}

export type MotionListItemComponent = React.FC<MotionListItemProps>;

const variants: Variants = {
    initial: {
        x: 50,
        opacity: 0,
    },
    animate: {
        x: 0,
        opacity: 1,
    },
    exit: {
        x: 50,
        opacity: 0,
    },
};

const Item: MotionListItemComponent = ({
    className,
    children,
    ...restProps
}) => {
    return (
        <motion.li
            variants={variants}
            className={twMerge(
                `cursor-pointer p-1 rounded-md active:bg-primaryBG active:text-secondaryText hover:bg-innerBG hover:text-innerText transition-colors`,
                className
            )}
            {...restProps}
        >
            {children}
        </motion.li>
    );
};

export default Item;
