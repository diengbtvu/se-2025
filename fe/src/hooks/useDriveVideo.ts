import { useEffect, useState } from "react";

export function useDriveVideo(videoName: string, folderId: string, apiKey: string) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVideo() {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔍 Fetching video from Google Drive:', { videoName, folderId });
        
        const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${apiKey}&fields=files(id,name)`;
        console.log('📡 API URL:', url);
        
        const res = await fetch(url);
        console.log('📊 Response status:', res.status);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log('📁 Files found:', data.files);
        
        const file = data.files.find((f: any) => f.name === videoName);
        console.log('🎥 Target file:', file);
        
        if (file) {
          // Sử dụng iframe embed URL thay vì direct video URL
          const videoUrl = `https://drive.google.com/file/d/${file.id}/preview`;
          console.log('🔗 Video URL:', videoUrl);
          setVideoUrl(videoUrl);
        } else {
          setError(`Video "${videoName}" not found in folder`);
          console.error('❌ Video not found:', videoName);
        }
      } catch (err) {
        console.error('❌ Error fetching video:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    
    if (folderId && apiKey) {
      fetchVideo();
    }
  }, [videoName, folderId, apiKey]);

  return { videoUrl, loading, error };
} 