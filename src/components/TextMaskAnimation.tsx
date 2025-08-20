'use client';

import { useEffect, useRef } from 'react';

interface TextMaskAnimationProps {
  text: string;
  delay?: number;
  className?: string;
  fromLeft?: boolean;
}

export default function TextMaskAnimation({ 
  text, 
  delay = 0, 
  className = "",
  fromLeft = true
}: TextMaskAnimationProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const currentElement = elementRef.current;
    
    if (!currentElement) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            currentElement.classList.add('animate');
            // 一度アニメーションが開始したら監視を解除
            if (observerRef.current) {
              observerRef.current.unobserve(currentElement);
            }
          }
        });
      },
      {
        threshold: 0.1, // 10%が見えたらアニメーション開始
      }
    );

    observerRef.current.observe(currentElement);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div 
      ref={elementRef}
      className={`relative ${className}`}
      style={{
        opacity: 1,
        transform: 'translateY(0)',
        transition: `all 0.6s ease-out ${delay}s`
      }}
    >
      <p className="relative z-10">
        {text}
      </p>
      <div
        className={`absolute inset-0 bg-[#EEEEEE] z-20 ${fromLeft ? 'text-mask-left' : 'text-mask-right'}`}
      />
    </div>
  );
}