'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import useImageStore from '@/store/usePictureStore';
import {
  ArrowLeft,
  Camera,
  Download,
  Facebook,
  Grid3X3,
  Heart,
  ImageIcon,
  Instagram,
  Share2,
  Twitter,
  ZoomIn,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useRef, useState } from 'react';

const PhotoResult = () => {
  const { base64Images, clearBase64Images } = useImageStore();
  const router = useRouter();
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'single'>('grid');
  const [showShareModal, setShowShareModal] = useState(false);

  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const downloadPhoto = useCallback((imageData: string, index: number) => {
    const link = document.createElement('a');
    link.download = `photobooth-session-${Date.now()}-photo-${index + 1}.jpg`;
    link.href = imageData;
    link.click();
  }, []);

  const downloadAllPhotos = useCallback(() => {
    base64Images.forEach((image, index) => {
      setTimeout(() => {
        downloadPhoto(image.data, index);
      }, index * 500); // Stagger downloads
    });
  }, [base64Images, downloadPhoto]);

  const createCollage = useCallback(() => {
    if (!canvasRef.current || base64Images.length === 0) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    // Set canvas size for collage

    canvas.width = 1200;
    canvas.height = 800;
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add title
    ctx.fillStyle = 'white';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('✨ Photo Booth Session ✨', canvas.width / 2, 80);

    // Add date
    ctx.font = '24px Arial';
    ctx.fillText(new Date().toLocaleDateString(), canvas.width / 2, 120);

    const promises = base64Images.map((image, index) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const photoWidth = 300;
          const photoHeight = 200;
          const spacing = 50;
          const startX = (canvas.width - (base64Images.length * photoWidth + (base64Images.length - 1) * spacing)) / 2;
          const startY = 200;

          const x = startX + index * (photoWidth + spacing);
          const y = startY;

          // Add white border
          ctx.fillStyle = 'white';
          ctx.fillRect(x - 10, y - 10, photoWidth + 20, photoHeight + 20);

          // Draw image
          ctx.drawImage(img, x, y, photoWidth, photoHeight);

          // Add photo number
          ctx.fillStyle = 'white';
          ctx.font = 'bold 16px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(`Photo ${index + 1}`, x + photoWidth / 2, y + photoHeight + 40);

          resolve();
        };
        img.src = image.data;
      });
    });

    Promise.all(promises).then(() => {
      // Download collage
      const link = document.createElement('a');
      link.download = `photobooth-collage-${Date.now()}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.9);
      link.click();
    });
  }, [base64Images]);

  const createPhotoStrip = useCallback(() => {
    if (!canvasRef.current || base64Images.length === 0) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    // Classic photobooth strip dimensions (2:8 ratio)
    canvas.width = 400;
    canvas.height = 1600;

    // White background like real photobooth strips
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add photobooth branding at top
    ctx.fillStyle = '#333';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('✨ PHOTO BOOTH ✨', canvas.width / 2, 40);

    // Add date
    ctx.font = '16px Arial';
    ctx.fillText(new Date().toLocaleDateString(), canvas.width / 2, 65);

    // Add decorative border
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

    const promises = base64Images.slice(0, 3).map((image, index) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const photoWidth = 340;
          const photoHeight = 450;
          const spacing = 20;
          const startY = 100;

          const x = (canvas.width - photoWidth) / 2;
          const y = startY + index * (photoHeight + spacing);

          // Add subtle shadow
          ctx.fillStyle = 'rgba(0,0,0,0.1)';
          ctx.fillRect(x + 5, y + 5, photoWidth, photoHeight);

          // Draw white photo border
          ctx.fillStyle = 'white';
          ctx.fillRect(x - 5, y - 5, photoWidth + 10, photoHeight + 10);

          // Draw the photo
          ctx.drawImage(img, x, y, photoWidth, photoHeight);

          // Add photo frame
          ctx.strokeStyle = '#ddd';
          ctx.lineWidth = 1;
          ctx.strokeRect(x - 5, y - 5, photoWidth + 10, photoHeight + 10);

          resolve();
        };
        img.src = image.data;
      });
    });

    Promise.all(promises).then(() => {
      // Add bottom text
      ctx.fillStyle = '#666';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Keep this memory forever!', canvas.width / 2, canvas.height - 30);

      // Download the strip
      const link = document.createElement('a');
      link.download = `photobooth-strip-${Date.now()}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.9);
      link.click();
    });
  }, [base64Images]);

  const sharePhoto = useCallback(
    async (imageData: string, platform: string) => {
      if (navigator.share && platform === 'native') {
        try {
          const response = await fetch(imageData);
          const blob = await response.blob();
          const file = new File([blob], `photobooth-${Date.now()}.jpg`, { type: 'image/jpeg' });

          await navigator.share({
            title: 'Check out my photo booth session!',
            text: 'Amazing photos from the photo booth! ✨',
            files: [file],
          });
        } catch (error) {
          console.log('Error sharing:', error);
          downloadPhoto(imageData, 0);
        }
      } else {
        // Fallback for specific platforms
        const text = encodeURIComponent('Check out my amazing photo booth session! ✨');
        const urls = {
          twitter: `https://twitter.com/intent/tweet?text=${text}`,
          facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
          instagram: imageData, // For Instagram, we'll download the image
        };

        if (platform === 'instagram') {
          downloadPhoto(imageData, 0);
        } else {
          window.open(urls[platform as keyof typeof urls], '_blank');
        }
      }
      setShowShareModal(false);
    },
    [downloadPhoto],
  );

  const toggleFavorite = useCallback((imageId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(imageId)) {
        newFavorites.delete(imageId);
      } else {
        newFavorites.add(imageId);
      }
      return newFavorites;
    });
  }, []);

  const startNewSession = useCallback(() => {
    clearBase64Images();
    router.push('/');
  }, [clearBase64Images, router]);

  const goBack = useCallback(() => {
    router.back();
  }, [router]);

  if (base64Images.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-8 text-center">
          <ImageIcon className="w-16 h-16 mx-auto mb-4 text-white/60" />
          <h2 className="text-2xl font-bold text-white mb-4">No Photos Found</h2>
          <p className="text-white/80 mb-6">Start a new photo session to see your results here!</p>
          <Button
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
          >
            <Camera className="w-4 h-4 mr-2" />
            Start Photo Session
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button variant="ghost" onClick={goBack} className="text-white/80 hover:text-white hover:bg-white/10 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text">
              🎉 Your Photo Session
            </h1>
            <p className="text-white/80 text-lg">
              {base64Images.length}
              {' '}
              amazing photos captured •
              {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setViewMode(viewMode === 'grid' ? 'single' : 'grid')}
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              {viewMode === 'grid' ? <ImageIcon className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Action Bar */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                onClick={createPhotoStrip}
                disabled={base64Images.length === 0}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Create Photo Strip
              </Button>

              <Button
                onClick={downloadAllPhotos}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              >
                <Download className="w-4 h-4 mr-2" />
                Download All
              </Button>

              <Button
                onClick={createCollage}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                <Grid3X3 className="w-4 h-4 mr-2" />
                Create Collage
              </Button>

              <Button
                onClick={() => setShowShareModal(true)}
                className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>

              <Button
                onClick={startNewSession}
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                <Camera className="w-4 h-4 mr-2" />
                New Session
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Photo Strip Preview */}
        {base64Images.length > 0 && (
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 mb-6">
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-white mb-2">📸 Classic Photo Strip Preview</h2>
                <p className="text-white/80">Your photos arranged like a real photobooth strip!</p>
              </div>

              <div className="flex justify-center">
                <div className="bg-white p-4 rounded-lg shadow-2xl" style={{ width: '200px' }}>
                  {/* Strip Header */}
                  <div className="text-center mb-2">
                    <div className="text-sm font-bold text-gray-800">✨ PHOTO BOOTH ✨</div>
                    <div className="text-xs text-gray-600">{new Date().toLocaleDateString()}</div>
                  </div>

                  {/* Photos in strip format */}
                  <div className="space-y-2 border-2 border-gray-300 p-2">
                    {base64Images.slice(0, 3).map((image, index) => (
                      <div key={image.id} className="relative">
                        <Image
                          fill
                          src={image.data || '/placeholder.svg'}
                          alt={`Strip photo ${index + 1}`}
                          className="w-full aspect-[4/5] object-cover border border-gray-200"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Strip Footer */}
                  <div className="text-center mt-2">
                    <div className="text-xs text-gray-500">Keep this memory forever!</div>
                  </div>
                </div>
              </div>

              <div className="text-center mt-4">
                <Button
                  onClick={createPhotoStrip}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Full-Size Strip
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Photo Gallery */}
        {viewMode === 'grid' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {base64Images.map((image, index) => (
              <Card key={image.id} className="bg-white/10 backdrop-blur-lg border-white/20 group">
                <CardContent className="p-4">
                  <div className="relative aspect-video mb-4">
                    <Image
                      fill
                      src={image.data || '/placeholder.svg'}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg cursor-pointer transition-transform group-hover:scale-105"
                      onClick={() => {
                        setSelectedPhoto(index);
                        setViewMode('single');
                      }}
                    />

                    {/* Photo Actions Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => downloadPhoto(image.data, index)}
                        className="bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30"
                      >
                        <Download className="w-4 h-4" />
                      </Button>

                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => {
                          setSelectedPhoto(index);
                          setViewMode('single');
                        }}
                        className="bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </Button>

                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => toggleFavorite(image.id.toString())}
                        className={`backdrop-blur-sm border-white/30 hover:bg-white/30 ${
                          favorites.has(image.id) ? 'bg-red-500/80 text-white' : 'bg-white/20'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${favorites.has(image.id) ? 'fill-current' : ''}`} />
                      </Button>
                    </div>

                    {/* Photo Number Badge */}
                    <Badge variant="secondary" className="absolute top-2 left-2 bg-black/50 text-white border-none">
                      Photo
                      {' '}
                      {index + 1}
                    </Badge>

                    {/* Favorite Badge */}
                    {favorites.has(image.id.toString()) && (
                      <Badge
                        variant="secondary"
                        className="absolute top-2 right-2 bg-red-500/80 text-white border-none"
                      >
                        <Heart className="w-3 h-3 fill-current mr-1" />
                        Favorite
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="text-white font-semibold">
                        Photo
                        {index + 1}
                      </h3>

                      <Badge variant="outline" className="border-white/30 text-white/80">
                        {filterLabels.none}
                      </Badge>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => downloadPhoto(image.data, index)}
                        className="flex-1 bg-white/10 hover:bg-white/20 text-white border-white/30"
                        variant="outline"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>

                      <Button
                        size="sm"
                        onClick={() => sharePhoto(image.data, 'native')}
                        className="flex-1 bg-white/10 hover:bg-white/20 text-white border-white/30"
                        variant="outline"
                      >
                        <Share2 className="w-3 h-3 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Single Photo View */
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">
                  Photo
                  {' '}
                  {(selectedPhoto || 0) + 1}
                  {' '}
                  of
                  {' '}
                  {base64Images.length}
                </h2>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => setSelectedPhoto(Math.max(0, (selectedPhoto || 0) - 1))}
                    disabled={selectedPhoto === 0}
                    variant="outline"
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                  >
                    Previous
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setSelectedPhoto(Math.min(base64Images.length - 1, (selectedPhoto || 0) + 1))}
                    disabled={selectedPhoto === base64Images.length - 1}
                    variant="outline"
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                  >
                    Next
                  </Button>
                </div>
              </div>

              <div className="aspect-video mb-6">
                <Image
                  src={base64Images[selectedPhoto || 0]?.data || '/placeholder.svg'}
                  alt={`Photo ${(selectedPhoto || 0) + 1}`}
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>

              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => downloadPhoto(base64Images[selectedPhoto || 0].data, selectedPhoto || 0)}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>

                <Button
                  onClick={() => sharePhoto(base64Images[selectedPhoto || 0].data, 'native')}
                  className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>

                <Button
                  onClick={() => {
                    const selectedImage = base64Images[selectedPhoto || 0];
                    if (selectedImage && selectedImage.id !== undefined) {
                      toggleFavorite(selectedImage.id.toString());
                    }
                  }}
                  variant="outline"
                  className={`border-white/30 hover:bg-white/20 ${
                    favorites.has(base64Images[selectedPhoto || 0]?.id?.toString() || '')
                      ? 'bg-red-500/20 text-red-300 border-red-400'
                      : 'bg-white/10 text-white'
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 mr-2 ${
                      favorites.has(base64Images[selectedPhoto || 0].id) ? 'fill-current' : ''
                    }`}
                  />
                  {favorites.has(base64Images[selectedPhoto || 0].id) ? 'Favorited' : 'Add to Favorites'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Share Your Photos</h3>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <Button
                  onClick={() => sharePhoto(base64Images[0].data, 'native')}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Native Share
                </Button>

                <Button
                  onClick={() => sharePhoto(base64Images[0].data, 'twitter')}
                  className="bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600"
                >
                  <Twitter className="w-4 h-4 mr-2" />
                  Twitter
                </Button>

                <Button
                  onClick={() => sharePhoto(base64Images[0]?.data || '', 'facebook')}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  <Facebook className="w-4 h-4 mr-2" />
                  Facebook
                </Button>

                <Button
                  onClick={() => sharePhoto(base64Images[0].data, 'instagram')}
                  className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                >
                  <Instagram className="w-4 h-4 mr-2" />
                  Instagram
                </Button>
              </div>

              <Button
                onClick={() => setShowShareModal(false)}
                variant="outline"
                className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Hidden canvas for collage creation */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default PhotoResult;
