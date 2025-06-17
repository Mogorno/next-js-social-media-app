import { User } from '@prisma/client';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            id: User['id'];
            role: User['role'];
            isTwoFactorEnabled: User['isTwoFactorEnabled'];
            isOAuth: boolean;
        } & DefaultSession['user'];
    }
}
