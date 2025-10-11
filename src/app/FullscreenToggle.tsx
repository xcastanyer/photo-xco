"use client"; // 👈 muy importante en Next.js 13+

import React, { useState, useEffect } from "react";

const FullscreenToggle: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (typeof document === "undefined") return; // seguridad SSR

    interface FullScreenElement extends HTMLElement {
      mozRequestFullScreen?: () => Promise<void>;
      webkitRequestFullscreen?: () => Promise<void>;
      msRequestFullscreen?: () => Promise<void>;
    }

    const elem = document.documentElement as FullScreenElement;

    if (!document.fullscreenElement) {
      // Entrar en fullscreen
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    } else {
      // Salir de fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
  };

  useEffect(() => {
    if (typeof document === "undefined") return;

    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  return (
    <button
      onClick={toggleFullscreen}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow"
    >
      {isFullscreen ? "Salir de pantalla completa" : "Ir a pantalla completa"}
    </button>
  );
};

export default FullscreenToggle;
