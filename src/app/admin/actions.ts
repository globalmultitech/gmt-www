'use server'

import { getSignedUrlForS3 } from '@/lib/r2';
import crypto from "crypto";
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const MAX_FILE_SIZE = 1024 * 1024 * 5; // 5MB

const GetSignedURLSchema = z.object({
  fileType: z.string(),
  fileSize: z.number().max(MAX_FILE_SIZE),
  checksum: z.string(),
})

const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex")

export async function getSignedURL(type: string, size: number, checksum: string) {
    const validatedFields = GetSignedURLSchema.safeParse({
        fileType: type,
        fileSize: size,
        checksum,
    });

    if (!validatedFields.success) {
        throw new Error('Input tidak valid');
    }

    const { fileType, fileSize } = validatedFields.data;

    const extension = fileType.split("/")[1];
    const key = `${uuidv4()}.${extension}`;
    
    const signedUrl = await getSignedUrlForS3(key, fileType, fileSize);
    const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

    return { signedUrl, publicUrl };
}
