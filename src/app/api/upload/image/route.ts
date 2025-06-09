import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  if (!file) {
    return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
  }

  // (1) 파일 검증 (예: 크기, MIME 타입 등)
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: 'File size exceeds 5MB.' }, { status: 400 });
  }
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!allowedMimeTypes.includes(file.type)) {
    return NextResponse.json({ error: 'File type not allowed.' }, { status: 400 });
  }

  // (2) 외부 API (S3)에 업로드 (서버 환경 변수로 키 관리)
  const ext = file.name.split('.').pop();
  const key = `uploads/${uuidv4()}.${ext}`;
  const arrayBuffer = await file.arrayBuffer();
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: new Uint8Array(arrayBuffer), // ✅ 이렇게 바꿔야 함
    ContentType: file.type,
  });
  await s3Client.send(command);

  // (3) 업로드 후 URL (또는 presigned URL)을 반환
  const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  const publicUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  return NextResponse.json({ url: publicUrl });
} 