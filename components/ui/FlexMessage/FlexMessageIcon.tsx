import { memo } from 'react';
import ConditionIcon, { ConditionIconProps } from '../ConditionIcon';
import {
    IoCheckmarkCircle,
    IoInformationCircle,
    IoWarning,
} from 'react-icons/io5';
import { StatusVariantKeys } from './';

export interface FlexMessageIconProps
    extends Omit<ConditionIconProps, 'renderIndex' | 'Icons'> {
    icon?: StatusVariantKeys | boolean;
    statusVariant?: StatusVariantKeys;
}

export type FlexMessageIconComponent = React.FC<FlexMessageIconProps>;

const FlexMessageIcon: FlexMessageIconComponent = ({
    icon,
    statusVariant,
    ...restProps
}) => {
    if (!icon || !statusVariant) return null;
    const variantsArray = ['warning', 'danger', 'success', 'info'];
    let renderIndex = 0;
    if (typeof icon === 'string' && variantsArray.includes(icon)) {
        renderIndex = variantsArray.indexOf(icon);
    } else {
        renderIndex = variantsArray.indexOf(statusVariant);
    }

    return (
        <ConditionIcon
            {...restProps}
            renderIndex={renderIndex}
            Icons={[
                IoWarning,
                IoWarning,
                IoCheckmarkCircle,
                IoInformationCircle,
            ]}
        />
    );
};

export default memo(FlexMessageIcon);
