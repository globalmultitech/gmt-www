import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function getSignedUrlForS3(key: string, type: string, size: number) {
    const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
        ContentType: type,
        ContentLength: size,
    });

    const signedUrl = await getSignedUrl(s3, command, {
        expiresIn: 60, // 1 minute
    });
    
    const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

    return { signedUrl, publicUrl };
}
