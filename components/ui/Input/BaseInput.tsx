import { CSSVariants as CreateCSSVariants } from '@/types/components/ui/CSSVariants';
import twVariantMerge from '@/helpers/twVariantMerge';
import { memo } from 'react';

export type StyleVariantKeys = 'secondary' | 'primary' | 'inner';
export type StatusVariantKeys = 'warning' | 'success' | 'danger';
export type SizeVariantKeys = 'sm' | 'md' | 'lg';
export type CSSVariants = CreateCSSVariants<
    StyleVariantKeys,
    StatusVariantKeys,
    SizeVariantKeys
>;

const cn = twVariantMerge<CSSVariants>({
    style: {
        primary: `bg-secondaryBG text-mainText
                focus:shadow-mainBG
                hover:shadow-mainBG 
                placeholder:text-secondaryText
                disabled:bg-primaryBG 
                disabled:text-secondaryText
                disabled:shadow-mainBG`,
        secondary: `bg-transparent text-mainText outline-secondaryBG
                focus:shadow-none
                hover:shadow-none
                placeholder:text-secondaryText
                disabled:bg-secondaryBG 
                disabled:text-secondaryText
                disabled:outline-none 
                disabled:shadow-mainBG`,
        inner: `bg-innerBG text-innerText 
                focus:shadow-mainBG
                hover:shadow-mainBG 
                placeholder:text-mainText
                disabled:bg-secondaryBG 
                disabled:text-secondaryText
                disabled:shadow-mainBG`,
    },
    status: {
        danger: `enabled:outline-errorText 
            enabled:focus:outline-errorText 
            enabled:focus:shadow-errorText
            enabled:hover:shadow-errorText
            enabled:placeholder:text-errorText`,
        warning: `enabled:outline-warningText
            enabled:focus:outline-warningText 
            enabled:focus:shadow-warningText 
            enabled:hover:shadow-warningText`,
        success: `enabled:outline-successText 
            enabled:focus:outline-successText 
            enabled:focus:shadow-successText
            enabled:hover:shadow-successText 
            enabled:placeholder:text-successText`,
    },
    size: {
        sm: 'h-8 p-1 text-sm outline-1 outline-offset-2',
        md: 'h-10 p-2 text-md outline-2 outline-offset-2',
        lg: 'h-12 p-4 text-lg outline-2 outline-offset-4',
    },
});

export interface BaseInputProps extends React.ComponentProps<'input'> {
    styleVariant?: StyleVariantKeys;
    statusVariant?: StatusVariantKeys;
    sizeVariant?: SizeVariantKeys;
}

const BaseInput: React.FC<BaseInputProps> = ({
    styleVariant,
    statusVariant,
    sizeVariant,
    className,
    ...props
}) => {
    return (
        <input
            className={cn(
                styleVariant,
                statusVariant,
                sizeVariant,
                `rounded shadow-custom-inner outline-none transition-all w-full 
                focus:shadow-transparent 
                hover:opacity-85 
                focus:opacity-100 
                disabled:pointer-events-none
                placeholder-shown:text-ellipsis
                `,
                className
            )}
            {...props}
        />
    );
};

export default memo(BaseInput);
