"use client";
import Image from "next/image";
import { useEffect, useState ,useRef} from "react";

type Photo = {
  id: number;
  url: string;
};

export default function HomePage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo>({ url: "", id: 0 });
  const scrollPosition = useRef(0);

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
  setSelectedPhoto({
    url: photos[newIndex].url,
    id: newIndex + 1,
  });
};
const nextPhoto = (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
   e.stopPropagation();
  const newIndex = (selectedPhoto.id % photos.length);
  setSelectedPhoto({
    url: photos[newIndex].url,
    id: newIndex + 1,
  });
};
const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
  e.stopPropagation(); // evita que cierre el lightbox
  if (e.deltaY < 0) {
    // Rueda hacia arriba → anterior foto
    prevPhoto(e);
  } else if (e.deltaY > 0) {
    // Rueda hacia abajo → siguiente foto
    nextPhoto(e);
  }
};
  const openPhoto = (photo: Photo) => {
    // Guardar la posición actual antes de abrir
    scrollPosition.current = window.scrollY;
    setSelectedPhoto(photo);
  };
    const closePhoto = () => {
    setSelectedPhoto({ url: "", id: 0 });
    // Restaurar la posición del scroll
    window.scrollTo(0, scrollPosition.current);
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {selectedPhoto.url ? (
        <div
          className="fixed inset-0 bg-black flex items-center justify-center cursor-pointer"
          onClick={closePhoto}
          onWheel={handleWheel}
        >
           {/* <button onClick={prevPhoto}>Previo</button> */}
          <Image
            src={selectedPhoto.url}
            alt="Selected photo"
            fill
            className="object-contain max-h-screen max-w-screen"
          />
           {/* <button onClick={nextPhoto}>Sig</button> */}

           
        </div>
      ) : (<div>
           <div className="fixed top-0 left-0 w-full bg-[#151010] p-4 sm:p-8 text-center shadow-md z-10">
        Xco Photography
      </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4" style={{ marginTop: "100px", padding: "1rem" }}>
          {photos.map((photo) => (
            <Image
              key={photo.id}
              src={photo.url}
              alt="Photo"
              width={400}
              height={300}
              className="object-cover rounded-xl cursor-pointer hover:opacity-80 transition border-5 border-gray-700"
              onClick={() => openPhoto(photo)}
            />
          ))}
        </div>
     

        </div>
      )}
    </div>
  );
}
