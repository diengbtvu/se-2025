import Image from "next/image";
import { useDriveImage } from "@/hooks/useDriveImage";

interface DriveImageProps {
  imageName: string;
  folderId: string;
  apiKey: string;
  fallbackSrc?: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export default function DriveImage({
  imageName,
  folderId,
  apiKey,
  fallbackSrc,
  alt,
  width,
  height,
  className = "",
  priority = false,
  sizes
}: DriveImageProps) {
  const { imageUrl, loading, error } = useDriveImage(imageName, folderId, apiKey);

  // Sử dụng ảnh từ Google Drive nếu có,否则 fallback về ảnh tĩnh
  const finalImageUrl = imageUrl || fallbackSrc || `/images/${imageName}`;

  if (loading) {
    return (
      <div className={`${className} bg-gray-200 animate-pulse flex items-center justify-center`}>
        <div className="text-center text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mx-auto mb-2"></div>
          <div className="text-sm">Đang tải ảnh...</div>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={finalImageUrl}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      sizes={sizes}
    />
  );
} 