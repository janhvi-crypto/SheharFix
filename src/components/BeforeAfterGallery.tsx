import React, { useState } from 'react';
import { Eye, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ImageViewer from './ImageViewer';

interface BeforeAfterImage {
  before: string;
  after: string;
  title: string;
  category: string;
  location: string;
  resolvedDate: string;
}

interface BeforeAfterGalleryProps {
  images: BeforeAfterImage[];
}

const BeforeAfterGallery: React.FC<BeforeAfterGalleryProps> = ({ images }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [viewerMode, setViewerMode] = useState<'before' | 'after'>('before');
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const openViewer = (index: number, mode: 'before' | 'after') => {
    setSelectedImageIndex(index);
    setViewerMode(mode);
    setIsViewerOpen(true);
  };

  const closeViewer = () => {
    setIsViewerOpen(false);
    setSelectedImageIndex(null);
  };

  const getViewerImages = () => {
    if (selectedImageIndex === null) return [];
    
    const image = images[selectedImageIndex];
    return [
      {
        src: image.before,
        alt: `Before - ${image.title}`,
        title: `Before: ${image.title}`,
      },
      {
        src: image.after,
        alt: `After - ${image.title}`,
        title: `After: ${image.title}`,
      },
    ];
  };

  const getCurrentViewerIndex = () => {
    return viewerMode === 'before' ? 0 : 1;
  };

  const handleNext = () => {
    if (viewerMode === 'before') {
      setViewerMode('after');
    } else if (selectedImageIndex !== null && selectedImageIndex < images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
      setViewerMode('before');
    }
  };

  const handlePrevious = () => {
    if (viewerMode === 'after') {
      setViewerMode('before');
    } else if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
      setViewerMode('after');
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((item, index) => (
          <Card key={index} className="card-gradient overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-2 h-48">
                <div className="relative group">
                  <img
                    src={item.before}
                    alt={`Before - ${item.title}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => openViewer(index, 'before')}
                      className="bg-white/90 text-black hover:bg-white"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                  <Badge
                    variant="secondary"
                    className="absolute top-2 left-2 bg-red-100 text-red-800"
                  >
                    Before
                  </Badge>
                </div>
                
                <div className="relative group">
                  <img
                    src={item.after}
                    alt={`After - ${item.title}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => openViewer(index, 'after')}
                      className="bg-white/90 text-black hover:bg-white"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                  <Badge
                    variant="secondary"
                    className="absolute top-2 right-2 bg-green-100 text-green-800"
                  >
                    After
                  </Badge>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm">{item.title}</h3>
                  <Badge variant="outline" className="text-xs">
                    {item.category}
                  </Badge>
                </div>
                
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>📍 {item.location}</p>
                  <p>✅ Resolved on {item.resolvedDate}</p>
                </div>
                
                <div className="flex items-center justify-between mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openViewer(index, 'before')}
                    className="text-xs"
                  >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Compare
                  </Button>
                  
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openViewer(index, 'before')}
                      className="text-xs px-2"
                    >
                      Before
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openViewer(index, 'after')}
                      className="text-xs px-2"
                    >
                      After
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedImageIndex !== null && (
        <ImageViewer
          isOpen={isViewerOpen}
          onClose={closeViewer}
          images={getViewerImages()}
          currentIndex={getCurrentViewerIndex()}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      )}
    </>
  );
};

export default BeforeAfterGallery;
