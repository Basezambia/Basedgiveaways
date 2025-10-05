import { useEffect, useRef } from 'react';

interface ProgressiveRevealOptions {
  delay?: number;
  stagger?: number;
  threshold?: number;
}

export const useProgressiveReveal = (options: ProgressiveRevealOptions = {}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { delay = 0, stagger = 50, threshold = 0.1 } = options;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Find all child elements that should be revealed
    const revealElements = container.querySelectorAll('[data-reveal]');
    
    if (revealElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            const index = Array.from(revealElements).indexOf(element);
            const totalDelay = delay + (index * stagger);

            // Add progressive reveal classes with staggered delays
            setTimeout(() => {
              element.classList.add('progressive-reveal');
              
              // Add specific delay class based on index
              const delayClass = `progressive-reveal-delay-${Math.min(index + 1, 4)}`;
              element.classList.add(delayClass);
              
              // Trigger the animation
              element.style.animationDelay = `${totalDelay}ms`;
            }, 0);

            // Stop observing this element once it's revealed
            observer.unobserve(element);
          }
        });
      },
      {
        threshold,
        rootMargin: '50px 0px -50px 0px'
      }
    );

    // Observe all reveal elements
    revealElements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, [delay, stagger, threshold]);

  return containerRef;
};

// Utility function to add reveal data attributes to elements
export const addRevealAttributes = (element: HTMLElement, children?: NodeListOf<Element>) => {
  if (children) {
    children.forEach((child, index) => {
      (child as HTMLElement).setAttribute('data-reveal', index.toString());
    });
  } else {
    element.setAttribute('data-reveal', '0');
  }
};