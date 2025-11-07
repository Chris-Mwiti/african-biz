import React, { useEffect, useRef } from 'react';

interface CloudinaryUploadWidgetProps {
  onUploadSuccess: (imageUrl: string) => void;
  onUploadError?: (error: any) => void;
  cloudName: string;
  uploadPreset: string;
  buttonText?: string;
}

const CloudinaryUploadWidget: React.FC<CloudinaryUploadWidgetProps> = ({
  onUploadSuccess,
  onUploadError,
  cloudName,
  uploadPreset,
  buttonText = 'Upload Image',
}) => {
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    // Ensure the Cloudinary script is loaded
    if (!(window as any).cloudinary) {
      console.error('Cloudinary script not loaded. Please add <script src="https://widget.cloudinary.com/v2.0/global/all.js" type="text/javascript"></script> to your index.html');
      return;
    }

    widgetRef.current = (window as any).cloudinary.createUploadWidget(
      {
        cloudName: cloudName,
        uploadPreset: uploadPreset,
        sources: ['local', 'url', 'camera'], // Customize upload sources
        multiple: false, // Allow single image upload for now
        // Add more options as needed, e.g., cropping, transformations
      },
      (error: any, result: any) => {
        if (!error && result && result.event === 'success') {
          console.log('Done uploading!!! Here is the image info: ', result.info);
          onUploadSuccess(result.info.secure_url);
        } else if (error) {
          console.error('Cloudinary Upload Error:', error);
          onUploadError?.(error);
        }
      }
    );
  }, [cloudName, uploadPreset, onUploadSuccess, onUploadError]);

  const showWidget = () => {
    if (widgetRef.current) {
      widgetRef.current.open();
    }
  };

  return (
    <button type="button" onClick={showWidget} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
      {buttonText}
    </button>
  );
};

export default CloudinaryUploadWidget;
