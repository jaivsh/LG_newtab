// src/hooks/useGestures.js
import { useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';

const useGestures = ({ onDoubleClick, onSwipeLeft, onSwipeRight }) => {
  const { settings } = useSettings();
  const { gestures } = settings;

  useEffect(() => {
    if (!gestures.enabled) return;

    let touchstartX = 0;
    let touchendX = 0;
    const minSwipeDistance = 100; // Minimum distance for a swipe to register
    let lastClickTime = 0;
    const doubleClickDelay = 300; // Maximum delay between clicks to register as double click

    // Double click handler
    const handleClick = (e) => {
      const currentTime = new Date().getTime();
      const timeDiff = currentTime - lastClickTime;
      
      if (timeDiff < doubleClickDelay) {
        // Double click detected
        if (onDoubleClick && gestures.doubleClickAction) {
          onDoubleClick(gestures.doubleClickAction);
          e.preventDefault();
        }
        lastClickTime = 0; // Reset to prevent triple click
      } else {
        lastClickTime = currentTime;
      }
    };

    // Touch events for swipe detection
    const handleTouchStart = (e) => {
      touchstartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e) => {
      touchendX = e.changedTouches[0].screenX;
      handleSwipe();
    };

    const handleSwipe = () => {
      const distance = touchendX - touchstartX;
      
      if (Math.abs(distance) < minSwipeDistance) return;
      
      if (distance > 0 && onSwipeRight && gestures.swipeRightAction) {
        // Swipe right detected
        onSwipeRight(gestures.swipeRightAction);
      }
      
      if (distance < 0 && onSwipeLeft && gestures.swipeLeftAction) {
        // Swipe left detected
        onSwipeLeft(gestures.swipeLeftAction);
      }
    };

    // Add event listeners
    document.addEventListener('click', handleClick);
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    // Clean up event listeners
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [gestures, onDoubleClick, onSwipeLeft, onSwipeRight]);
};

export default useGestures;