import { useState, useEffect, useRef } from 'react';

/**
 * Hook to smoothly animate a marker between GPS coordinates.
 * @param {Array} targetPosition [lat, lng] The true backend position.
 * @param {number} durationMs Animation duration in milliseconds.
 */
export const useSmoothMarker = (targetPosition, durationMs = 3000) => {
  const [currentPosition, setCurrentPosition] = useState(targetPosition);
  const animationRef = useRef(null);
  const prevTargetRef = useRef(targetPosition);
  const startPosRef = useRef(targetPosition);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (!targetPosition) return;

    // Check if target has actually changed
    if (prevTargetRef.current && 
        prevTargetRef.current[0] === targetPosition[0] && 
        prevTargetRef.current[1] === targetPosition[1]) {
      return; 
    }

    // Capture where we are currently to start the new animation from here
    startPosRef.current = currentPosition || targetPosition;
    prevTargetRef.current = targetPosition;
    startTimeRef.current = performance.now();

    const animate = (time) => {
      const elapsed = time - startTimeRef.current;
      let timeFraction = elapsed / durationMs;
      
      if (timeFraction > 1) timeFraction = 1;

      // Linear interpolation or easeInOut
      // For continuous GPS updates, Linear is often smoother as it prevents 
      // the "speed up - slow down" feel between markers.
      const progress = timeFraction; 

      const lat = startPosRef.current[0] + (targetPosition[0] - startPosRef.current[0]) * progress;
      const lng = startPosRef.current[1] + (targetPosition[1] - startPosRef.current[1]) * progress;

      setCurrentPosition([lat, lng]);

      if (timeFraction < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [targetPosition, durationMs]);

  return currentPosition;
};
