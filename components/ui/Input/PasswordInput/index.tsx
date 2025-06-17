'use client';

import { memo, useCallback, useState } from 'react';
import twVariantMerge from '@/helpers/twVariantMerge';
import TextInput, { TextInputProps } from '../TextInput';
import { CSSVariants } from '../BaseInput';
import EyeIcon, { EyeIconProps } from './EyeIcon';

const cnInput = twVariantMerge<CSSVariants>({
    size: {
        sm: 'pr-[calc(2em+4px)]',
        md: 'pr-[calc(2em+8px)]',
        lg: 'pr-[calc(2em+16px)]',
    },
});

export interface PasswordInputProps extends TextInputProps {
    eyeIconProps?: Partial<EyeIconProps>;
}

export type PasswordInputComponent = React.FC<PasswordInputProps>;

const PasswordInput: PasswordInputComponent = ({
    type,
    children,
    className,
    eyeIconProps,
    ...restProps
}) => {
    if (type !== 'password')
        throw new Error('PasswordInput only accepts type password');

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const { styleVariant, statusVariant, sizeVariant, disabled } = restProps;

    const { onClick, ...restIconProps } = eyeIconProps ?? {};

    const handleOnClick = useCallback(
        (e: React.MouseEvent<SVGElement>) => {
            if (typeof onClick === 'function') {
                onClick(e);
            }
            setIsPasswordVisible((prev) => !prev);
        },
        [onClick, setIsPasswordVisible]
    );
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
            <EyeIcon
                isVisible={isPasswordVisible}
                onClick={handleOnClick}
                styleVariant={styleVariant}
                statusVariant={statusVariant}
                sizeVariant={sizeVariant}
                {...restIconProps}
            />
            {children}
        </TextInput>
    );
};

export default memo(PasswordInput);
