export interface UploadFileDto {
  file: Buffer;
  fileName: string;
  contentType: string;
  folder?: string;
}

export interface SignedUrlOptions {
  expiresIn?: number; // Segundos (default: 15 minutos)
}

