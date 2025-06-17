import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/prisma';
import authConfig from '@/auth.config';
import { getUserById } from '@/data/user/getUser';
import { AUTH_ERROR, LOGIN } from '@/routes';
import { getTwoFactoConfirmationByUserId } from './data/auth/twoFactorConfirmation';

// const sessionValues = ['id', 'name', 'email', 'image'] as const;
// const [, ...jwtValues] = sessionValues;

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: 'jwt' },
    secret: process.env.AUTH_SECRET,
    pages: {
        signIn: LOGIN.pathname,
        error: AUTH_ERROR.pathname,
    },
    events: {
        async linkAccount({ user }) {
            await prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    emailVerified: new Date(),
                },
            });
        },
    },
    callbacks: {
        jwt: async ({ token }) => {
            if (!token.sub) return token;

            const existingUser = await getUserById(token.sub);

            if (!existingUser) return token;

            token.role = existingUser.role;
            token.name = existingUser.name;
            token.picture = existingUser.image;
            //TODO: Add OAuth
            token.isOAuth = false;
            token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

            return token;
        },
        session: async ({ session, token }) => {
            if (session.user) {
                if (token.role) {
                    session.user.role = token.role;
                }
                if (token.sub) {
                    session.user.id = token.sub;
                }
                if (token.email) session.user.email = token.email;
                if (typeof token.isOAuth === 'boolean')
                    session.user.isOAuth = token.isOAuth;
                session.user.name = token.name;
                session.user.image = token.picture;
                session.user.isTwoFactorEnabled = token.isTwoFactorEnabled;
            }
            return session;
        },
        signIn: async ({ user, account }) => {
            if (account?.provider !== 'credentials') return true;

            if (typeof user.id !== 'string') return false;

            const existingUser = await getUserById(user.id);

            if (!existingUser) return false;

            if (!existingUser.emailVerified) return false;

            if (existingUser.isTwoFactorEnabled) {
                const twoFactorConformation =
                    await getTwoFactoConfirmationByUserId(existingUser.id);

                if (!twoFactorConformation) return false;

                await prisma.twoFactorConfirmation.delete({
                    where: {
                        id: twoFactorConformation.id,
                    },
                });
            }

            return true;
        },

        //     const existingUser = await prisma.user.findUnique({
        //         where: { email: user.email },
        //         include: { accounts: true },
        //     });

        //     if (existingUser) {
        //         const hasProvider = existingUser.accounts.some(
        //             (acc) => acc.provider === account.provider
        //         );

        //         if (!hasProvider) {
        //             await prisma.account.create({
        //                 data: {
        //                     userId: existingUser.id,
        //                     type: account.type,
        //                     provider: account.provider,
        //                     providerAccountId: account.providerAccountId,
        //                     access_token: account.access_token,
        //                     refresh_token: account.refresh_token,
        //                 },
        //             });
        //         }
        //     }

        //     return true;
        // },
    },

    ...authConfig,
});
