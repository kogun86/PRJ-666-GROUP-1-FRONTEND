'use client';

import React from 'react';
import Lottie from 'lottie-react';
import loadingAnimation from '../../assets/animations/loading.json';

/**
 * LoadingAnimation - A reusable loading animation component using Lottie
 *
 * @param {Object} props - Component props
 * @param {string} props.size - Size of the animation (small, medium, large)
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Additional inline styles
 * @returns {JSX.Element} Loading animation component
 */
const LoadingAnimation = ({ size = 'medium', className = '', style = {}, ...props }) => {
  // Define sizes for different options
  const sizes = {
    small: { width: 60, height: 60 },
    medium: { width: 150, height: 150 },
    large: { width: 300, height: 300 },
  };

  // Get dimensions based on size prop
  const dimensions = sizes[size] || sizes.medium;

  return (
    <div
      className={`loading-animation ${className}`}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        ...style,
      }}
      {...props}
    >
      <Lottie
        animationData={loadingAnimation}
        loop={true}
        autoplay={true}
        style={{
          ...dimensions,
          margin: '0 auto',
        }}
      />
    </div>
  );
};

export default LoadingAnimation;
