import { useDriveImage } from "@/hooks/useDriveImage";
import { DRIVE_CONFIG } from "@/config/drive";

interface DriveIconProps {
  iconName: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallbackSrc?: string;
}

export default function DriveIcon({
  iconName,
  alt,
  width = 24,
  height = 24,
  className = "",
  fallbackSrc
}: DriveIconProps) {
  const { imageUrl, loading, error } = useDriveImage(iconName, DRIVE_CONFIG.IMAGES_FOLDER_ID, DRIVE_CONFIG.API_KEY);

  // Với SVG, chúng ta sẽ luôn fallback về local file vì Google Drive không phục vụ SVG tốt
  const finalIconSrc = fallbackSrc || `/images/${iconName}`;

  if (loading) {
    return (
      <div className={`${className} animate-pulse bg-gray-200 rounded`} style={{ width, height }}>
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400 mx-auto mt-1"></div>
      </div>
    );
  }

  return (
    <img
      src={finalIconSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={{ width, height }}
    />
  );
} 