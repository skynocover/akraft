'use client';
import React, { useCallback } from 'react';
import ImageViewer from 'react-simple-image-viewer';

export const Image = ({ imageURL }: { imageURL: string }) => {
  const [currentImage, setCurrentImage] = React.useState(0);
  const [isViewerOpen, setIsViewerOpen] = React.useState(false);

  const openImageViewer = useCallback(() => setIsViewerOpen(true), []);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };

  return (
    <>
      <img
        src={imageURL}
        onClick={() => openImageViewer()}
        className="w-full h-full max-w-full max-h-[400px] object-contain cursor-pointer"
      />

      {isViewerOpen && (
        <ImageViewer
          src={[imageURL]}
          currentIndex={currentImage}
          onClose={closeImageViewer}
          disableScroll={false}
          backgroundStyle={{ backgroundColor: 'rgba(0,0,0,0.9)' }}
          closeOnClickOutside={true}
        />
      )}
    </>
  );
};
