'use server';

import { signOut } from '@/auth';
import { HOME } from '@/routes';
import { revalidatePath } from 'next/cache';

const logout = async () => {
    await signOut({ redirectTo: HOME.href });
    revalidatePath(HOME.href);
};

export default logout;
