'use server';

import { revalidatePath } from 'next/cache';
import { AuthError } from 'next-auth';
import UserSchema, { UserType } from '@/helpers/Validation/UserSchema';
import { PROFILE } from '@/helpers/NAVIGATE_LINKS';
import { hashPassword } from '@/helpers/bcrypt';
import { prisma } from '@/prisma';

const posableUpdatingUserFields = ['name', 'email', 'password'] as const;

export interface UpdateUserFieldFormState {
    errors: string[];
    success: boolean;
    value: UserType[keyof UserType];
}

export interface UpdateUserWithCredentialsType {
    (
        prevState: UpdateUserFieldFormState,
        formData: FormData
    ): Promise<UpdateUserFieldFormState>;
}

interface GetFormDataOneField {
    (
        formData: FormData,
        list: (keyof UserType)[]
    ): { key: keyof UserType; value: string } | null;
}

const getFormDataOneField: GetFormDataOneField = (formData, list) => {
    for (const key of list) {
        const value = formData.get(key);
        if (typeof value === 'string') {
            return { key, value };
        }
    }
    return null;
};

export const updateUserField: UpdateUserWithCredentialsType = async (
    prevState,
    formData
) => {
    const userId = formData.get('id')?.toString() ?? '';

    const field = getFormDataOneField(formData, [...posableUpdatingUserFields]);

    if (!field)
        return {
            ...prevState,
            success: false,
            errors: ['Something went wrong'],
        };

    const { key, value } = field;

    try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) throw new Error("User don't exist");

        const fieldSchema = UserSchema.shape[key];
        const validation = fieldSchema.safeParse(value);

        if (!validation.success) {
            return {
                errors: Object.values(
                    validation.error.flatten().formErrors ?? {}
                )
                    .flat()
                    .filter((e): e is string => Boolean(e)),
                success: false,
                isValid: false,
                value,
            };
        }

        let data = { [key]: value };

        if (key === 'password') {
            const hashedPassword = await hashPassword(value);
            data = { hashPassword: hashedPassword };
        }

        await prisma.user.update({
            where: { id: user.id },
            data,
        });

        revalidatePath(PROFILE.href);

        return {
            success: true,
            isValid: true,
            errors: [],
            value,
        };
    } catch (error) {
        let errorMessage = 'Something went wrong';
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    errorMessage = 'Invalid email or password';
                    break;
                default:
                    errorMessage = 'Authentication failed';
                    break;
            }
        }
        return {
            errors: [errorMessage],
            success: false,
            isValid: true,
            value,
        };
    }
};
