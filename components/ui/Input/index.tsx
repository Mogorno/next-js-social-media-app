import TextInput, { TextInputProps } from './TextInput';
import PasswordInput, { PasswordInputProps } from './PasswordInput';
import BaseInput, { BaseInputProps } from './BaseInput';
import { memo } from 'react';

export type InputProps =
    | (TextInputProps & { type: 'text' | 'email' })
    | (PasswordInputProps & { type: 'password' })
    | (BaseInputProps & { type?: string });

const Input: React.FC<InputProps> = (props) => {
    if (props.type === 'password') {
        return <PasswordInput {...props} />;
    }
    if (['text', 'email', 'undefined'].includes(`${props.type}`)) {
        return <TextInput {...props} />;
    }
    return <BaseInput {...props} />;
};

export default memo(Input);
