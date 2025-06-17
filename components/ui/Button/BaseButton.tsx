import { memo, useMemo } from 'react';
import Link, { LinkProps } from 'next/link';
import { HTMLMotionProps, motion } from 'motion/react';
import { CSSVariants as CreateCSSVariants } from '@/types/components/ui/CSSVariants';
import twVariantMerge from '@/helpers/twVariantMerge';
import ConditionIcon, {
    ConditionIconProps,
} from '@/components/ui/ConditionIcon';

export type StyleVariantKeys = 'secondary' | 'primary' | 'inner' | 'link';
export type StatusVariantKeys = 'warning' | 'success' | 'danger' | 'pending';
export type SizeVariantKeys = 'sm' | 'md' | 'lg';
export type CSSVariants = CreateCSSVariants<
    StyleVariantKeys,
    StatusVariantKeys,
    SizeVariantKeys
>;

type MotionButtonProps = HTMLMotionProps<'button'>;
type MotionLinkProps = LinkProps & HTMLMotionProps<'a'>;

const cnButton = twVariantMerge<CSSVariants>({
    style: {
        primary: `bg-secondaryBG text-mainText border-secondaryBG outline-secondaryBG border-solid w-full
                focus:shadow-mainBG
                hover:shadow-mainBG
                hover:border-primaryBG
                hover:drop-shadow-[0_0_4px_var(--primaryBG)]
                disabled:bg-primaryBG
                disabled:text-secondaryText
                disabled:shadow-mainBG`,
        secondary: `bg-transparent text-mainText outline-secondaryBG backdrop-blur-lg border-solid w-full
                focus:shadow-none
                hover:shadow-none
                hover:drop-shadow-[0_0_4px_var(--secondaryBG)]
                disabled:bg-primaryBG
                disabled:text-secondaryText
                disabled:outline-none
                disabled:shadow-mainBG
                border-secondaryBG`,
        inner: `bg-innerBG text-innerText border-none w-full
                focus:shadow-mainBG
                hover:drop-shadow-[0_0_4px_var(--innerBG)]
                disabled:bg-secondaryBG
                disabled:text-secondaryText
                disabled:shadow-mainBG`,
        link: ` bg-transparent text-mainText outline-none border-none relative w-auto
                hover:text-secondaryText 
                after:transition-all 
                after:bottom-0 
                after:inset-x-0 
                after:w-full 
                after:h-[calc(100%/10)]
                after:rounded-full 
                after:bg-current 
                after:origin-center 
                after:scale-x-0 
                after:absolute 
                hover:after:scale-x-100`,
    },
    status: {
        danger: `
            enabled:text-errorText
            enabled:outline-errorText
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

const cnIcon = twVariantMerge<CSSVariants>({
    size: {
        sm: 'mr-2',
        md: 'mr-2',
        lg: 'mr-4',
    },
});

interface CommonProps {
    styleVariant?: StyleVariantKeys;
    statusVariant?: StatusVariantKeys;
    sizeVariant?: SizeVariantKeys;
    Icon?: ConditionIconProps['Icons'];
    iconProps?: ConditionIconProps;
}

export type BaseButtonProps = (MotionButtonProps | MotionLinkProps) &
    CommonProps;

type BaseButtonComponent = React.FC<BaseButtonProps>;

const MotionLink = motion.create(Link);

const BaseButton: BaseButtonComponent = ({
    styleVariant,
    statusVariant,
    sizeVariant,
    className,
    Icon,
    iconProps,
    children,
    ...restProps
}) => {
    const content = useMemo(() => {
        const { className, ...restIconProps } = iconProps || {};
        return (
            <>
                <ConditionIcon
                    Icons={Icon}
                    className={cnIcon(
                        styleVariant,
                        statusVariant,
                        sizeVariant,
                        'inline-block',
                        className
                    )}
                    {...restIconProps}
                />
                {children}
            </>
        );
    }, [styleVariant, statusVariant, sizeVariant, iconProps, children, Icon]);

    const classNameValue = useMemo(
        () =>
            cnButton(
                styleVariant,
                statusVariant,
                sizeVariant,
                `flex items-center justify-center rounded shadow-custom-inner transition-all`,
                `hover:scale-105 
                     active:scale-95 
                     disabled:scale-100 
                     disabled:pointer-events-none 
                     disabled:border-none`,
                className
            ),
        [styleVariant, statusVariant, sizeVariant, className]
    );

    if ('href' in restProps)
        return (
            <MotionLink className={classNameValue} {...restProps}>
                {content}
            </MotionLink>
        );
    return (
        <motion.button className={classNameValue} {...restProps}>
            {content}
        </motion.button>
    );
};

export default memo(BaseButton);
