'use client';

import React, { useEffect } from 'react';
import Lottie from 'lottie-react';
import introAnimation from '../../assets/animations/intro.json';

/**
 * IntroAnimation - A component for displaying an intro animation
 *
 * @param {Object} props - Component props
 * @param {Function} props.onComplete - Callback function to execute when animation completes
 * @param {string} props.size - Size of the animation (small, medium, large)
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Additional inline styles
 * @returns {JSX.Element} Intro animation component
 */
const IntroAnimation = ({ onComplete, size = 'large', className = '', style = {}, ...props }) => {
  // Define sizes for different options
  const sizes = {
    small: { width: 120, height: 120 },
    medium: { width: 240, height: 240 },
    large: { width: 450, height: 450 },
    fullscreen: { width: '100vw', height: '100vh' },
  };

  // Get dimensions based on size prop
  const dimensions = sizes[size] || sizes.large;

  // Set up animation completion callback
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete && typeof onComplete === 'function') {
        onComplete();
      }
    }, 1000); // Animation will show for 1 second

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`intro-animation ${className}`}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#52796f',
        zIndex: 9999,
        ...style,
      }}
      {...props}
    >
      <Lottie
        animationData={introAnimation}
        loop={false}
        autoplay={true}
        style={{
          ...dimensions,
          margin: '0 auto',
        }}
      />
    </div>
  );
};

export default IntroAnimation;
