import React from 'react';

interface LoaderProps {
  type?: 'spinner' | 'dots' | 'pulse' | 'skeleton';
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  text?: string;
  fullScreen?: boolean;
}

const Loader = ({ 
  type = 'spinner', 
  size = 'md', 
  color = '#3B82F6', 
  text = 'Loading...', 
  fullScreen = false 
}: LoaderProps) => {
  
  // Size values in pixels
  const sizeMap = {
    sm: { container: 16, dot: 6, text: 'text-sm' },
    md: { container: 24, dot: 8, text: 'text-base' },
    lg: { container: 40, dot: 10, text: 'text-lg' },
  };
  
  const selectedSize = sizeMap[size];

  // Container styles
  const containerClasses = `flex flex-col items-center justify-center gap-3 ${
    fullScreen ? 'fixed inset-0 bg-white/80 dark:bg-gray-900/80 z-50' : ''
  }`;

  const renderLoader = () => {
    switch (type) {
      case 'spinner':
        return (
          <div 
            className="animate-spin rounded-full border-t-transparent" 
            style={{ 
              width: `${selectedSize.container}px`, 
              height: `${selectedSize.container}px`,
              borderWidth: `${Math.max(2, selectedSize.container / 8)}px`,
              borderStyle: 'solid',
              borderColor: color,
              borderTopColor: 'transparent'
            }}
          />
        );
        
      case 'dots':
        return (
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="animate-bounce"
                style={{
                  width: `${selectedSize.dot}px`,
                  height: `${selectedSize.dot}px`,
                  borderRadius: '50%',
                  backgroundColor: color,
                  animationDelay: `${i * 0.15}s`
                }}
              />
            ))}
          </div>
        );
        
      case 'pulse':
        return (
          <div 
            className="animate-pulse rounded-full" 
            style={{ 
              width: `${selectedSize.container}px`, 
              height: `${selectedSize.container}px`,
              backgroundColor: color
            }}
          />
        );
        
      case 'skeleton':
        return (
          <div className="w-full max-w-md animate-pulse space-y-4">
            <div className="h-3 bg-slate-700 rounded w-3/4"></div>
            <div className="h-3 bg-slate-700 rounded"></div>
            <div className="h-3 bg-slate-700 rounded w-5/6"></div>
            <div className="h-3 bg-slate-700 rounded w-1/2"></div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className={containerClasses}>
      {renderLoader()}
      {text && type !== 'skeleton' && (
        <p className={`${selectedSize.text} text-slate-400 dark:text-slate-300 font-medium`}>
          {text}
        </p>
      )}
    </div>
  );
};

export default Loader;