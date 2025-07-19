import { useDriveImage } from "@/hooks/useDriveImage";
import { DRIVE_CONFIG } from "@/config/drive";
import { useEffect, useState, useMemo } from "react";

interface DriveBackgroundImageProps {
  imageName: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  fallbackSrc?: string;
}

export default function DriveBackgroundImage({
  imageName,
  children,
  className = "",
  style = {},
  fallbackSrc
}: DriveBackgroundImageProps) {
  const { imageUrl, loading, error } = useDriveImage(imageName, DRIVE_CONFIG.IMAGES_FOLDER_ID, DRIVE_CONFIG.API_KEY);
  
  const backgroundStyle = useMemo(() => {
    const finalImageUrl = imageUrl || fallbackSrc || `/images/${imageName}`;
    
    return {
      ...style,
      backgroundImage: `url(${finalImageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    };
  }, [imageUrl, fallbackSrc, imageName, style]);

  if (loading) {
    return (
      <div 
        className={`${className} bg-gray-200 animate-pulse`}
        style={style}
      >
        {children}
      </div>
    );
  }

  return (
    <div 
      className={className}
      style={backgroundStyle}
    >
      {children}
    </div>
  );
} 