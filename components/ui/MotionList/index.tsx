'use client';

import { motion, Variants, HTMLMotionProps } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import Item, { MotionListItemComponent } from './Item';

interface MotionListProps extends HTMLMotionProps<'ul'> {
    children: React.ReactNode;
}

interface MotionListComponent extends React.FC<MotionListProps> {
    Item: MotionListItemComponent;
}

const variants: Variants = {
    initial: {
        transition: {
            staggerChildren: 0.07,
            delayChildren: 0.1,
        },
    },
    animate: {
        transition: {
            staggerChildren: 0.07,
            delayChildren: 0.1,
        },
    },
    exit: {
        transition: {
            staggerChildren: 0.05,
            staggerDirection: -1,
        },
    },
};

const MotionList: MotionListComponent = ({
    className,
    children,
    ...restProps
}) => {
    return (
        <motion.ul
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={twMerge(
                'bg-secondaryBG text-mainText w-full h-full flex flex-col gap-1 scrollbar-thumb-rounded-lg scrollbar-thin hover:scrollbar-thumb-primaryBG active:scrollbar-thumb-innerBG scrollbar-thumb-mainBG scrollbar-track-transparent',
                className
            )}
            {...restProps}
        >
            {children}
        </motion.ul>
    );
};

MotionList.Item = Item;

export default MotionList;
