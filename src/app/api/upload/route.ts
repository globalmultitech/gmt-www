// src/app/api/upload/route.ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse, type NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("file") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "At least one file is required." }, { status: 400 });
    }

    const publicUrls: string[] = [];

    for (const file of files) {
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: `File size for "${file.name}" cannot exceed ${MAX_FILE_SIZE / 1024 / 1024}MB.` },
                { status: 413 } // 413 Payload Too Large
            );
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const extension = file.name.split(".").pop();
        const key = `${uuidv4()}.${extension}`;

        const command = new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME!,
            Key: key,
            Body: buffer,
            ContentType: file.type,
        });

        await s3.send(command);
        publicUrls.push(`${process.env.R2_PUBLIC_URL}/${key}`);
    }


    // Always return an array, even for a single file.
    return NextResponse.json({ publicUrls });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload files." },
      { status: 500 }
    );
  }
}
