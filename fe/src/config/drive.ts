// Google Drive Configuration
export const DRIVE_CONFIG = {
  API_KEY: process.env.NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY!,
  IMAGES_FOLDER_ID: process.env.NEXT_PUBLIC_GOOGLE_DRIVE_IMAGES_FOLDER_ID!,
  VIDEOS_FOLDER_ID: process.env.NEXT_PUBLIC_GOOGLE_DRIVE_VIDEOS_FOLDER_ID!,
};

// Validate required environment variables
if (!DRIVE_CONFIG.API_KEY) {
  console.warn('⚠️ NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY is not set');
}

if (!DRIVE_CONFIG.IMAGES_FOLDER_ID) {
  console.warn('⚠️ NEXT_PUBLIC_GOOGLE_DRIVE_IMAGES_FOLDER_ID is not set');
}

if (!DRIVE_CONFIG.VIDEOS_FOLDER_ID) {
  console.warn('⚠️ NEXT_PUBLIC_GOOGLE_DRIVE_VIDEOS_FOLDER_ID is not set');
} 