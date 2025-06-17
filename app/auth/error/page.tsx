import { DEFAULT_LOGIN_REDIRECT, AUTH_ERROR } from '@/routes';
import Link from 'next/link';
import { IoArrowBack } from 'react-icons/io5';

const AuthErrorPage = () => {
    return (
        <main className="flex flex-col items-center justify-center min-h-[calc(100vh-6rem-1.5rem)]">
            <div className="w-[400px] flex flex-col gap-6 items-center justify-center">
                <h1 className="text-secondaryText text-2xl font-bold flex gap-2 justify-start items-center">
                    <AUTH_ERROR.Icon />
                    Oops! Something went wrong!
                </h1>
                <Link
                    className="flex gap-2 items-center text-mainText text-lg hover:gap-4 hover:animate-pulse hover:scale-110 hover:text-secondaryText transition-all"
                    href={DEFAULT_LOGIN_REDIRECT}
                >
                    <IoArrowBack className="" />
                    <span className="">Back to login</span>
                </Link>
            </div>
        </main>
    );
};

export default AuthErrorPage;
