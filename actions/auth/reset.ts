'use server';

import ResetSchema, {
    ResetType,
    ResetFlattenedErrors,
} from '@/helpers/Validation/ResetSchema';
import { ZodError } from 'zod';
import { getUserByEmail } from '@/data/user/getUser';
import { generatePasswordResetToken } from '@/helpers/tokens';
import { sendPasswordResetEmail } from '@/helpers/Resend/sendPasswordResetEmail';

export interface ResetState {
    values: ResetType;
    status: 'failed' | 'success';
    errors?: ResetFlattenedErrors['fieldErrors'];
    messages?: string[];
}

interface ResetFn {
    (prevState: ResetState, formData: FormData): Promise<ResetState>;
}

const reset: ResetFn = async (prevState, formData) => {
    const values = {
        email: formData.get('email')?.toString() ?? '',
    };

    try {
        const { email } = await ResetSchema.parseAsync(values);

        const user = await getUserByEmail(email);

        if (!user) {
            return {
                values,
                status: 'failed',
                messages: ['User with this email does not exist'],
            };
        }

        const passwordResetToken = await generatePasswordResetToken(email);

        await sendPasswordResetEmail(
            passwordResetToken.identifier,
            passwordResetToken.token
        );

        return {
            values,
            status: 'success',
            messages: ['Confirmation email sent to your email'],
        };
    } catch (error) {
        const messages = ['Something went wrong'];

        if (error instanceof Error && error.message.includes('NEXT_REDIRECT'))
            throw error;

        if (error instanceof ZodError) {
            return {
                values,
                status: 'failed',
                errors: error.flatten().fieldErrors,
            };
        }

        return { values, status: 'failed', messages };
    }
};

export default reset;
