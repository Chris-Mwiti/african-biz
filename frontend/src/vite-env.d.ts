/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLOUDINARY_CLOUD_NAME: string;
  readonly VITE_CLOUDINARY_UPLOAD_PRESET: string;
  readonly VITE_GOOGLE_CLOUD_CLIENT_ID: string;
  readonly VITE_GOOGLE_REDIRECT_URL:string;
  // Add other VITE_ prefixed environment variables here
  // readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
