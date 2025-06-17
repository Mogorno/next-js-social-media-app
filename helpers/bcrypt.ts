import { genSalt, hash } from 'bcrypt-ts';

export const hashPassword = async (password: string) => {
    const saltRounds = 10;
    const salt = await genSalt(saltRounds);
    const hashedPassword = await hash(password, salt);
    return hashedPassword;
};
