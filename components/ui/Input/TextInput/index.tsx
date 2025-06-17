'use client';

import BaseInput, { BaseInputProps, CSSVariants } from '../BaseInput';
import { twMerge } from 'tailwind-merge';
import twVariantMerge from '@/helpers/twVariantMerge';
import { memo, useId } from 'react';
import FloatingLabel, { FloatingLabelProps } from './FloatingLabel';

const cnInput = twVariantMerge<CSSVariants>({
    style: {
        primary: `hover:outline-secondaryBG 
                    focus:outline-secondaryBG`,
        secondary: ``,
        inner: `hover:outline-innerBG
                focus:outline-innerBG`,
    },
    status: {
        danger: `   enabled:hover:outline-errorText
                    enabled:focus:outline-errorText`,
        warning: `  enabled:hover:outline-warningText
                    enabled:focus:outline-warningText`,
        success: `  enabled:hover:outline-successText
                    enabled:focus:outline-successText`,
    },
    size: {
        sm: 'placeholder-shown:outline-offset-2',
        md: 'placeholder-shown:outline-offset-2',
        lg: 'placeholder-shown:outline-offset-4',
    },
});

export interface TextInputProps extends BaseInputProps {
    containerProps?: React.ComponentProps<'div'>;
    labelProps?: FloatingLabelProps;
    label?: React.ReactNode;
    children?: React.ReactNode;
    Icon?: FloatingLabelProps['Icon'];
}

const TextInput: React.FC<TextInputProps> = ({
    className,
    children,
    label,
    Icon,
    containerProps,
    labelProps,
    ...restProps
}) => {
    const id = useId();
    const { styleVariant, statusVariant, sizeVariant, placeholder } = restProps;

    return (
        <div
            {...containerProps}
            className={twMerge('relative w-full', containerProps?.className)}
        >
            <BaseInput
                id={id}
                className={cnInput(
                    styleVariant,
                    statusVariant,
                    sizeVariant,
                    'peer outline-offset-0 active:outline-offset-0 placeholder:opacity-0',
                    className
                )}
                {...restProps}
            />
            <FloatingLabel
                styleVariant={styleVariant}
                statusVariant={statusVariant}
                sizeVariant={sizeVariant}
                Icon={Icon}
                htmlFor={id}
                {...labelProps}
            >
                {label ?? placeholder ?? 'Label'}
            </FloatingLabel>
            {children}
        </div>
    );
};

export default memo(TextInput);
