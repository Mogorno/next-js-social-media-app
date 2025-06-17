import { motion, HTMLMotionProps } from 'motion/react';
import { CSSVariants as CreateCSSVariants } from '@/types/components/ui/CSSVariants';
import twVariantMerge from '@/helpers/twVariantMerge';
import { memo } from 'react';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';

export type StyleVariantKeys = 'secondary' | 'primary' | 'inner';
export type StatusVariantKeys = 'warning' | 'success' | 'danger' | 'pending';
export type SizeVariantKeys = 'sm' | 'md' | 'lg';
export type CSSVariants = CreateCSSVariants<
    StyleVariantKeys,
    StatusVariantKeys,
    SizeVariantKeys
>;

const cn = twVariantMerge<CSSVariants>({
    style: {
        primary: `bg-secondaryBG text-mainText border-secondaryBG outline-secondaryBG border-solid
                focus:shadow-mainBG
                hover:shadow-mainBG
                hover:border-primaryBG
                hover:drop-shadow-[0_0_4px_var(--primaryBG)]
                disabled:bg-primaryBG
                disabled:text-secondaryText
                disabled:shadow-mainBG`,
        secondary: `bg-transparent text-mainText outline-secondaryBG backdrop-blur-lg border-solid
                focus:shadow-none
                hover:shadow-none
                hover:drop-shadow-[0_0_4px_var(--secondaryBG)]
                disabled:bg-primaryBG
                disabled:text-secondaryText
                disabled:outline-none
                disabled:shadow-mainBG
                border-secondaryBG`,
        inner: `bg-innerBG text-innerText border-none
                focus:shadow-mainBG
                hover:drop-shadow-[0_0_4px_var(--innerBG)]
                disabled:bg-secondaryBG
                disabled:text-secondaryText
                disabled:shadow-mainBG`,
    },
    status: {
        danger: `enabled:outline-errorText
            enabled:border-errorText
            enabled:drop-shadow-[0_0_4px_var(--errorText)]
            enabled:focus:outline-errorText
            enabled:focus:shadow-errorText
            enabled:hover:shadow-errorText`,
        warning: `enabled:outline-warningText
            enabled:border-warningText
            enabled:drop-shadow-[0_0_4px_var(--warningText)]
            enabled:focus:outline-warningText
            enabled:focus:shadow-warningText
            enabled:hover:shadow-warningText`,
        success: `enabled:outline-successText
            enabled:border-successText
            enabled:drop-shadow-[0_0_4px_var(--successText)]
            enabled:focus:outline-successText
            enabled:focus:shadow-successText
            enabled:hover:shadow-successText`,
        pending: `animate-pulse`,
    },
    size: {
        sm: 'h-8 px-1 py-0 text-sm outline-1 outline-offset-2 border-2',
        md: 'h-10 px-2 py-1 text-md outline-2 outline-offset-2 border-2',
        lg: 'h-12 px-4 py-2 text-lg outline-2 outline-offset-4 border-2',
    },
});

type MotionLinkProps = NextLinkProps & HTMLMotionProps<'a'>;

export interface LinkProps extends MotionLinkProps {
    styleVariant?: StyleVariantKeys;
    statusVariant?: StatusVariantKeys;
    sizeVariant?: SizeVariantKeys;
}

export type LinkComponent = React.FC<LinkProps>;

const MotionLink = motion.create(NextLink);

const Link: LinkComponent = ({
    styleVariant,
    statusVariant,
    sizeVariant,
    className,
    ...restProps
}) => (
    <MotionLink
        className={cn(
            styleVariant,
            statusVariant,
            sizeVariant,
            `flex items-center justify-center rounded shadow-custom-inner transition-all w-full`,
            `hover:scale-105 
            active:scale-95 
            disabled:scale-100 
            disabled:pointer-events-none 
            disabled:border-none`,
            className
        )}
        {...restProps}
    />
);

export default memo(Link);
