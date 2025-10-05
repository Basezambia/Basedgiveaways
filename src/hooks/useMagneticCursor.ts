import { useEffect, useRef } from 'react';

interface MagneticOptions {
  strength?: number;
  distance?: number;
  duration?: number;
}

// Generic hook that can be used for any element type
export const useMagneticCursor = <T extends HTMLElement = HTMLElement>(options: MagneticOptions = {}) => {
  const elementRef = useRef<T>(null);
  const { strength = 0.3, distance = 100, duration = 300 } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    let isHovering = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distanceFromCenter = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distanceFromCenter < distance) {
        const magneticX = deltaX * strength;
        const magneticY = deltaY * strength;
        
        element.style.setProperty('--magnetic-x', `${magneticX}px`);
        element.style.setProperty('--magnetic-y', `${magneticY}px`);
        
        if (!isHovering) {
          element.classList.add('animate-magnetic');
          isHovering = true;
        }
      } else if (isHovering) {
        element.style.setProperty('--magnetic-x', '0px');
        element.style.setProperty('--magnetic-y', '0px');
        element.classList.remove('animate-magnetic');
        isHovering = false;
      }
    };

    const handleMouseLeave = () => {
      if (!element) return;
      
      element.style.setProperty('--magnetic-x', '0px');
      element.style.setProperty('--magnetic-y', '0px');
      element.classList.remove('animate-magnetic');
      isHovering = false;
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength, distance, duration]);

  return elementRef;
};