import { z, AnyZodObject } from 'zod';

type Validate<T extends AnyZodObject = AnyZodObject> = (
    schema: T,
    data: z.infer<T>
) => z.inferFlattenedErrors<T>['fieldErrors'] | undefined;

export const validation: Validate = <T extends z.AnyZodObject>(
    schema: T,
    data: z.infer<T>
) => {
    const validation = schema.safeParse(data);

    if (!validation.success) {
        return validation.error.flatten().fieldErrors;
    }
};

type ValidateField<T extends AnyZodObject = AnyZodObject> = (
    schema: T,
    field: keyof z.infer<T>,
    value: unknown
) => z.inferFlattenedErrors<T>['formErrors'] | undefined;

export const validateField: ValidateField = (schema, field, value) => {
    const validationSchema = schema.shape[field];

    const validation = validationSchema.safeParse(value);

    if (!validation.success) {
        return validation.error.flatten().formErrors;
    }
};

export const isSchemaKey = <T extends z.AnyZodObject>(
    schema: T,
    name: string | number | symbol
): name is keyof z.infer<T> => {
    return name in schema.shape;
};
