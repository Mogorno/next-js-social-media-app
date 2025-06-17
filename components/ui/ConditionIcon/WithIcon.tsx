import { IconType, IconBaseProps } from 'react-icons';
import { twMerge } from 'tailwind-merge';

interface WithIconProps {
    Icon?: IconType;
    iconProps?: IconBaseProps;
}

type WithIconComponent = React.FC<WithIconProps>;

const WithIcon: WithIconComponent = ({ Icon, iconProps, children }) => {
    if (!children) return null;
    if (!Icon) return children;
    const { className, ...restIconProps } = iconProps || {};
    return (
        <>
            <Icon
                className={twMerge('inline-block', className)}
                {...restIconProps}
            />
            {children}
        </>
    );
};

export default WithIcon;
