'use client';

import { useActionState, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import UserSchema, { UserType } from '@/helpers/Validation/UserSchema';
import {
    updateUserField,
    UpdateUserFieldFormState,
} from '@/data/user/updateUser';
import { User } from '@prisma/client';
import { IoClose, IoPencil, IoCheckmark } from 'react-icons/io5';
import { AnimatePresence, motion, Variants } from 'motion/react';
import cn from 'classnames';
import Input from '../ui/Input';
import FlexMessage from '../ui/FlexMessage';

const variants: Variants = {
    initial: {
        opacity: 0,
        scale: 0.5,
        y: -24,
    },
    animate: {
        y: 0,
        opacity: 1,
        scale: 1,
    },
    exit: {
        opacity: 0,
        scale: 0.5,
        y: 24,
    },
};

const UpdateUserFieldForm = ({
    userId,
    field,
    currentValue,
    placeholder,
    type,
}: {
    userId: User['id'];
    field: keyof UserType;
    type: 'email' | 'text';
    placeholder: string;
    currentValue: UserType[keyof UserType];
}) => {
    const initialState: UpdateUserFieldFormState = {
        errors: [],
        success: false,
        value: currentValue,
    };

    const [state, formAction, isPending] = useActionState(
        updateUserField,
        initialState
    );

    const initialFormData: UpdateUserFieldFormState & { isEditing: boolean } = {
        ...state,
        isEditing: false,
    };

    const [{ isEditing, errors, value, success }, setFormData] =
        useState(initialFormData);

    const { update } = useSession();

    useEffect(() => {
        if (state.success) {
            if (field === 'email' || field === 'name') {
                update({
                    [field]: state.value,
                });
            }
            setFormData((prev) => ({ ...prev, isEditing: false }));
        }

        return setFormData((prev) => ({
            ...prev,
            ...state,
            success: false,
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);

    const userFieldSchema = UserSchema.shape[field];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        let errors: string[] = [];

        const validation = userFieldSchema.safeParse(value);

        if (!validation.success) {
            errors = Object.values(
                validation.error.flatten().formErrors ?? {}
            ).filter((e): e is string => Boolean(e));
        }

        setFormData((prev) => ({
            ...prev,
            errors,
            value,
            success: false,
        }));
    };

    return (
        <form
            className="flex flex-col items-center justify-center w-80"
            action={formAction}
        >
            <input type="text" hidden name="id" defaultValue={userId} />
            <div className="flex relative">
                <Input
                    className={`pr-16 ${isEditing ? '' : '!bg-primaryBG'} ${errors.length !== 0 ? '!outline-errorText' : ''} ${isPending ? '!animate-pulse' : ''}`}
                    value={value}
                    onChange={handleChange}
                    type={type}
                    name={field}
                    autoComplete={field}
                    placeholder={
                        isEditing ? 'Edit your ' + placeholder : placeholder
                    }
                    disabled={isPending || !isEditing}
                />

                <AnimatePresence key="button-container" initial={false}>
                    {isEditing && !isPending && (
                        <motion.div
                            key="submit-button-container"
                            variants={variants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="absolute right-2 top-2 h-[calc(100%-1rem)] aspect-[2/1] flex justify-end items-center z-20"
                        >
                            <InputButton
                                Icon={IoCheckmark}
                                disabled={
                                    errors.length !== 0 ||
                                    isPending ||
                                    value === currentValue
                                }
                                type="submit"
                                className={`text-successText disabled:text-secondaryText disabled:scale-100`}
                            />
                            <InputButton
                                onClick={() => setFormData(initialFormData)}
                                Icon={IoClose}
                                type="button"
                                className={`text-errorText disabled:text-secondaryText`}
                            />
                        </motion.div>
                    )}
                    {isPending && (
                        <motion.div
                            key="submit-pending-spinner"
                            variants={variants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="absolute right-2 top-2 h-[calc(100%-1rem)] aspect-square flex justify-end items-center z-20"
                        >
                            <svg
                                aria-hidden="true"
                                className="h-full w-full text-mainBG animate-spin fill-secondaryText"
                                viewBox="0 0 100 101"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="currentColor"
                                />
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentFill"
                                />
                            </svg>
                            <span className="sr-only">Loading...</span>
                        </motion.div>
                    )}
                    {!isEditing && (
                        <motion.div
                            key="edit-button-container"
                            className="absolute right-2 top-2 h-[calc(100%-1rem)] aspect-square flex justify-end items-center z-20"
                            variants={variants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <InputButton
                                Icon={IoPencil}
                                className={`${success ? 'text-successText' : 'text-secondaryText'}`}
                                type="button"
                                onClick={() =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        isEditing: true,
                                    }))
                                }
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <FlexMessage
                isVisible={value.length > 2 && errors.length !== 0}
                messages={errors?.[0]}
            />
        </form>
    );
};

export default UpdateUserFieldForm;

interface InputButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    Icon: React.FC<React.SVGProps<SVGSVGElement>>;
}
const InputButton = ({ Icon, className, ...restProps }: InputButtonProps) => {
    return (
        <button
            {...restProps}
            className={cn(
                'h-full aspect-square hover:scale-110 active:scale-90 transition-all',
                className
            )}
        >
            <Icon className="w-full h-full" />
        </button>
    );
};
