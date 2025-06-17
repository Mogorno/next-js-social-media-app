import { memo } from 'react';
import { IconType, IconBaseProps } from 'react-icons';

export interface ConditionIconProps extends IconBaseProps {
    Icons?: IconType | IconType[] | undefined | null | false;
    renderIndex?: number | undefined | null | boolean | string;
}

type ConditionIconComponent = React.FC<ConditionIconProps>;

const ConditionIcon: ConditionIconComponent = ({
    Icons,
    renderIndex = 0,
    ...restProps
}) => {
    if (!Icons) return null;

    const index = Number(renderIndex);

    if (Number.isNaN(index)) return null;

    const Icon = Array.isArray(Icons) ? Icons[index] : Icons;

    if (!Icon || typeof Icon !== 'function') return null;

    return <Icon {...restProps} />;
};

export default memo(ConditionIcon);
