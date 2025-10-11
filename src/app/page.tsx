"use client";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion"; // 👈 Importa esto
import FullscreenToggle from "./FullscreenToggle";

type Photo = {
  id: number;
  url: string;
};

export default function HomePage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo>({ url: "", id: 0 });
  const scrollPosition = useRef(0);


  // 👉 Ocultar scroll al abrir imagen
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

  useEffect(() => {
    const fetchPhotos = async () => {
      const res = await fetch("/api/photos");
      const data = await res.json();
      setPhotos(data.urls || []);
    };
    fetchPhotos();
  }, []);
  const prevPhoto = (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
    e.stopPropagation();
    const newIndex = (selectedPhoto.id - 2 + photos.length) % photos.length;
    setSelectedPhoto({ url: photos[newIndex].url, id: newIndex + 1 });
  };
  const nextPhoto = (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
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
    <div className="flex flex-col items-center justify-center min-h-screen overflow-hidden">
      <AnimatePresence>
        {selectedPhoto.url && (
          <motion.div
            key="lightbox"
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center cursor-pointer z-50"
            onClick={closePhoto}
            onWheel={handleWheel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
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
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              background: "#000000ff",
              padding: "1rem",
              textAlign: "center",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              fontFamily: "Arial, sans-serif",
              fontSize: "1.5rem",
              color: "white",
              zIndex: 1000,
            }}
          >
            Xco Photography
            <div style={{ textAlign: "right" }}>
              <FullscreenToggle />
            </div>
          </div>

          <div
            className="grid grid-cols-3 md:grid-cols-3 gap-4 p-6 border-gray-700 rounded-lg"
            style={{ marginTop: "50px", padding: "3rem" }}
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
                  className="object-contain rounded-xl cursor-pointer hover:opacity-30 transition border-4 border-indigo-500 shadow-lg m-4 p-4"
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
