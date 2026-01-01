'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'

interface ShowreelImage {
  id: string
  media_type: 'image' | 'video'
  image_url: string
  image_alt: string | null
  title: string | null
  description: string | null
}

interface ShowreelCarouselProps {
  isOpen: boolean
  onClose: () => void
}

export function ShowreelCarousel({ isOpen, onClose }: ShowreelCarouselProps) {
  const [images, setImages] = useState<ShowreelImage[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const thumbnailContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      fetchShowreelImages()
    }
  }, [isOpen])

  // Reset video when index changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load()
    }
  }, [currentIndex])

  // Auto-scroll thumbnail container to show active thumbnail
  useEffect(() => {
    if (thumbnailContainerRef.current && images.length > 0) {
      const container = thumbnailContainerRef.current
      const thumbnailWidth = 80 + 12 // 80px width + 12px gap (gap-3)
      const scrollPosition = currentIndex * thumbnailWidth - container.clientWidth / 2 + thumbnailWidth / 2
      
      container.scrollTo({
        left: Math.max(0, scrollPosition),
        behavior: 'smooth'
      })
    }
  }, [currentIndex, images.length])

  const fetchShowreelImages = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/showreel')
      const result = await response.json()
      if (result.success && result.data) {
        setImages(result.data)
        setCurrentIndex(0)
      }
    } catch (error) {
      console.error('Error fetching showreel images:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
      }
      if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
      }
      if (e.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, images.length, onClose])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Close carousel"
        >
          <X size={24} />
        </button>

        {/* Carousel Container */}
        <div
          className="relative w-full h-full max-w-7xl mx-auto px-4 py-16 flex flex-col items-center justify-center"
          onClick={(e) => {
            // Only stop propagation if clicking outside the video controls
            const target = e.target as HTMLElement
            if (!target.closest('video') && !target.closest('button')) {
              e.stopPropagation()
            }
          }}
        >
          {isLoading ? (
            <div className="text-white text-lg">Loading images...</div>
          ) : images.length === 0 ? (
            <div className="text-white text-lg">No images available</div>
          ) : (
            <>
              {/* Main Media (Image or Video) */}
              <div className={`relative w-full mb-6 ${
                images[currentIndex].media_type === 'video' 
                  ? 'h-[70vh] max-h-[700px]' 
                  : 'h-[80vh] max-h-[800px]'
              }`}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                    className={`relative w-full h-full rounded-2xl overflow-hidden ${
                      images[currentIndex].media_type === 'video' ? 'bg-black' : ''
                    }`}
                    onClick={(e) => {
                      // Don't stop propagation for video controls
                      if (images[currentIndex].media_type === 'video') {
                        const target = e.target as HTMLElement
                        if (target.tagName === 'VIDEO' || target.closest('video')) {
                          return // Let video handle its own clicks
                        }
                      }
                      e.stopPropagation()
                    }}
                  >
                    {images[currentIndex].media_type === 'video' ? (
                      <video
                        ref={videoRef}
                        src={images[currentIndex].image_url}
                        controls
                        autoPlay
                        loop
                        playsInline
                        className="w-full h-full object-contain pointer-events-auto"
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onClick={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                      >
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <Image
                        src={images[currentIndex].image_url}
                        alt={images[currentIndex].image_alt || images[currentIndex].title || 'Showreel image'}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 90vw"
                        priority
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        goToPrevious()
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-sm z-20 pointer-events-auto"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        goToNext()
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-sm z-20 pointer-events-auto"
                      aria-label="Next image"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}

                {/* Image Info - Only show for images, not videos (to avoid covering video controls) */}
                {images[currentIndex].media_type === 'image' && (images[currentIndex].title || images[currentIndex].description) && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-2xl pointer-events-none">
                    {images[currentIndex].title && (
                      <h3 className="text-white text-xl font-semibold mb-2">
                        {images[currentIndex].title}
                      </h3>
                    )}
                    {images[currentIndex].description && (
                      <p className="text-white/80 text-sm">
                        {images[currentIndex].description}
                      </p>
                    )}
                  </div>
                )}
                
                {/* Video Info - Show above video, not over controls */}
                {images[currentIndex].media_type === 'video' && (images[currentIndex].title || images[currentIndex].description) && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-6 rounded-t-2xl pointer-events-none">
                    {images[currentIndex].title && (
                      <h3 className="text-white text-xl font-semibold mb-2">
                        {images[currentIndex].title}
                      </h3>
                    )}
                    {images[currentIndex].description && (
                      <p className="text-white/80 text-sm">
                        {images[currentIndex].description}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Thumbnail Navigation */}
              {images.length > 1 && (
                <div 
                  ref={thumbnailContainerRef}
                  className={`flex gap-3 overflow-x-auto max-w-full px-4 hide-scrollbar ${
                    images[currentIndex].media_type === 'video' 
                      ? 'pb-8 mt-4' 
                      : 'pb-4'
                  }`}
                >
                  {images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={(e) => {
                        e.stopPropagation()
                        goToSlide(index)
                      }}
                      className={`flex-shrink-0 relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all pointer-events-auto z-30 ${
                        index === currentIndex
                          ? 'border-[#E87842] scale-110'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      {image.media_type === 'video' ? (
                        <div className="relative w-full h-full bg-gray-800 flex items-center justify-center">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <svg
                              className="w-8 h-8 text-white"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      ) : (
                        <Image
                          src={image.image_url}
                          alt={image.image_alt || image.title || `Thumbnail ${index + 1}`}
                          fill
                          className="object-cover pointer-events-none"
                          sizes="80px"
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Image Counter */}
              {images.length > 1 && (
                <div className="text-white/80 text-sm mt-4">
                  {currentIndex + 1} / {images.length}
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

