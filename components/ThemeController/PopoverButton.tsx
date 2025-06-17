'use client';

import { motion, Variants } from 'framer-motion';

import { MdKeyboardDoubleArrowUp } from 'react-icons/md';

interface PopoverButton {
    isOpen: boolean;
    isRotateIcon: boolean;
    onClick: (e: React.MouseEvent<SVGAElement>) => void;
}

const PopoverButton = ({ isOpen, isRotateIcon, onClick }: PopoverButton) => {
    const variants: Variants = {
        open: {
            opacity: 1,
            x: '50%',
        },
        closed: {
            opacity: 0,
            x: '0%',
        },
    };

    return (
        <motion.div
            variants={variants}
            animate={isOpen ? 'open' : 'closed'}
            transition={{ type: 'spring', stiffness: 100 }}
            className="absolute top-0 left-0 w-full h-full bg-mainBG rounded-full flex justify-end overflow-hidden z-20"
        >
            <motion.div
                className="h-full aspect-square p-0.5"
                animate={{ rotate: isRotateIcon ? 180 : 0 }}
            >
                <MdKeyboardDoubleArrowUp
                    onClick={onClick}
                    className="h-full w-full hover:text-primaryText transition-colors cursor-pointer"
                />
            </motion.div>
        </motion.div>
    );
};

export default PopoverButton;
