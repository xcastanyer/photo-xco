"use client"; // 👈 muy importante en Next.js 13+

import React, { useState, useEffect } from "react";

const FullscreenToggle: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Definimos las interfaces extendidas para navegadores antiguos
  interface FullscreenDocument extends Document {
    mozCancelFullScreen?: () => Promise<void>;
    webkitExitFullscreen?: () => Promise<void>;
    msExitFullscreen?: () => Promise<void>;
    webkitFullscreenElement?: Element | null;
    mozFullScreenElement?: Element | null;
    msFullscreenElement?: Element | null;
  }

  interface FullScreenElement extends HTMLElement {
    mozRequestFullScreen?: () => Promise<void>;
    webkitRequestFullscreen?: () => Promise<void>;
    msRequestFullscreen?: () => Promise<void>;
  }

  const toggleFullscreen = () => {
    if (typeof document === "undefined") return; // seguridad SSR

    const elem = document.documentElement as FullScreenElement;
    const doc = document as FullscreenDocument;

    const isCurrentlyFullscreen =
      doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement;

    if (!isCurrentlyFullscreen) {
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
      if (doc.exitFullscreen) {
        doc.exitFullscreen();
      } else if (doc.mozCancelFullScreen) {
        doc.mozCancelFullScreen();
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen();
      }
    }
  };

  useEffect(() => {
    if (typeof document === "undefined") return;

    const handleChange = () => {
      const doc = document as FullscreenDocument;
      const isNowFullscreen =
        !!(doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement);
      setIsFullscreen(isNowFullscreen);
    };

    document.addEventListener("fullscreenchange", handleChange);
    document.addEventListener("webkitfullscreenchange", handleChange);
    document.addEventListener("mozfullscreenchange", handleChange);
    document.addEventListener("MSFullscreenChange", handleChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleChange);
      document.removeEventListener("webkitfullscreenchange", handleChange);
      document.removeEventListener("mozfullscreenchange", handleChange);
      document.removeEventListener("MSFullscreenChange", handleChange);
    };
  }, []);

  return (
    <button
      onClick={toggleFullscreen}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
    >
      {isFullscreen ? "Salir de pantalla completa" : "Ir a pantalla completa"}
    </button>
  );
};

export default FullscreenToggle;
