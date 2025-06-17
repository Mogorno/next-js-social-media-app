import { AuthError } from 'next-auth';

type CustomAuthErrorOptions = Partial<AuthError>;

export default class CustomAuthError extends AuthError {
    constructor(options?: CustomAuthErrorOptions) {
        const { name, type, message } = options ?? {};
        super(options);
        if (type) this.type = type;
        this.name = name ?? 'CustomAuthError';
        this.message = message ?? 'Something went wrong';
    }
}
