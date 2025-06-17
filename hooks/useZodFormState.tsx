'use client';

import { validateField } from '@/helpers/Validation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { z, AnyZodObject } from 'zod';

type BaseStatus<TStatus extends string = string> =
    | 'idle'
    | 'validation'
    | TStatus;

type ZodSchemaType<TSchema extends AnyZodObject = AnyZodObject> = TSchema;

type SchemaValues<TSchema extends ZodSchemaType> = z.infer<TSchema>;

type SchemaErrors<TSchema extends ZodSchemaType> =
    z.inferFlattenedErrors<TSchema>['fieldErrors'];

type InitialFormState<
    TSchema extends ZodSchemaType,
    TStatus extends BaseStatus,
> = {
    values: SchemaValues<TSchema>;
    errors?: SchemaErrors<TSchema>;
    status: BaseStatus<TStatus>;
};
type NoReservedKeys<T, U> = keyof T extends keyof U ? never : T;

export default function useZodFormState<
    TSchema extends ZodSchemaType,
    TStatus extends string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TExtra extends Record<string, any>,
    TInitial extends InitialFormState<TSchema, TStatus> & TExtra,
>(
    schema: TSchema,
    initial: InitialFormState<TSchema, TStatus> &
        (
            | Omit<TInitial, keyof InitialFormState<TSchema, TStatus>>
            | NoReservedKeys<TExtra, InitialFormState<TSchema, TStatus>>
        )
) {
    const [formState, setFormState] = useState(initial);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        setFormState(initial);
    }, [initial]);

    const onChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            if (!(name in schema.shape)) return;

            setFormState((prev) => {
                const { values: prevValues } = prev;
                let errors: Record<string, string[]> | undefined = {
                    ...prev.errors,
                };

                const values = { ...prevValues, [name]: value };

                const fieldErrors = validateField(schema, name, value);

                if (fieldErrors) errors = { ...errors, [name]: fieldErrors };
                else delete errors[name];

                if (Object.keys(errors).length === 0) errors = undefined;

                return {
                    ...prev,
                    status: errors ? 'validation' : 'idle',
                    errors,
                    values,
                };
            });
        },
        [schema]
    );

    return { ...formState, onChange };
}
