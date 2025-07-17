import DriveImage from "./DriveImage";
import { DRIVE_CONFIG } from "@/config/drive";

interface DriveImageWrapperProps {
  imageName: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  fallbackSrc?: string;
}

export default function DriveImageWrapper({
  imageName,
  alt,
  width,
  height,
  className = "",
  priority = false,
  sizes,
  fallbackSrc
}: DriveImageWrapperProps) {
  return (
    <DriveImage
      imageName={imageName}
      folderId={DRIVE_CONFIG.IMAGES_FOLDER_ID}
      apiKey={DRIVE_CONFIG.API_KEY}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      sizes={sizes}
      fallbackSrc={fallbackSrc}
    />
  );
} 