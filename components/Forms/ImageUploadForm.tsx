'use client';

import { UploadDropzone } from '@/helpers/UploadThing';
import type { ClientUploadedFileData } from 'uploadthing/types';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRef, useState } from 'react';
import {
    AnimatePresence,
    motion,
    MotionProps,
    useMotionValue,
    useSpring,
    Variants,
} from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import useModalClose from '@/hooks/useModalClose';

interface UploadResponse {
    error?: string;
    uploadedBy?: string;
}

type UploadStatus = 'pending' | 'success' | 'error' | null;

const dropzoneVariants: Variants = {
    open: { opacity: 0.9, scale: 1, rotate: 0 },
    closed: { opacity: 0, scale: 0, rotate: 25 },
};
const resetVariants: Variants = {
    tap: { scale: 0.9, rotate: 0 },
    hover: { scale: 1.1, rotate: 180 },
    open: { opacity: 1, scale: 1 },
    closed: { opacity: 0, scale: 0 },
};
const errorVariants: Variants = {
    open: { opacity: 1, scaleY: 1 },
    closed: { opacity: 0, scaleY: 0 },
};
const ImageUploadForm = () => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [resetToggle, setResetToggle] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [status, setStatus] = useState<UploadStatus>(null);

    const { data, update } = useSession();
    const userImage = data?.user.image;

    const progress = useMotionValue(0);
    const scaleX = useSpring(progress);
    const containerTimerRef = useRef<NodeJS.Timeout | null>(null);
    const messageTimerRef = useRef<NodeJS.Timeout | null>(null);

    const handleReset = () => {
        setResetToggle((prev) => !prev);
        setImageUrl(null);
        if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
        setStatus(null);
    };
    const handleHoverStart = () => {
        if (containerTimerRef.current) {
            clearTimeout(containerTimerRef.current);
        }
        setIsOpen(true);
    };
    const handleHoverEnd = () => {
        if (containerTimerRef.current) clearTimeout(containerTimerRef.current);
        if (!imageUrl)
            containerTimerRef.current = setTimeout(
                () => setIsOpen(false),
                1000
            );
    };
    const handleOnChangeFile = (e: File[]) => {
        const file = e[0];
        if (file) {
            const imagePreviewUrl = URL.createObjectURL(file);
            setImageUrl(imagePreviewUrl);
        }
        if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
        setStatus(null);
    };
    const handleProgress = (progressValue: number) => {
        progress.set((progressValue + 1) / 100 - 0.01);
    };
    const handleError = () => {
        setStatus('error');
        if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
        messageTimerRef.current = setTimeout(() => {
            setStatus(null);
            handleHoverEnd();
        }, 3000);
    };
    const handlePending = (files: File[]) => {
        if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
        setStatus('pending');
        return files;
    };
    const handleOnComplete = async (
        res: ClientUploadedFileData<UploadResponse>[]
    ) => {
        progress.set(0);
        await update({
            image: res[0].ufsUrl,
        });
        setImageUrl(null);
        setStatus('success');
        if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
        messageTimerRef.current = setTimeout(() => {
            setStatus(null);
            setIsOpen(false);
        }, 3000);
    };

    const modalRef = useModalClose<HTMLDivElement>({
        isOpen,
        callback: () => (setIsOpen(false), handleReset()),
        options: {
            triggers: { mouseLeave: false },
        },
    });

    return (
        <motion.div
            ref={modalRef}
            className="relative w-80 aspect-square select-none cursor-grab active:cursor-grabbing"
            onHoverStart={handleHoverStart}
            onHoverEnd={handleHoverEnd}
            onClick={handleHoverStart}
        >
            <AnimatePresence key={data?.user.id} initial={false}>
                {(userImage || imageUrl) && (
                    <motion.div
                        key="upload-image"
                        className="absolute inset-0 rounded overflow-hidden"
                    >
                        <Image
                            className="w-full h-full object-cover"
                            src={imageUrl ?? (userImage as string)}
                            alt="uploaded image"
                            width={300}
                            height={300}
                            unoptimized
                        />
                    </motion.div>
                )}
                <motion.div
                    key="upload-form-dropzone"
                    variants={dropzoneVariants}
                    className="absolute inset-0 bg-mainBG"
                    animate={!userImage || isOpen ? 'open' : 'closed'}
                >
                    {imageUrl && (
                        <motion.button
                            key="upload-form-reset"
                            className="absolute top-2 right-2 text-mainText text-4xl transition-colors disabled:text-secondaryText"
                            disabled={status === 'pending'}
                            onClick={handleReset}
                            variants={resetVariants}
                            whileTap="tap"
                            whileHover="hover"
                            animate="open"
                            initial="closed"
                            exit="closed"
                        >
                            <IoClose />
                        </motion.button>
                    )}
                    <UploadDropzone
                        disabled={status === 'pending'}
                        key={`upload-form-dropzone-${resetToggle}`}
                        appearance={{
                            button: 'p-2 m-2 text-mainText rounded cursor-pointer hover:scale-110 hover:bg-innerBG hover:text-innerText transition-all active:scale-90',
                            container:
                                'border border-dashed border-innerBG p-4 !w-full !h-full !rounded',
                            allowedContent: 'text-secondaryText',
                            label: 'text-secondaryText',
                            uploadIcon: 'text-innerBG',
                        }}
                        endpoint="userProfileImageUploader"
                        onChange={handleOnChangeFile}
                        onBeforeUploadBegin={handlePending}
                        onUploadProgress={handleProgress}
                        onClientUploadComplete={handleOnComplete}
                        onUploadError={(error) => {
                            console.log(error);
                            handleError();
                        }}
                    />
                    <motion.span
                        key={`upload-form-progress`}
                        style={{ scaleX }}
                        className="absolute bottom-0 left-0 h-2 w-full bg-successText origin-left"
                    />
                </motion.div>
                <UploadMessage
                    key={`upload-message-${status}`}
                    variants={errorVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    status={status}
                />
            </AnimatePresence>
        </motion.div>
    );
};

export default ImageUploadForm;

interface UploadMessageProps extends MotionProps {
    status: UploadStatus;
}
const UploadMessage = ({ status, ...restProps }: UploadMessageProps) => {
    if (!status || status === 'pending') return null;
    const text = {
        success: 'Image uploaded successfully',
        error: 'Something went wrong, Peace try again',
    }[status];
    return (
        <motion.div
            className={`absolute bottom-0 left-0 flex w-full justify-center items-center origin-bottom p-2 ${status === 'success' ? 'text-successText' : 'text-errorText'}`}
            {...restProps}
        >
            {text}
        </motion.div>
    );
};
