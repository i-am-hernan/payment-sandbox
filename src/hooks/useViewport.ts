// useViewport.ts
import { useState, useEffect } from "react";

interface Viewport {
  width: number | null;
  height: number | null;
}

const useViewport = (): Viewport => {
  const [viewport, setViewport] = useState<Viewport>({
    width: null,
    height: null,
  });

  useEffect(() => {
    // The check for window existence is corrected to ensure it runs only in the browser
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setViewport({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      window.addEventListener("resize", handleResize);

      // Cleanup event listener on unmount
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return viewport;
};

export default useViewport;