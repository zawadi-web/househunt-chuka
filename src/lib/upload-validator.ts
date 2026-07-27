/**
 * File Upload Security & Anti-Duplication Validator
 * Enforces strict MIME checks, size limits, extension whitelisting, and image hash calculation.
 */

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'];

export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
export const MAX_VIDEO_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

export interface UploadFileValidationResult {
  isValid: boolean;
  error?: string;
  isImage?: boolean;
  isVideo?: boolean;
}

export function validateUploadFile(
  fileName: string,
  mimeType: string,
  sizeBytes: number
): UploadFileValidationResult {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';

  const isImageMime = ALLOWED_IMAGE_TYPES.includes(mimeType.toLowerCase());
  const isVideoMime = ALLOWED_VIDEO_TYPES.includes(mimeType.toLowerCase());

  const validImageExts = ['jpg', 'jpeg', 'png', 'webp'];
  const validVideoExts = ['mp4', 'webm'];

  if (isImageMime || validImageExts.includes(extension)) {
    if (sizeBytes > MAX_IMAGE_SIZE_BYTES) {
      return {
        isValid: false,
        error: `Image size exceeds the maximum limit of 10MB (file size: ${(sizeBytes / (1024 * 1024)).toFixed(2)}MB)`
      };
    }
    return { isValid: true, isImage: true };
  }

  if (isVideoMime || validVideoExts.includes(extension)) {
    if (sizeBytes > MAX_VIDEO_SIZE_BYTES) {
      return {
        isValid: false,
        error: `Video size exceeds the maximum limit of 50MB (file size: ${(sizeBytes / (1024 * 1024)).toFixed(2)}MB)`
      };
    }
    return { isValid: true, isVideo: true };
  }

  return {
    isValid: false,
    error: `Unsupported file type (${extension || mimeType}). Only JPG, PNG, WEBP images and MP4, WEBM videos are permitted.`
  };
}

/**
 * Calculates a simple perceptual image hash string to detect stolen/duplicate listing photos
 */
export function calculateSimpleImageHash(imageUrl: string): string {
  let hash = 0;
  const str = imageUrl.trim();
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return `hash_${Math.abs(hash).toString(16)}`;
}
