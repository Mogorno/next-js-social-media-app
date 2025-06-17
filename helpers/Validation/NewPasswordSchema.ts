import { z } from 'zod';
import UserSchema from './UserSchema';

const NewPasswordSchema = UserSchema.pick({
    password: true,
});

export default NewPasswordSchema;

export type NewPasswordSchemaType = typeof NewPasswordSchema;

export type NewPasswordType = z.infer<NewPasswordSchemaType>;

export type NewPasswordFlattenedErrors =
    z.inferFlattenedErrors<NewPasswordSchemaType>;
