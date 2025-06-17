import GithubButton, { GithubButtonProps } from './GithubButton';
import GoogleButton, { GoogleButtonProps } from './GoogleButton';
import BaseButton, { BaseButtonProps } from './BaseButton';
import { memo } from 'react';

type ButtonProps =
    | (GoogleButtonProps & { provider: 'google' })
    | (GithubButtonProps & { provider: 'github' })
    | (BaseButtonProps & { provider?: string | undefined | boolean | null });

export type ButtonComponent = React.FC<ButtonProps>;

const Button: ButtonComponent = ({ provider, ...restProps }) => {
    if (provider === 'google') {
        return <GoogleButton {...restProps} />;
    }
    if (provider === 'github') {
        return <GithubButton {...restProps} />;
    }
    return <BaseButton {...restProps} />;
};

export default memo(Button);
