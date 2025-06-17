'use client';

import { useMobileMenuContext } from '@/context/MobileMenuContext';
import { motion, Variants, HTMLMotionProps } from 'framer-motion';
import cn from 'classnames';

interface ButtonProps extends HTMLMotionProps<'button'> {}

const MobileMenuButton = ({
    onClick,
    key,
    className,
    ...restProps
}: ButtonProps) => {
    const { isOpen, toggle } = useMobileMenuContext();

    const handleOnClick: React.MouseEventHandler<HTMLButtonElement> = (
        event
    ) => {
        if (onClick) {
            onClick(event);
        } else {
            toggle();
        }
    };

    const figureCN = `w-full h-1/5 rounded bg-mainText`;

    const buttonVariants: Variants = {
        initial: {},
        open: {},
        closed: {},
        whileOpenTap: {},
        whileClosedTap: {},
        whileHover: {},
    };
    const containerVariants: Variants = {
        initial: {},
        open: {},
        closed: {},
        whileOpenTap: { rotate: [90, 0] },
        whileClosedTap: {},
        whileHover: { scale: 0.9 },
    };
    const topVariants: Variants = {
        initial: { backgroundColor: 'var(--mainText)' },
        open: {
            top: '50%',
            y: '-50%',
            rotate: 45,
        },
        closed: {
            top: '0%',
            y: '0%',
            rotate: 0,
        },
        whileOpenTap: {},
        whileClosedTap: { top: '10%' },
        whileHover: { backgroundColor: 'var(--primaryText)' },
    };
    const centerVariants: Variants = {
        initial: { backgroundColor: 'var(--mainText)' },
        open: {
            opacity: 0,
            scaleX: 0,
        },
        closed: {
            opacity: 1,
            scaleX: 1,
        },
        whileOpenTap: {},
        whileClosedTap: {},
        whileHover: { backgroundColor: 'var(--primaryText)' },
    };
    const bottomVariants: Variants = {
        initial: { backgroundColor: 'var(--mainText)' },
        open: {
            bottom: '50%',
            y: '50%',
            rotate: -45,
        },
        closed: {
            bottom: 0,
            y: '0%',
            rotate: 0,
        },
        whileOpenTap: {},
        whileClosedTap: { bottom: '10%' },
        whileHover: { backgroundColor: 'var(--primaryText)' },
    };

    return (
        <motion.button
            key={key ? key : 'MobileMenuButton'}
            layoutId="underline"
            onClick={handleOnClick}
            className={cn(
                'h-6 aspect-square flex items-center justify-center relative',
                className
            )}
            variants={buttonVariants}
            initial="initial"
            animate={isOpen ? 'open' : 'closed'}
            whileTap={isOpen ? 'whileOpenTap' : 'whileClosedTap'}
            whileHover="whileHover"
            {...restProps}
        >
            <motion.div
                variants={containerVariants}
                className="w-full h-full relative flex items-center justify-center"
            >
                <motion.figure
                    variants={topVariants}
                    className={cn('absolute top-0 inset-x-0', figureCN)}
                />
                <motion.figure
                    variants={centerVariants}
                    className={cn('absolute inset-0 m-auto', figureCN)}
                />
                <motion.figure
                    variants={bottomVariants}
                    className={cn('absolute bottom-0 inset-x-0', figureCN)}
                />
            </motion.div>
        </motion.button>
    );
};

export default MobileMenuButton;
