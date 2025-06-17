'use client';

import { AnimatePresence, motion, MotionProps } from 'framer-motion';
import { isValidElement, memo } from 'react';
import { CSSVariants as CreateCSSVariants } from '@/types/components/ui/CSSVariants';
import twVariantMerge from '@/helpers/twVariantMerge';
import FlexMessageItem, { FlexMessageItemProps } from './FlexMessageItem';

export type StyleVariantKeys = 'secondary' | 'primary' | 'inner';
export type StatusVariantKeys = 'warning' | 'success' | 'danger' | 'info';
export type SizeVariantKeys = 'sm' | 'md' | 'lg';

export type CSSVariants = CreateCSSVariants<
    StyleVariantKeys,
    StatusVariantKeys,
    SizeVariantKeys
>;

const cn = twVariantMerge<CSSVariants>({
    style: {
        primary: `text-secondaryText`,
        secondary: `text-mainText`,
        inner: `text-innerText`,
    },
    status: {
        danger: `text-errorText`,
        info: `text-secondaryText`,
        warning: `text-warningText`,
        success: `text-successText`,
    },
    size: {
        sm: 'text-sm',
        md: 'text-md',
        lg: 'text-lg',
    },
});

type MotionULProps = Omit<MotionProps & React.ComponentProps<'ul'>, 'children'>;

export interface FlexMessageProps extends MotionULProps {
    styleVariant?: StyleVariantKeys;
    statusVariant?: StatusVariantKeys;
    sizeVariant?: SizeVariantKeys;
    isVisible?: boolean | 0 | string | null;
    icon?: StatusVariantKeys | boolean;
    messages?: string | React.ReactNode | Array<string | React.ReactNode>;
    itemProps?: FlexMessageItemProps;
}

type FlexMessageComponent = React.FC<FlexMessageProps>;

const FlexMessage: FlexMessageComponent = ({
    styleVariant,
    statusVariant,
    sizeVariant,
    isVisible = true,
    icon = true,
    messages,
    itemProps,
    className,
    ...restProps
}) => {
    let messagesList: (string | React.ReactNode)[] = [];

    if (typeof messages === 'string' || isValidElement(messages)) {
        messagesList.push(messages);
    } else if (Array.isArray(messages)) {
        messagesList = messages;
    }
    const isVisibleCondition = isVisible && messagesList.length > 0;

    return (
        <AnimatePresence>
            {isVisibleCondition && (
                <motion.ul
                    key={`${styleVariant} ${statusVariant} ${sizeVariant}`}
                    className={cn(
                        styleVariant,
                        statusVariant,
                        sizeVariant,
                        className
                    )}
                    {...restProps}
                >
                    <AnimatePresence propagate>
                        {messagesList.map((message, index) => (
                            <FlexMessageItem
                                key={`flex-message-${index} ${message?.toString()}`}
                                styleVariant={styleVariant}
                                statusVariant={statusVariant}
                                sizeVariant={sizeVariant}
                                icon={icon}
                                {...itemProps}
                            >
                                {message}
                            </FlexMessageItem>
                        ))}
                    </AnimatePresence>
                </motion.ul>
            )}
        </AnimatePresence>
    );
};

export default memo(FlexMessage);
