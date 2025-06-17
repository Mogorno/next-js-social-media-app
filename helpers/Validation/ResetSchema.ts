import { z } from 'zod';
import UserSchema from './UserSchema';

const ResetSchema = UserSchema.pick({
    email: true,
});

export default ResetSchema;

export type ResetSchemaType = typeof ResetSchema;

export type ResetType = z.infer<ResetSchemaType>;

export type ResetFlattenedErrors = z.inferFlattenedErrors<ResetSchemaType>;
