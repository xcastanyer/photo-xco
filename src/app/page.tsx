"use client";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FullscreenToggle from "./FullscreenToggle";

type Photo = {
  id: number;
  url: string;
};

export default function HomePage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo>({ url: "", id: 0 });
  const scrollPosition = useRef(0);

  // Ocultar scroll al abrir imagen
  useEffect(() => {
    document.body.style.overflowY = selectedPhoto.url ? "hidden" : "auto";
    return () => {
      document.body.style.overflowY = "auto";
    };
  }, [selectedPhoto]);

  // Cargar fotos
  useEffect(() => {
    const fetchPhotos = async () => {
      const res = await fetch("/api/photos");
      const data = await res.json();
      setPhotos(data.urls || []);
    };
    fetchPhotos();
  }, []);

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIndex = (selectedPhoto.id - 2 + photos.length) % photos.length;
    setSelectedPhoto({ url: photos[newIndex].url, id: newIndex + 1 });
  };

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIndex = selectedPhoto.id % photos.length;
    setSelectedPhoto({ url: photos[newIndex].url, id: newIndex + 1 });
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (e.deltaY < 0) prevPhoto(e);
    else if (e.deltaY > 0) nextPhoto(e);
  };

  const openPhoto = (photo: Photo) => {
    scrollPosition.current = window.scrollY;
    setSelectedPhoto(photo);
  };

  const closePhoto = () => {
    setSelectedPhoto({ url: "", id: 0 });
    window.scrollTo(0, scrollPosition.current);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white overflow-hidden">
      <AnimatePresence>
        {selectedPhoto.url && (
          <motion.div
            key="lightbox"
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center cursor-pointer z-50 p-2"
            onClick={closePhoto}
            onWheel={handleWheel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="max-w-full max-h-full flex justify-center items-center"
            >
              <Image
                src={selectedPhoto.url}
                alt="Selected photo"
                width={1600}
                height={1000}
                className="object-contain rounded-2xl shadow-2xl max-h-[90vh] max-w-[95vw]"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!selectedPhoto.url && (
        <div className="w-full">
          {/* Header fijo */}
          <div className="fixed top-0 left-0 w-full bg-black bg-opacity-95 px-4 sm:px-6 py-2 sm:py-3 text-center shadow-md z-50">
            <div className="flex justify-between items-center">
              <h1 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-wide">
                Xco Photography
              </h1>
              <div className="scale-90 sm:scale-100">
                <FullscreenToggle />
              </div>
            </div>
          </div>

          {/* Galería */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 px-3 sm:px-6 py-20 sm:py-24">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-black"
              >
                <Image
                  src={photo.url}
                  alt="Photo"
                  width={600}
                  height={500}
                  className="object-cover w-full h-full rounded-xl cursor-pointer hover:opacity-70 transition-all duration-300 border border-indigo-500 sm:border-2 shadow-md sm:shadow-lg"
                  onClick={() => openPhoto(photo)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
