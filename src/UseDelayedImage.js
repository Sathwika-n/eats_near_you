import { useState, useEffect } from "react";

// Custom hook to delay image loading
const useDelayedImage = (src, delay) => {
  const [delayedSrc, setDelayedSrc] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDelayedSrc(src);
    }, delay);

    // Cleanup the timer when the component unmounts or src changes
    return () => clearTimeout(timer);
  }, [src, delay]);

  return delayedSrc;
};

export default useDelayedImage;
