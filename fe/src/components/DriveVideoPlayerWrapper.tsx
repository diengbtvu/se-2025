import DriveVideoPlayer from "./DriveVideoPlayer";
import { DRIVE_CONFIG } from "@/config/drive";

interface DriveVideoPlayerWrapperProps {
  videoName: string;
  fallbackSrc?: string;
  className?: string;
  style?: React.CSSProperties;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
}

export default function DriveVideoPlayerWrapper({
  videoName,
  fallbackSrc,
  className = "",
  style = {},
  autoPlay = true,
  muted = true,
  loop = true,
  playsInline = true
}: DriveVideoPlayerWrapperProps) {
  return (
    <DriveVideoPlayer
      videoName={videoName}
      folderId={DRIVE_CONFIG.VIDEOS_FOLDER_ID}
      apiKey={DRIVE_CONFIG.API_KEY}
      fallbackSrc={fallbackSrc}
      className={className}
      style={style}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      playsInline={playsInline}
    />
  );
} 