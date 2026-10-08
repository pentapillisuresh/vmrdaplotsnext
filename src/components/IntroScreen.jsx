"use client";

import { useEffect, useState } from "react";

export default function IntroScreen() {
  const [showIntro, setShowIntro] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const completed = localStorage.getItem("vmrdaIntroCompleted");

    if (completed !== "true") {
      setShowIntro(true);
    }
  }, []);

  const handleSkip = () => {
    localStorage.setItem("vmrdaIntroCompleted", "true");
    setShowIntro(false);
  };

  if (!mounted || !showIntro) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[999999]
        w-screen
        h-[100dvh]
        overflow-hidden
        bg-black
      "
    >
      {/* =========================================
          RESPONSIVE IMAGE
          ========================================= */}
      <picture className="absolute inset-0 block w-full h-full">
        {/* Mobile */}
        <source
          media="(max-width: 639px)"
          srcSet="/images/mobilesplash.png"
        />

        {/* Laptop / Desktop */}
        <img
          src="/images/splashbanner4.jpeg"
          alt="VMRDA Plots"
          className="
            absolute
            inset-0
            block
            w-full
            h-full
            object-fill
            select-none
            pointer-events-none
          "
        />
      </picture>

      {/* =========================================
          SKIP BUTTON - TOP LEFT
          ========================================= */}
      <button
        type="button"
        onClick={handleSkip}
        className="
          absolute
          z-[1000000]

          left-3
          top-3

          sm:left-5
          sm:top-5

          md:left-7
          md:top-7

          px-4
          py-2

          sm:px-5
          sm:py-2.5

          md:px-6
          md:py-3

          rounded-full

          border
          border-white/70

          bg-black/40
          hover:bg-black/60

          text-white

          text-sm
          sm:text-base

          font-medium

          backdrop-blur-sm

          shadow-lg

          transition-all
          duration-200

          active:scale-95
        "
      >
        Skip
      </button>
    </div>
  );
}