import { z } from 'zod';
import UserSchema from './UserSchema';

const LoginSchema = UserSchema.pick({
    email: true,
    password: true,
}).extend({
    twoFactorCode: z
        .string()
        .max(10, 'Code must be at most 10 characters long.')
        .optional(),
});

export default LoginSchema;

export type LoginSchemaType = typeof LoginSchema;

export type LoginType = z.infer<LoginSchemaType>;

export type LoginFlattenedErrors = z.inferFlattenedErrors<LoginSchemaType>;
