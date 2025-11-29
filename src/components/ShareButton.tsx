'use client';

import { useState } from 'react';

interface ShareButtonProps {
  portfolioId: string;
  colors?: {
    primary: string;
    secondary: string;
    highlight: string;
  };
}

export default function ShareButton({ portfolioId, colors }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = `${window.location.origin}/portfolio/${portfolioId}`;
    
    try {
      // Try using the Web Share API if available (mobile devices)
      if (navigator.share) {
        await navigator.share({
          title: 'Check out my portfolio',
          url: url,
        });
      } else {
        // Fallback to copying to clipboard
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      // If user cancels the share dialog, don't show error
      if (error instanceof Error && error.name !== 'AbortError') {
        // Fallback to clipboard if share fails
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (clipboardError) {
          console.error('Failed to copy to clipboard:', clipboardError);
        }
      }
    }
  };

  const getButtonColor = () => {
    if (copied) {
      return '#10b981'; // green-600 for copied state
    }
    return colors?.highlight || '#F59E0B';
  };

  const getHoverColor = () => {
    if (copied) {
      return '#059669'; // green-700 for copied hover
    }
    // Create a darker version of highlight color
    if (colors?.highlight) {
      // Simple darkening by reducing RGB values
      const hex = colors.highlight.replace('#', '');
      const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - 20);
      const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - 20);
      const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - 20);
      return `rgb(${r}, ${g}, ${b})`;
    }
    return '#D97706'; // amber-700 as fallback
  };

  return (
    <button
      onClick={handleShare}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full px-6 py-3 text-white shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
      style={{
        backgroundColor: getButtonColor(),
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = getHoverColor();
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = getButtonColor();
      }}
      aria-label="Share portfolio"
    >
      {copied ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
      )}
      <span className="font-semibold">{copied ? 'Copied!' : 'Share'}</span>
    </button>
  );
}

