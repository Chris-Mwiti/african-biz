import React, { useRef, useEffect, useState } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  placeholderSrc?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({ src, placeholderSrc, ...props }) => {
  const [imageSrc, setImageSrc] = useState(placeholderSrc);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '0px 0px 100px 0px', // Pre-load images 100px before they enter the viewport
      }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, [src]);

  return <img ref={imageRef} src={imageSrc} {...props} />;
};

export default LazyImage;
