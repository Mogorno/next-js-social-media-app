import { memo } from 'react';
import {
    CSSVariants,
    SizeVariantKeys,
    StatusVariantKeys,
    StyleVariantKeys,
} from '../BaseInput';
import twVariantMerge from '@/helpers/twVariantMerge';
import ConditionIcon, { ConditionIconProps } from '../../ConditionIcon';

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

export interface FloatingLabelProps extends React.ComponentProps<'label'> {
    styleVariant?: StyleVariantKeys;
    statusVariant?: StatusVariantKeys;
    sizeVariant?: SizeVariantKeys;
    Icon?: ConditionIconProps['Icons'];
    iconProps?: ConditionIconProps;
}

export type FloatingLabelComponent = React.FC<FloatingLabelProps>;

const FloatingLabel: FloatingLabelComponent = ({
    className,
    styleVariant,
    statusVariant,
    sizeVariant,
    Icon,
    iconProps,
    children,
    ...restProps
}) => {
    return (
        <label
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
                className
            )}
            {...restProps}
        >
            <ConditionIcon Icons={Icon} {...iconProps} />
            {children}
        </label>
    );
};

export default memo(FloatingLabel);
