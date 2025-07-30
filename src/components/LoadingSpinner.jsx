import React from 'react';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4';
      case 'md':
        return 'w-6 h-6';
      case 'lg':
        return 'w-8 h-8';
      case 'xl':
        return 'w-12 h-12';
      default:
        return 'w-6 h-6';
    }
  };

  return (
    <div className={`spinner ${getSizeClass()} ${className}`} />
  );
};

export const LoadingButton = ({ loading, children, className = '', ...props }) => {
  return (
    <button
      className={`btn ${className} ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
      disabled={loading}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" className="mr-2" />}
      {children}
    </button>
  );
};

export const LoadingSkeleton = ({ className = '', lines = 3 }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`skeleton-text mb-2 ${
            index === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
};

export const LoadingCard = ({ className = '' }) => {
  return (
    <div className={`card ${className}`}>
      <div className="animate-pulse">
        <div className="flex items-center space-x-4 mb-4">
          <div className="skeleton-avatar" />
          <div className="flex-1">
            <div className="skeleton-text w-1/2 mb-2" />
            <div className="skeleton-text w-3/4" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="skeleton-text" />
          <div className="skeleton-text" />
          <div className="skeleton-text w-2/3" />
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
