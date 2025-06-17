import twVariantMerge from '@/helpers/twVariantMerge';
import { CSSVariants as CreateCSSVariants } from '@/types/components/ui/CSSVariants';
import { motion, HTMLMotionProps, Variants, Transition } from 'motion/react';
import { IconBaseProps, IconType } from 'react-icons';
import { twMerge } from 'tailwind-merge';

type StyleVariantKeys = 'primary' | 'secondary' | 'inner';
type StatusVariantKeys = 'danger' | 'warning' | 'success' | 'info';
type SizeVariantKeys = 'sm' | 'md' | 'lg';

type CSSVariants = CreateCSSVariants<
    StyleVariantKeys,
    StatusVariantKeys,
    SizeVariantKeys
>;

const twVariants: CSSVariants = {
    style: {
        primary: `text-primaryText from-primaryBG via-primaryBG to-primaryBG`,
        secondary: `text-secondaryText from-secondaryBG via-secondaryBG to-secondaryBG`,
        inner: `text-innerText from-innerBG via-innerBG to-innerBG`,
    },
    status: {
        danger: `text-errorText to-errorText`,
        warning: `text-warningText to-warningText`,
        success: `text-successText to-successText`,
        info: `text-secondaryText to-secondaryBG`,
    },
    size: {
        sm: 'text-xs',
        md: 'text-md',
        lg: 'text-lg',
    },
};

const twDiv = twVariantMerge<CSSVariants>(twVariants);

interface SearchMessageProps extends HTMLMotionProps<'div'> {
    styleVariant?: StyleVariantKeys;
    statusVariant?: StatusVariantKeys;
    sizeVariant?: SizeVariantKeys;
    Icon?: IconType;
    children?: React.ReactNode;
    spanClassName?: React.ComponentProps<'span'>['className'];
    spanProps?: Omit<React.ComponentProps<'span'>, 'className'>;
    iconClassName?: IconBaseProps['className'];
    iconProps?: Omit<IconBaseProps, 'className'>;
    isPending?: boolean;
}

const motionVariants: Variants = {
    open: { scaleY: 1, opacity: 1, y: 0 },
    closed: { scaleY: 0, opacity: 0, y: -40 },
};

const transition: Transition = {
    ease: 'easeInOut',
    duration: 0.5,
};

const SearchMessage = ({
    styleVariant,
    statusVariant,
    sizeVariant,
    className,
    Icon,
    children,
    spanProps,
    spanClassName,
    iconProps,
    iconClassName,
    isPending,
    ...restProps
}: SearchMessageProps) => {
    return (
        <motion.div
            variants={motionVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={transition}
            className={twDiv(
                styleVariant,
                statusVariant,
                sizeVariant,
                `absolute w-full overflow-hidden rounded left-0  
                bg-gradient-to-t top-[calc(100%-0.5rem)]`,
                className
            )}
            {...restProps}
        >
            <span
                className={twMerge(
                    'flex items-center justify-start pt-2 gap-2 w-full px-2 backdrop-blur',
                    isPending && 'animate-pulse',
                    spanClassName
                )}
                {...spanProps}
            >
                {Icon && (
                    <Icon
                        className={twMerge(
                            'inline-block',
                            isPending && 'animate-ping',
                            iconClassName
                        )}
                        {...iconProps}
                    />
                )}
                {children}
            </span>
        </motion.div>
    );
};

export default SearchMessage;
