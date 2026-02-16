
import { useState } from 'react';
import {
    ref,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject
} from 'firebase/storage';
import { storage } from '../lib/firebase';
import { useAuth } from './useAuth';

export const useStorage = () => {
    const { user } = useAuth();
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [url, setUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const uploadFile = async (file: File, path: string) => {
        if (!user) return;

        setError(null);
        setUploading(true);
        setProgress(0);

        try {
            const storageRef = ref(storage, path);
            const uploadTask = uploadBytesResumable(storageRef, file);

            return new Promise<string>((resolve, reject) => {
                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        setProgress(p);
                    },
                    (err) => {
                        setError(err.message);
                        setUploading(false);
                        reject(err);
                    },
                    async () => {
                        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                        setUrl(downloadUrl);
                        setUploading(false);
                        resolve(downloadUrl);
                    }
                );
            });
        } catch (err: any) {
            setError(err.message);
            setUploading(false);
            throw err;
        }
    };

    const deleteFile = async (path: string) => {
        setUploading(true);
        try {
            const storageRef = ref(storage, path);
            await deleteObject(storageRef);
            setUploading(false);
        } catch (err: any) {
            setError(err.message);
            setUploading(false);
            throw err;
        }
    };

    return { uploadFile, deleteFile, progress, error, url, uploading };
};
