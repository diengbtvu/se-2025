import { useEffect, useState } from "react";

export function useDriveImage(imageName: string, folderId: string, apiKey: string) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchImage() {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🖼️ Fetching image from Google Drive:', { imageName, folderId });
        
        const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${apiKey}&fields=files(id,name)`;
        console.log('📡 API URL:', url);
        
        const res = await fetch(url);
        console.log('📊 Response status:', res.status);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log('📁 Files found:', data.files);
        
        const file = data.files.find((f: any) => f.name === imageName);
        console.log('🖼️ Target image:', file);
        
        if (file) {
          // Tạo direct link cho ảnh từ Google Drive
          const imageUrl = `https://drive.google.com/uc?export=view&id=${file.id}`;
          console.log('🔗 Image URL:', imageUrl);
          setImageUrl(imageUrl);
        } else {
          setError(`Image "${imageName}" not found in folder`);
          console.error('❌ Image not found:', imageName);
        }
      } catch (err) {
        console.error('❌ Error fetching image:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    
    if (folderId && apiKey) {
      fetchImage();
    }
  }, [imageName, folderId, apiKey]);

  return { imageUrl, loading, error };
} 