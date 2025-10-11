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

  // Control del scroll
  useEffect(() => {
    if (selectedPhoto.url) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "auto";
    }
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

  // Navegación entre fotos
  const prevPhoto = () => {
    const newIndex = (selectedPhoto.id - 2 + photos.length) % photos.length;
    setSelectedPhoto({ url: photos[newIndex].url, id: newIndex + 1 });
  };

  const nextPhoto = () => {
    const newIndex = selectedPhoto.id % photos.length;
    setSelectedPhoto({ url: photos[newIndex].url, id: newIndex + 1 });
  };

  // Desplazamiento con el ratón
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (e.deltaY < 0) prevPhoto();
    else if (e.deltaY > 0) nextPhoto();
  };

  // Gestos táctiles (para móvil)
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    const deltaY = touchStartY.current - touchEndY.current;
    if (Math.abs(deltaY) > 50) {
      if (deltaY > 0) nextPhoto(); // desliza hacia arriba → siguiente foto
      else prevPhoto(); // desliza hacia abajo → anterior foto
    }
  };

  // Abrir/cerrar foto
  const openPhoto = (photo: Photo) => {
    scrollPosition.current = window.scrollY;
    setSelectedPhoto(photo);
  };

  const closePhoto = () => {
    setSelectedPhoto({ url: "", id: 0 });
    window.scrollTo(0, scrollPosition.current);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen overflow-hidden">
      <AnimatePresence>
        {selectedPhoto.url && (
          <motion.div
            key="lightbox"
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center cursor-pointer z-50 p-2"
            onClick={closePhoto}
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <Image
                src={selectedPhoto.url}
                alt="Selected photo"
                width={1600}
                height={1000}
                className="object-contain max-h-screen max-w-screen rounded-xl shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!selectedPhoto.url && (
        <div>
          {/* Header fijo */}
          <div
            className="fixed top-0 left-0 w-full bg-black text-white shadow-md p-4 flex flex-col md:flex-row justify-between items-center z-50"
          >
            <div className="text-center text-xl md:text-2xl font-semibold tracking-wide">
              Xco Photography
            </div>
            <div className="mt-2 md:mt-0">
              <FullscreenToggle />
            </div>
          </div>

          {/* Galería de fotos */}
          <div
            className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 md:p-10 border-gray-700 rounded-lg mt-20"
          >
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
                  className="object-contain rounded-xl cursor-pointer hover:opacity-40 transition border-4 border-indigo-500 shadow-lg m-2 p-2"
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
