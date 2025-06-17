import { User } from '@prisma/client';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

type UserObject = Pick<User, 'id'> & Partial<Omit<User, 'id'>>;

export interface UserCardProps extends React.ComponentProps<'div'> {
    user: UserObject;
    showDetails?: Partial<Record<keyof UserObject, boolean>>;
    isResponsive?: boolean;
    children?: React.ReactNode;
}

export const UserCard = ({
    user,
    showDetails = { name: true, email: true },
    isResponsive,
    children,
    className,
    ...restProps
}: UserCardProps) => {
    const { id, email, image, name } = user;

    const userName = name ?? `User-${id.slice(0, 4)}`;
    return (
        <div
            className={twMerge(
                'relative flex justify-center items-center gap-2 h-10',
                className
            )}
            {...restProps}
        >
            <div
                className="relative h-full aspect-square  border-2 border-solid border-innerBG 
                bg-mainBG text-mainText hover:border-secondaryBG hover:text-secondaryText 
                flex items-center justify-center text-xl
                cursor-pointer rounded-full transition-all"
            >
                {!image && (
                    <span className="absolute inset-0 w-full h-full flex items-center justify-center">
                        {userName[0].toUpperCase()}
                    </span>
                )}
                {image && (
                    <Image
                        className="w-full h-full object-cover rounded-full"
                        src={image}
                        priority={true}
                        alt={user.name ? user.name : 'Profile-User-Image'}
                        width={40}
                        height={40}
                    />
                )}
            </div>
            {showDetails && (
                <div
                    className={twMerge(
                        'flex flex-col justify-center items-start h-10 w-full overflow-hidden grow',
                        isResponsive &&
                            'hidden md:flex md:items-start md:justify-between '
                    )}
                >
                    {showDetails.name && (
                        <h3 className="text-mainText truncate text-md leading-tight">
                            {userName}
                        </h3>
                    )}
                    {showDetails.email && email && (
                        <span className="text-secondaryText block truncate text-sm">
                            {email}
                        </span>
                    )}
                </div>
            )}
            {children}
        </div>
    );
};
