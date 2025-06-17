import { z } from 'zod';
import UserSchema from './UserSchema';

const RegisterSchema = UserSchema.pick({
    name: true,
    email: true,
    password: true,
});

export default RegisterSchema;

export type RegisterSchemaType = typeof RegisterSchema;

export type RegisterType = z.infer<RegisterSchemaType>;

export type RegisterFlattenedErrors =
    z.inferFlattenedErrors<RegisterSchemaType>;
