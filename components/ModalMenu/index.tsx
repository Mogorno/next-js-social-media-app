'use client';

import {
    motion,
    Variants,
    Transition,
    AnimatePresence,
    HTMLMotionProps,
} from 'framer-motion';
import useModalClose from '@/hooks/useModalClose';
import { twMerge } from 'tailwind-merge';

export interface ModalMenuProps extends HTMLMotionProps<'div'> {
    isOpen: boolean;
    setIsOpen: (arg: boolean) => void;
    whileOpenStyle?: Variants['open'];
    whileClosedStyle?: Variants['closed'];
}

type ModalMenuComponent = React.FC<ModalMenuProps>;

const transition: Transition = {
    type: 'spring',
    stiffness: 120,
    bounce: 0,
    mass: 0.5,
};

const ModalMenu: ModalMenuComponent = ({
    isOpen,
    setIsOpen,
    children,
    className,
    whileOpenStyle,
    whileClosedStyle,
    ...restProps
}) => {
    const modalRef = useModalClose<HTMLDivElement>({
        isOpen,
        callback: () => setIsOpen(false),
    });

    const variants: Variants = {
        open: {
            scale: 1,
            height: 'auto',
            opacity: 1,
            ...whileOpenStyle,
        },
        closed: {
            scale: 0,
            height: 0,
            opacity: 0,
            ...whileClosedStyle,
        },
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    ref={modalRef}
                    className={twMerge(
                        'bg-secondaryBG text-mainText shadow-mainBG shadow-md overflow-visible z-40',
                        className
                    )}
                    transition={transition}
                    variants={variants}
                    exit="closed"
                    initial="closed"
                    animate="open"
                    {...restProps}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ModalMenu;
