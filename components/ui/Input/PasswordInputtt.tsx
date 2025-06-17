'use client';

import { memo, use, useMemo, useState } from 'react';
import {
    IoEye,
    IoEyeOff,
    IoEyeOutline,
    IoEyeOffOutline,
} from 'react-icons/io5';
import ConditionIcon, {
    ConditionIconProps,
} from '@/components/ui/ConditionIcon';
import TextInput, { TextInputProps } from './TextInput';
import { CSSVariants } from './BaseInput';
import twVariantMerge from '@/helpers/twVariantMerge';

const cnInput = twVariantMerge<CSSVariants>({
    size: {
        sm: 'pr-[calc(2em+4px)]',
        md: 'pr-[calc(2em+8px)]',
        lg: 'pr-[calc(2em+16px)]',
    },
});

const cnIcon = twVariantMerge<CSSVariants>({
    style: {
        primary: `text-secondaryText peer-focus:text-mainText
        hover:drop-shadow-[0_0_1px_var(--secondaryText)]`,
        secondary: `text-secondaryText peer-focus:text-mainText
        hover:drop-shadow-[0_0_1px_var(--secondaryText)]`,
        inner: `text-mainText peer-focus:text-mainText
        hover:drop-shadow-[0_0_2px_var(--mainText)]`,
    },
    status: {
        danger: `peer-enabled:text-errorText peer-enabled:peer-focus:text-errorText
        hover:drop-shadow-[0_0px_4px_var(--errorText)]`,
        warning: `peer-enabled:text-warningText peer-enabled:peer-focus:text-warningText
        hover:drop-shadow-[0_0px_4px_var(--warningText)]`,
        success: `peer-enabled:text-successText peer-enabled:peer-focus:text-successText
        hover:drop-shadow-[0_0px_4px_var(--successText)]`,
    },
    size: {
        sm: 'text-md right-2',
        md: 'text-lg right-3',
        lg: 'text-xl right-4',
    },
});

export interface PasswordInputProps extends TextInputProps {
    iconProps?: Partial<ConditionIconProps>;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
    type,
    children,
    className,
    iconProps,
    ...restProps
}) => {
    if (type !== 'password')
        throw new Error('PasswordInput only accepts type password');

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isHoverIcon, setIsHoverIcon] = useState(false);

    const { styleVariant, statusVariant, sizeVariant, disabled } = restProps;

    const conditionIconProps: ConditionIconProps = useMemo(() => {
        const {
            onClick,
            onMouseEnter,
            onMouseLeave,
            renderIndex,
            Icons,
            className: iconClassName,
            ...restIconProps
        } = iconProps ?? {};

        return {
            onMouseEnter: (e) => {
                if (typeof onMouseEnter === 'function') {
                    onMouseEnter(e);
                }
                setIsHoverIcon(true);
            },
            onMouseLeave: (e) => {
                if (typeof onMouseLeave === 'function') {
                    onMouseLeave(e);
                }
                setIsHoverIcon(false);
            },
            onClick: (e) => {
                if (typeof onClick === 'function') {
                    onClick(e);
                }
                setIsPasswordVisible((prev) => !prev);
            },
            Icons: Icons ?? [IoEyeOffOutline, IoEyeOutline, IoEyeOff, IoEye],
            renderIndex:
                renderIndex ??
                Number(isPasswordVisible) + Number(isHoverIcon) * 2,
            className: cnIcon(
                styleVariant,
                statusVariant,
                sizeVariant,
                `absolute top-1/2 -translate-y-1/2 transition-all cursor-pointer
                opacity-100 peer-focus:opacity-100 peer-placeholder-shown:opacity-0 peer-disabled:opacity-0
                scale-100   peer-focus:scale-100   peer-placeholder-shown:scale-0   peer-disabled:scale-0   active:scale-90 hover:scale-110`,
                iconClassName
            ),
            ...restIconProps,
        };
    }, [
        iconProps,
        isHoverIcon,
        isPasswordVisible,
        styleVariant,
        statusVariant,
        sizeVariant,
    ]);
    console.log(`Password-Input`);
    return (
        <TextInput
            className={cnInput(
                styleVariant,
                statusVariant,
                sizeVariant,
                className
            )}
            type={isPasswordVisible && !disabled ? 'text' : 'password'}
            {...restProps}
        >
            {useMemo(
                () => (
                    <ConditionIcon {...conditionIconProps} />
                ),
                [conditionIconProps]
            )}
            {children}
        </TextInput>
    );
};

export default memo(PasswordInput);
