import React from 'react';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ImageViewerProps {
  isOpen: boolean;
  onClose: () => void;
  images: { src: string; alt: string; title?: string }[];
  currentIndex: number;
  onNext?: () => void;
  onPrevious?: () => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({
  isOpen,
  onClose,
  images,
  currentIndex,
  onNext,
  onPrevious,
}) => {
  const currentImage = images[currentIndex];

  if (!currentImage) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl p-0 bg-black/95 border-0">
        <div className="relative h-[90vh] flex items-center justify-center">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
          >
            <X className="w-6 h-6" />
          </Button>

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={onPrevious}
                className="absolute left-4 z-10 text-white hover:bg-white/20"
                disabled={!onPrevious}
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={onNext}
                className="absolute right-16 z-10 text-white hover:bg-white/20"
                disabled={!onNext}
              >
                <ArrowRight className="w-6 h-6" />
              </Button>
            </>
          )}

          {/* Image */}
          <img
            src={currentImage.src}
            alt={currentImage.alt}
            className="max-w-full max-h-full object-contain"
          />

          {/* Image Info */}
          {currentImage.title && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white p-4">
              <h3 className="text-lg font-semibold">{currentImage.title}</h3>
              <p className="text-sm text-gray-300">{currentImage.alt}</p>
              {images.length > 1 && (
                <p className="text-xs text-gray-400 mt-1">
                  {currentIndex + 1} of {images.length}
                </p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageViewer;
