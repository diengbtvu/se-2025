import { useDriveVideo } from "@/hooks/useDriveVideo";

interface DriveVideoPlayerProps {
  videoName: string;
  folderId: string;
  apiKey: string;
  fallbackSrc?: string;
  className?: string;
  style?: React.CSSProperties;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
}

export default function DriveVideoPlayer({
  videoName,
  folderId,
  apiKey,
  fallbackSrc = "/videos/blur.mp4",
  className = "",
  style = {},
  autoPlay = true,
  muted = true,
  loop = true,
  playsInline = true
}: DriveVideoPlayerProps) {
  // Vẫn gọi API Google Drive để kiểm tra và log, nhưng luôn phát video tĩnh
  useDriveVideo(videoName, folderId, apiKey);

  return (
    <video
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      playsInline={playsInline}
      className={className}
      style={style}
    >
      <source src={fallbackSrc} type="video/mp4" />
    </video>
  );
} 