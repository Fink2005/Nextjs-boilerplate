'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import useImageStore from '@/store/usePictureStore';
import { Camera, Download, ImageIcon, Palette, Pause, Play, SwitchCamera } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import Webcam from 'react-webcam';

const modes = ['none', 'grayscale', 'sepia', 'blur', 'coolMode', 'warmMode'];

const filterLabels = {
  none: 'None',
  grayscale: 'B&W',
  sepia: 'Vintage',
  blur: 'Dreamy',
  coolMode: 'Cool',
  warmMode: 'Warm',
};

const Photobooth = () => {
  const webcamRef = React.useRef<any>(null);
  const [count, setCount] = useState<number>(-1);
  const [enoughImage, setEnoughImage] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<keyof typeof filterStyles>('none');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [showGallery, setShowGallery] = useState<boolean>(true);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number>(0);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  const router = useRouter();
  const { base64Images, addBase64Image, clearBase64Images } = useImageStore();
  const audioCount = new Audio('/assets/countdown.mp3');
  const audioTakingPicture = new Audio('/assets/takingPicture.mp3');

  // Updated filter styles with coolMode and warmMode
  const filterStyles = {
    none: 'none',
    grayscale: 'grayscale(100%)',
    sepia: 'sepia(100%)',
    blur: 'blur(3px)',
    coolMode: 'hue-rotate(100deg) saturate(100%) brightness(130%) contrast(1)',
    warmMode: 'hue-rotate(-30deg) saturate(150%) brightness(110%)',
  };

  const capture = useCallback(() => {
    if (isCapturing) {
      return;
    }

    setIsCapturing(true);
    let initialCount = 3;
    let totalCount = 9;
    setCount(initialCount);
    audioCount.play();

    const interval = setInterval(() => {
      if (totalCount + 2 === 0) {
        clearInterval(interval);
        setEnoughImage(true);
        setIsCapturing(false);
        setShowSuccessModal(true);
      }
      if (initialCount > 0) {
        audioCount.play();
        initialCount--;
        totalCount--;
        setCount(initialCount);
      } else {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
          audioTakingPicture.play();
          addBase64Image(imageSrc);
          setCurrentPhotoIndex(prev => prev + 1);
          initialCount = 4;
        }
      }
    }, 2000);
  }, [addBase64Image, isCapturing]);

  const switchCamera = useCallback(() => {
    setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'));
  }, []);

  const downloadPhoto = useCallback((imageData: string, index: number) => {
    const link = document.createElement('a');
    link.download = `photobooth-${Date.now()}-${index}.jpg`;
    link.href = imageData;
    link.click();
  }, []);

  const retakePhotos = useCallback(() => {
    // Reset everything for retaking
    clearBase64Images();
    setCount(-1);
    setEnoughImage(false);
    setIsCapturing(false);
    setCurrentPhotoIndex(0);
    setShowSuccessModal(false);
    // Clear images from store if needed
    // You might want to add a clear function to your store
  }, [clearBase64Images]);

  const proceedToResults = useCallback(() => {
    router.push('/photo-booth/photo-results');
  }, [router]);

  useEffect(() => {
    if (enoughImage && !showSuccessModal) {
      setTimeout(() => {
        router.push('/result');
      }, 1500);
    }
  }, [enoughImage, router, showSuccessModal]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text ">
            ✨ Photo Session ✨
          </h1>
          <p className="text-white/80">Get ready for your amazing photoshoot!</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Camera Section */}
          <div className="lg:col-span-2">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="p-6">
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-6">
                  <Webcam
                    className="w-full h-full object-cover"
                    imageSmoothing
                    mirrored
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{
                      facingMode,
                      width: 1280,
                      height: 720,
                    }}
                    style={{ filter: filterStyles[selectedFilter] }}
                  />

                  {/* Camera Controls Overlay */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30"
                      onClick={switchCamera}
                      disabled={isCapturing}
                    >
                      <SwitchCamera className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Countdown Overlay */}
                  {count !== -1 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-8xl font-bold text-white mb-4 animate-pulse">
                          {count === 0 ? '📸' : count}
                        </div>
                        {count === 0 && (
                          <p className="text-white text-xl">
                            Taking photo
                            {currentPhotoIndex + 1}
                            /3
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Progress Indicator */}
                  {isCapturing && (
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                        <div className="flex justify-between items-center text-white text-sm mb-2">
                          <span>Photo Session Progress</span>
                          <span>
                            {base64Images.length}
                            /3
                          </span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(base64Images.length / 3) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Filter Selection */}
                <div className="mb-6">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Filters
                  </h3>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {modes.map(mode => (
                      <Button
                        key={mode}
                        variant={selectedFilter === mode ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedFilter(mode as keyof typeof filterStyles)}
                        disabled={isCapturing}
                        className={`whitespace-nowrap ${
                          selectedFilter === mode
                            ? 'bg-gradient-to-r from-pink-500 to-purple-500 border-none'
                            : 'bg-white/10 border-white/30 text-white hover:bg-white/20'
                        }`}
                      >
                        {filterLabels[mode as keyof typeof filterLabels]}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Camera Controls */}
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={capture}
                    disabled={isCapturing || enoughImage}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white border-none px-8 disabled:opacity-50"
                  >
                    {isCapturing
                      ? (
                          <>
                            <Pause className="w-4 h-4 mr-2" />
                            Taking Photos...
                          </>
                        )
                      : enoughImage
                        ? (
                            <>
                              <Camera className="w-4 h-4 mr-2" />
                              Session Complete!
                            </>
                          )
                        : (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Start Photo Session
                            </>
                          )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gallery Section */}
          <div className="lg:col-span-1">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Captured Photos (
                    {base64Images.length}
                    /3)
                  </h3>
                  {base64Images.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowGallery(!showGallery)}
                      className="text-white/80 hover:text-white hover:bg-white/10"
                    >
                      {showGallery ? 'Hide' : 'Show'}
                    </Button>
                  )}
                </div>

                {base64Images.length === 0
                  ? (
                      <div className="text-center text-white/60 py-8">
                        <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No photos yet</p>
                        <p className="text-sm">Start your photo session!</p>
                      </div>
                    )
                  : (
                      <div className="space-y-3">
                        {showGallery
                          && base64Images.map((item, index) => (
                            <div key={item.id} className="relative group">
                              <Image
                                fill
                                src={item.data || '/placeholder.svg'}
                                alt={`Captured photo ${index + 1}`}
                                className="w-full aspect-video object-cover rounded-lg"
                                style={{ filter: filterStyles[selectedFilter] }}
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                                <Button
                                  size="icon"
                                  variant="secondary"
                                  onClick={() => downloadPhoto(item.data, index)}
                                  className="bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30"
                                >
                                  <Download className="w-4 h-4" />
                                </Button>
                              </div>
                              <Badge
                                variant="secondary"
                                className="absolute top-2 left-2 bg-black/50 text-white border-none"
                              >
                                Photo
                                {' '}
                                {index + 1}
                              </Badge>
                              <Badge
                                variant="secondary"
                                className="absolute top-2 right-2 bg-black/50 text-white border-none"
                              >
                                {filterLabels[selectedFilter]}
                              </Badge>
                            </div>
                          ))}
                      </div>
                    )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 max-w-md w-full text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-white mb-4">Photo Session Complete!</h2>
              <p className="text-white/80 mb-6">
                You've captured
                {base64Images.length}
                {' '}
                amazing photos!
              </p>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={retakePhotos}
                  variant="outline"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Retake
                </Button>

                <Button
                  onClick={proceedToResults}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-none"
                >
                  ✨ View Results
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Photobooth;
