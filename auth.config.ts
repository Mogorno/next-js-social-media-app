import { NextAuthConfig } from 'next-auth';
import Github from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
// import CredentialsProvider from 'next-auth/providers/credentials';
import { getUserByEmail } from '@/data/user/getUser';
import { compare } from 'bcrypt-ts';
import LoginSchema from './helpers/Validation/LoginSchema';
import Credentials from 'next-auth/providers/credentials';
import CustomAuthError from '@/helpers/CustomAuthError';
import {
    generateTwoFactorToken,
    generateVerificationToken,
} from '@/helpers/tokens';
import { sendVerificationEmail } from './helpers/Resend/sendVerificationEmail';
import { sendTwoFactorEmail } from './helpers/Resend/sendTwoFactorEmail';
import { getTwoFactorTokenByIdentifier } from './data/auth/getTwoFactorToken';
import { prisma } from './prisma';
import { getTwoFactoConfirmationByUserId } from './data/auth/twoFactorConfirmation';
// <T extends z.inferFlattenedErrors<typeof FormData>['fieldErrors']>

export default {
    providers: [
        Github,
        Google,
        Credentials({
            name: 'Credentials',

            async authorize(credentials) {
                if (credentials.isNewAccount)
                    return getUserByEmail(credentials.email as string);
                const validation = LoginSchema.safeParse(credentials);

                if (!validation.success) {
                    throw new CustomAuthError({
                        type: 'CredentialsSignin',
                        name: 'Validation',
                        cause: { err: validation.error },
                    });
                }

                const { password, email, twoFactorCode } = validation.data;
                console.log(twoFactorCode);
                const existingUser = await getUserByEmail(email);

                if (
                    !existingUser ||
                    !existingUser.email ||
                    !existingUser.hashPassword
                )
                    return null;

                const isPasswordMatch = await compare(
                    password,
                    existingUser.hashPassword
                );

                if (!isPasswordMatch) return null;

                if (!existingUser.emailVerified) {
                    const verificationToken = await generateVerificationToken(
                        existingUser.email
                    );

                    await sendVerificationEmail(
                        verificationToken.identifier,
                        verificationToken.token
                    );

                    throw new CustomAuthError({
                        type: 'Verification',
                        name: 'Verification',
                        message: 'Email not verified',
                    });
                }

                if (existingUser.isTwoFactorEnabled && existingUser.email) {
                    if (twoFactorCode) {
                        const twoFactorToken =
                            await getTwoFactorTokenByIdentifier(
                                existingUser.email
                            );

                        if (
                            !twoFactorToken ||
                            twoFactorToken.token !== twoFactorCode
                        )
                            throw new CustomAuthError({
                                type: 'Verification',
                                name: 'TwoFactorVerificationError',
                                message: 'Invalid two factor code',
                            });

                        const hasExpired =
                            new Date(twoFactorToken.expires) < new Date();

                        if (hasExpired)
                            throw new CustomAuthError({
                                type: 'Verification',
                                name: 'TwoFactorVerificationError',
                                message: 'Two factor code expired',
                            });

                        await prisma.twoFactorToken.delete({
                            where: {
                                id: twoFactorToken.id,
                            },
                        });

                        const existingConfirmation =
                            await getTwoFactoConfirmationByUserId(
                                existingUser.id
                            );

                        if (existingConfirmation) {
                            await prisma.twoFactorConfirmation.delete({
                                where: { id: existingConfirmation.id },
                            });
                        }

                        await prisma.twoFactorConfirmation.create({
                            data: {
                                userId: existingUser.id,
                            },
                        });
                    } else {
                        const twoFactorConfirmation =
                            await generateTwoFactorToken(existingUser.email);
                        await sendTwoFactorEmail(
                            twoFactorConfirmation.identifier,
                            twoFactorConfirmation.token
                        );

                        throw new CustomAuthError({
                            type: 'Verification',
                            name: 'TwoFactorVerification',
                            message:
                                'Two factor verification code sended on your email',
                        });
                    }
                }

                return existingUser;
            },
        }),
    ],
} satisfies NextAuthConfig;
