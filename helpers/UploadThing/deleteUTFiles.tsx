'use server';

import { UTApi } from 'uploadthing/server';

const utApi = new UTApi();

export const deleteUTFiles = async (files: string[] | string) => {
    try {
        console.log('Files to delete:', files);
        const response = await utApi.deleteFiles(files);
        console.log('Delete response:', response);
        return true;
    } catch (error) {
        console.error('UTAPI: Error deleting files', error);
        return false;
    }
};
