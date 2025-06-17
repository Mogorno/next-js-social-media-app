'use client';

import { motion, MotionProps, Variants } from 'framer-motion';
import { memo } from 'react';
import twVariantMerge from '@/helpers/twVariantMerge';
import FlexMessageIcon from './FlexMessageIcon';
import {
    StyleVariantKeys,
    StatusVariantKeys,
    SizeVariantKeys,
    CSSVariants,
} from '.';

const cn = twVariantMerge<CSSVariants>({
    size: {
        sm: 'text-sm',
        md: 'text-md',
        lg: 'text-lg',
    },
});

type MotionLIProps = MotionProps & React.ComponentProps<'li'>;

export interface FlexMessageItemProps extends MotionLIProps {
    styleVariant?: StyleVariantKeys;
    statusVariant?: StatusVariantKeys;
    sizeVariant?: SizeVariantKeys;
    icon?: StatusVariantKeys | boolean;
}

export type FlexMessageItemComponent = React.FC<FlexMessageItemProps>;

const variants: Variants = {
    initial: {
        scale: 0,
        height: 0,
        opacity: 0,
        y: '-24px',
        x: '48px',
        rotate: 15,
    },
    animate: {
        scale: 1,
        height: 'auto',
        opacity: 1,
        y: '0px',
        x: '0px',
        rotate: 0,
    },
    exit: {
        scale: 0,
        height: 0,
        opacity: 0,
        y: '24px',
        x: '48px',
        rotate: -15,
    },
};

const FlexMessageItem: FlexMessageItemComponent = ({
    styleVariant,
    statusVariant,
    sizeVariant,
    className,
    children,
    icon,
    ...restProps
}) => {
    return (
        <motion.li
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            className={cn(
                styleVariant,
                statusVariant,
                sizeVariant,
                'w-full',
                className
            )}
            {...restProps}
        >
            {typeof children === 'string' ? (
                <>
                    <FlexMessageIcon
                        className="inline-block mr-1"
                        icon={icon}
                        statusVariant={statusVariant}
                    />
                    {children}
                </>
            ) : (
                children
            )}
        </motion.li>
    );
};

export default memo(FlexMessageItem);
