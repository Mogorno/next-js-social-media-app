import { auth } from '@/auth';
import { PROFILE } from '@/helpers/NAVIGATE_LINKS';
import { deleteUTFiles } from '@/helpers/UploadThing/deleteUTFiles';
import { prisma } from '@/prisma';
import { revalidatePath } from 'next/cache';
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    userProfileImageUploader: f({
        image: {
            /**
             * For full list of options and defaults, see the File Route API reference
             * @see https://docs.uploadthing.com/file-routes#route-config
             */
            maxFileSize: '4MB',
            maxFileCount: 1,
        },
    })
        // Set permissions and file types for this FileRoute
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .middleware(async ({ req }) => {
            // This code runs on your server before upload
            const session = await auth();

            // If you throw, the user will not be able to upload
            if (!session) throw new UploadThingError('Unauthorized');

            // Whatever is returned here is accessible in onUploadComplete as `metadata`
            return { userId: session.user.id, prevImage: session.user.image };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            // This code RUNS ON YOUR SERVER after upload

            const updatedUser = await prisma.user.update({
                where: { id: metadata.userId },
                data: { image: file.ufsUrl },
            });
            if (!updatedUser) {
                await deleteUTFiles([file.key]);
                return { error: 'Error updating user' };
            }
            const prevImage = metadata.prevImage?.split('/').pop();

            if (typeof prevImage === 'string') {
                await deleteUTFiles(prevImage);
            }
            revalidatePath(PROFILE.href);

            return { uploadedBy: metadata.userId };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
