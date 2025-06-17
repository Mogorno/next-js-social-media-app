import BaseInput, { BaseInputProps, CSSVariants } from './BaseInput';
import { twMerge } from 'tailwind-merge';
import twVariantMerge from '@/helpers/twVariantMerge';
import { memo } from 'react';

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

const cnLabel = twVariantMerge<CSSVariants>({
    style: {
        primary: `text-secondaryText peer-focus:text-mainText`,
        secondary: `text-secondaryText peer-focus:text-mainText`,
        inner: `text-mainText peer-focus:text-mainText`,
    },
    status: {
        danger: `peer-enabled:text-errorText peer-enabled:peer-focus:text-errorText`,
        warning: `peer-enabled:text-warningText peer-enabled:peer-focus:text-warningText`,
        success: `peer-enabled:text-successText peer-enabled:peer-focus:text-successText`,
    },
    size: {
        sm: 'px-0.5 left-0.5 text-sm max-w-[calc(100%-4px)]',
        md: 'px-1 left-1 text-md max-w-[calc(100%-8px)]',
        lg: 'px-1 left-1 text-lg max-w-[calc(100%-8px)]',
    },
});

export interface TextInputProps extends BaseInputProps {
    containerProps?: React.ComponentProps<'div'>;
    labelProps?: React.ComponentProps<'label'>;
    label?: React.ReactNode;
    children?: React.ReactNode;
}

const TextInput: React.FC<TextInputProps> = ({
    className,
    id,
    children,
    label,
    containerProps,
    labelProps,
    ...restProps
}) => {
    const { styleVariant, statusVariant, sizeVariant, placeholder } = restProps;

    const { className: containerClassName, ...restContainerProps } =
        containerProps ?? {};
    const {
        className: labelClassName,
        htmlFor,
        ...restLabelProps
    } = labelProps ?? {};

    const inputId = id ? id : placeholder;
    console.log(restProps.type?.toUpperCase());
    return (
        <div
            className={twMerge('relative w-full', containerClassName)}
            {...restContainerProps}
        >
            <BaseInput
                id={inputId}
                className={cnInput(
                    styleVariant,
                    statusVariant,
                    sizeVariant,
                    'peer outline-offset-0 active:outline-offset-0 placeholder:opacity-0',
                    className
                )}
                {...restProps}
            />
            <label
                htmlFor={htmlFor || inputId}
                className={cnLabel(
                    styleVariant,
                    statusVariant,
                    sizeVariant,
                    `rounded-sm text-nowrap text-ellipsis overflow-hidden z-10 peer-disabled:pointer-events-none
                    absolute origin-left duration-300 transform flex gap-2 justify-center items-center
                    top-0              peer-focus:top-0              peer-placeholder-shown:top-1/2
                    -translate-y-[65%] peer-focus:-translate-y-[70%] peer-placeholder-shown:-translate-y-1/2 
                    scale-[80%]        peer-focus:scale-[85%]        peer-placeholder-shown:scale-100
                    backdrop-blur-sm   peer-focus:backdrop-blur-sm   peer-placeholder-shown:backdrop-blur-none`,
                    labelClassName
                )}
                {...restLabelProps}
            >
                {label ?? placeholder ?? 'Label'}
            </label>
            {children}
        </div>
    );
};

export default memo(TextInput);
