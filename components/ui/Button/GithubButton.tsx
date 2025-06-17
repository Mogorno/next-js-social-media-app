import BaseButton, {
    BaseButtonProps,
    CSSVariants,
    StyleVariantKeys,
} from './BaseButton';
import twVariantMerge from '@/helpers/twVariantMerge';
import { useTheme } from '@/context/ThemeContext';
import { IoLogoGithub } from 'react-icons/io5';
import { memo } from 'react';

export type GithubButtonProps = BaseButtonProps;
export type GithubButtonComponent = React.FC<GithubButtonProps>;

const cn = twVariantMerge<CSSVariants>({
    style: {
        primary: `bg-[#171516] text-[#E3E3E3] border border-[#747775]
                focus:shadow-[#747775]
                hover:shadow-[#747775]
                hover:border-[#747775]
                hover:drop-shadow-[0_0_4px_#747775]
                disabled:bg-[#171516]
                disabled:text-[#E3E3E3]
                disabled:shadow-none`,
        secondary: `bg-[#FFFFFF] text-[#171516] border border-[#8E918F]
                focus:shadow-[#8E918F]
                hover:shadow-[#8E918F]
                hover:border-[#8E918F]
                hover:drop-shadow-[0_0_4px_#8E918F]
                disabled:bg-[#FFFFFF]
                disabled:text-[#171516]
                disabled:shadow-none`,
        inner: `bg-[#F2F2F2] text-[#1F1F1F] border-none
                focus:shadow-[#1F1F1F]
                hover:shadow-[#1F1F1F]
                hover:border-none
                hover:drop-shadow-[0_0_4px_#1F1F1F]
                disabled:bg-[#F2F2F2]
                disabled:text-[#1F1F1F]
                disabled:shadow-[#1F1F1F]`,
        link: ` bg-transparent text-mainText outline-none border-none w-auto`,
    },
    size: {
        sm: 'gap-1 p-1',
        md: 'gap-2',
        lg: 'gap-4',
    },
});

const GithubButton: GithubButtonComponent = ({
    children,
    className,
    ...restProps
}) => {
    const { theme } = useTheme();
    let defaultStyleVariant: StyleVariantKeys = 'inner';
    if (theme === 'dark') defaultStyleVariant = 'secondary';
    if (theme === 'light') defaultStyleVariant = 'primary';

    const {
        styleVariant = defaultStyleVariant,
        statusVariant,
        sizeVariant,
    } = restProps;

    return (
        <BaseButton
            Icon={IoLogoGithub}
            iconProps={{
                className: `h-full w-auto aspect-square ${statusVariant === 'pending' && 'animate-ping'}`,
            }}
            name="provider"
            value="github"
            className={cn(
                styleVariant ?? defaultStyleVariant,
                statusVariant,
                sizeVariant,
                `relative`,
                className
            )}
            {...restProps}
        >
            {children ? (
                children
            ) : (
                <span>
                    Sign in with <b>GitHub</b>
                </span>
            )}
        </BaseButton>
    );
};

export default memo(GithubButton);
