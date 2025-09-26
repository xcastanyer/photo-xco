"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function HomePage() {
  // const [selected, setSelected] = useState<string | null>(null);
    const [selectedPhoto, setSelectedPhoto] = useState({ id: 0, url: "" });
    const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      const res = await fetch("/api/photos");
      const data = await res.json();
      console.log(data);
       // Si data.urls ya es [{id, url}] lo dejamos, si no, lo transformamos
    const photosArray = data.urls?.map((item: string, index: number) => {
      // Si item es string, lo convertimos a {id, url}
      if (typeof item === "string") {
        return { id: index + 1, url: item };
      }
      return item; // si ya es {id, url}, lo dejamos tal cual
    }) || [];

    setPhotos(photosArray);
    };
    fetchPhotos();
  }, []);
const prevPhoto = (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
  e.stopPropagation();
  setSelectedPhoto({url:photos[(selectedPhoto.id - 2 + photos.length) % photos.length].url, id:(selectedPhoto.id - 2 + photos.length) % photos.length + 1});  
 
};
const nextPhoto = (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
  e.stopPropagation();
  setSelectedPhoto({url:photos[(selectedPhoto.id) % photos.length].url, id:(selectedPhoto.id) % photos.length + 1}    );  
 
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
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {selectedPhoto.url ? (
        <div
          className="fixed inset-0 bg-black flex items-center justify-center cursor-pointer"
          onClick={() => setSelectedPhoto({url:"", id:0})}
          onWheel={handleWheel}
        >
           {/* <button onClick={prevPhoto}>Previo</button> */}
          <Image
            src={selectedPhoto.url}
            alt="Selected photo"
            width={1600}
            height={1000}
            className="object-contain max-h-screen max-w-screen"
          />
           {/* <button onClick={nextPhoto}>Sig</button> */}

           
        </div>
      ) : (<div>
           <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        background: "#151010ff",
        padding: "2rem",
        textAlign: "center",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        Xco Photography
      </div>
        <div className="grid grid-cols-3 md:grid-cols-3 gap-4 p-6 border border-gray-700 rounded-lg" style={{ marginTop: "100px", padding: "1rem" }}>
          {photos.map((photo) => (
            <Image
              key={photo.id}
              src={photo.url}
              alt="Photo"
              width={400}
              height={300}
              className="object-cover rounded-xl cursor-pointer hover:opacity-80 transition border-5 border-gray-700"
              onClick={() => setSelectedPhoto({url:photo.url, id:photo.id})}
            />
          ))}
        </div>
     

        </div>
      )}
    </div>
  );
}
