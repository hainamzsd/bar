import React from 'react';
import { Button } from '@/components/ui/button'; // Assuming you're using your custom Button component
import { PuffLoader } from 'react-spinners';

interface LoadingButtonProps {
  isLoading: boolean;
  content: string;
  loadingText?: string; // Optional prop for loading text, with a default value
  className?: string; // Allow passing custom class names
  disabled?: boolean; // Allow overriding disabled state
  onClick?: () => void; // Optional onClick handler if needed
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading,
  content,
  loadingText = 'Loading...',
  className = '',
  disabled = false,
  onClick,
}) => {
  return (
    <Button
      type="submit"
      className={`w-full ${className}`} // Use passed className and default to w-full
      disabled={disabled || isLoading} // Disable button if loading or explicitly disabled
      onClick={onClick} // Optional onClick handler
    >
      {isLoading ? (
        <div className="flex items-center justify-center space-x-2">
          <PuffLoader color="hsl(var(--secondary))" size={20} /> {/* Spinner */}
          <span>{loadingText}</span> {/* Text while loading */}
        </div>
      ) : (
        content
      )}
    </Button>
  );
};

export default LoadingButton;
