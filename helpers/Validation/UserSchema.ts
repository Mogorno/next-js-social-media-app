import { z } from 'zod';
const UserSchema = z.object({
    name: z
        .string()
        .min(3, 'User name must be at least 3 characters long.')
        .max(20, 'User name must be at most 20 characters long.'),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters long.')
        .max(20, 'Password must be at most 20 characters long.'),
    email: z
        .string()
        .email('Invalid email address.')
        .min(3, 'Email must be at least 5 characters long.')
        .max(50, 'Email must be at most 50 characters long.'),
});

export default UserSchema;

export type UserSchemaType = typeof UserSchema;

export type UserType = z.infer<UserSchemaType>;

export type UserFlattenedErrors = z.inferFlattenedErrors<UserSchemaType>;
