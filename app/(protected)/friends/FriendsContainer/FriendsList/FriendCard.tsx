'use client';

import { useState } from 'react';
import { UserCard } from '@/components/UserCard';
import useModalClose from '@/hooks/useModalClose';
import { AnimatePresence, motion, Variants } from 'motion/react';
import { IoMdMore } from 'react-icons/io';
import { UserFriend } from '@/data/friendship';
import { IoMailOpen, IoTrash, IoWarning } from 'react-icons/io5';

interface FriendCardProps extends UserFriend {
    deleteFriend: () => void;
    hasError: boolean;
}

const variants: Variants = {
    open: {
        opacity: 1,
        scale: 1,
    },
    closed: {
        opacity: 0,
        scale: 0,
    },
    openWithError: {
        opacity: 1,
        scale: 1,
        outline: '2px solid var(--errorText)',
        boxShadow: '0 0 8px 2px var(--errorText)',
    },
};

const FriendCard = ({ deleteFriend, hasError, ...user }: FriendCardProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const containerRef = useModalClose<HTMLLIElement>({
        isOpen,
        callback: () => setIsOpen(false),
    });

    return (
        <motion.li
            variants={variants}
            initial="closed"
            animate={hasError ? 'openWithError' : 'open'}
            exit="closed"
            tabIndex={isOpen ? 10 : 0}
            layout
            ref={containerRef}
            className={`flex gap-4 min-w-60 justify-between items-center rounded-l-full rounded-r relative`}
        >
            <UserCard user={user} />
            <button
                className="relative flex flex-col items-center justify-center h-full transition-all aspect-square group hover:scale-125 active:scale-90"
                onClick={() => setIsOpen(true)}
            >
                <IoMdMore className="inset-0 text-2xl transition-all text-secondaryText group-hover:text-mainText" />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="friend-actions"
                        variants={variants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="absolute right-0 z-10 flex flex-col overflow-hidden text-sm rounded bg-secondaryBG text-mainText"
                    >
                        <button className="flex items-center justify-start gap-2 p-2 transition-all hover:bg-primaryBG hover:text-secondaryText">
                            <IoMailOpen />
                            <span>Send Message</span>
                        </button>

                        <button
                            className="flex items-center justify-start gap-2 p-2 transition-all hover:bg-primaryBG hover:text-secondaryText"
                            onClick={deleteFriend}
                            value={'delete-user'}
                        >
                            <IoTrash />
                            Delete
                        </button>
                    </motion.div>
                )}
                {hasError && (
                    <motion.div
                        key="friend-errors"
                        variants={variants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="absolute text-lg text-errorText right-6"
                    >
                        <IoWarning />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.li>
    );
};

export default FriendCard;
