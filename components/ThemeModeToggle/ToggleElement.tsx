'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { IconType } from 'react-icons';

interface ToggleElementProps {
    Icon: IconType;
    isSelected: boolean;
    isFirst: boolean;
    layoutId?: string;
    title?: string;
    onDragAction: (...args: any) => any;
}

const ToggleElement = ({
    Icon,
    isSelected,
    isFirst,
    onDragAction,
    layoutId,
}: ToggleElementProps) => {
    if (!isSelected) return null;

    const spring = {
        type: 'spring',
        stiffness: 1000,
        damping: 300,
    };

    const handleOnDragAction: HTMLMotionProps<'div'>['onDragEnd'] = (
        events,
        info
    ) => {
        if (isFirst && info.offset.x > 60) {
            onDragAction();
        } else if (!isFirst && info.offset.x < -60) {
            onDragAction();
        }
    };

    return (
        <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleOnDragAction}
            dragElastic={0.2}
            layoutId={layoutId}
            className="absolute inset-0 bg-primaryBG rounded-full z-10 cursor-grab"
        >
            <motion.div
                className="w-full h-full p-[1px]"
                transition={spring}
                initial={{ rotate: isFirst ? 360 : 0 }}
                animate={{ rotate: isFirst ? 0 : 360 }}
            >
                <Icon className="w-full h-full" />
            </motion.div>
        </motion.div>
    );
};

export default ToggleElement;
