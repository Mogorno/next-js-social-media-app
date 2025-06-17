'use client';

import { memo, useCallback, useState } from 'react';
import {
    IoEye,
    IoEyeOff,
    IoEyeOutline,
    IoEyeOffOutline,
} from 'react-icons/io5';
import ConditionIcon, {
    ConditionIconProps,
} from '@/components/ui/ConditionIcon';
import { CSSVariants } from '../BaseInput';
import twVariantMerge from '@/helpers/twVariantMerge';
import {
    SizeVariantKeys,
    StatusVariantKeys,
    StyleVariantKeys,
} from '../BaseInput';

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

export interface EyeIconProps extends Omit<ConditionIconProps, 'Icons'> {
    styleVariant?: StyleVariantKeys;
    statusVariant?: StatusVariantKeys;
    sizeVariant?: SizeVariantKeys;
    isVisible: boolean;
    Icons?: ConditionIconProps['Icons'];
}

export type EyeIconComponent = React.FC<EyeIconProps>;

const EyeIcon: EyeIconComponent = ({
    onMouseEnter,
    onMouseLeave,
    isVisible,
    renderIndex,
    Icons,
    styleVariant,
    statusVariant,
    sizeVariant,
    className,
    ...restProps
}) => {
    const [isHover, setIsHover] = useState(false);

    const handleOnMouseEnter = useCallback(
        (e: React.MouseEvent<SVGElement>) => {
            if (typeof onMouseEnter === 'function') {
                onMouseEnter(e);
            }
            setIsHover(true);
        },
        [onMouseEnter]
    );

    const handleOnMouseLeave = useCallback(
        (e: React.MouseEvent<SVGElement>) => {
            if (typeof onMouseLeave === 'function') {
                onMouseLeave(e);
            }
            setIsHover(false);
        },
        [onMouseLeave]
    );
    return (
        <ConditionIcon
            renderIndex={renderIndex ?? Number(isVisible) + Number(isHover) * 2}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
            Icons={Icons ?? [IoEyeOffOutline, IoEyeOutline, IoEyeOff, IoEye]}
            className={cnIcon(
                styleVariant,
                statusVariant,
                sizeVariant,
                `absolute top-1/2 -translate-y-1/2 transition-all cursor-pointer
            opacity-100 peer-focus:opacity-100 peer-placeholder-shown:opacity-0 peer-disabled:opacity-0
            scale-100   peer-focus:scale-100   peer-placeholder-shown:scale-0   peer-disabled:scale-0   active:scale-90 hover:scale-110`,
                className
            )}
            {...restProps}
        />
    );
};

export default memo(EyeIcon);
