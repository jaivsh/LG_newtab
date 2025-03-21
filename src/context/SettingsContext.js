// src/context/SettingsContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const defaultSettings = {
    background: {
      type: 'particles', // 'particles', 'waves', 'galaxy', or 'color'
      color: '#202225',
      animated: true,
      particleCount: 50,
      waveSpeed: 5,
      galaxyDensity: 'medium',
    },
    search: {
      engine: 'google', // 'google', 'bing', 'duckduckgo', 'yahoo'
      openInNewTab: true,
      searchHistory: [],
      autoComplete: true,
    },
    appearance: {
      theme: 'dark', // 'dark', 'light', 'auto'
      clock24Hour: false,
      showDate: true,
      showWeather: true,
      weatherUnit: 'celsius', // 'celsius' or 'fahrenheit'
      fontFamily: 'Inter, sans-serif',
      fontSize: 'medium', // 'small', 'medium', 'large'
      cornerRadius: 'medium', // 'none', 'small', 'medium', 'large'
    },
    layout: {
      columns: 'auto', // 'auto', '3', '4', '5', etc.
      sortBy: 'custom', // 'custom', 'alphabetical', 'most-used'
      density: 'comfortable', // 'compact', 'comfortable', 'spacious'
      showFavorites: true,
      maxItemsPerPage: 12,
    },
    gestures: {
      enabled: true,
      doubleClickAction: 'open-settings', // 'open-settings', 'open-search', 'refresh-page'
      swipeLeftAction: 'next-page', // 'next-page', 'open-menu', 'close-tab'
      swipeRightAction: 'previous-page', // 'previous-page', 'go-back', 'show-favorites'
      pinchAction: 'zoom', // 'zoom', 'reset-view'
    },
    advanced: {
      customCSS: '',
      customJS: '',
      enableDevTools: false,
      experimentalFeatures: false,
      dataSync: {
        enabled: false,
        syncFrequency: 'daily', // 'hourly', 'daily', 'weekly'
      },
    }
  };

  // Initialize settings from local storage or default
  const [storageSettings, setStorageSettings] = useLocalStorage('galaxyTabSettings', defaultSettings);
  
  // State for tracking active settings
  const [activeSettings, setActiveSettings] = useState(storageSettings);
  
  // Apply settings effects
  useEffect(() => {
    // Apply background settings
    applyBackgroundSettings(activeSettings.background);
    
    // Apply theme
    applyThemeSettings(activeSettings.appearance);
    
    // Apply custom CSS
    applyCustomCSS(activeSettings.advanced?.customCSS || '');
    
    // Apply custom JS
    applyCustomJS(activeSettings.advanced?.customJS || '');
    
    // Save to local storage
    setStorageSettings(activeSettings);
  }, [activeSettings, setStorageSettings]);
  
  // Function to apply background settings
  const applyBackgroundSettings = (bgSettings) => {
    if (!bgSettings) return;
    
    const { type, color, animated } = bgSettings;
    const body = document.body;
    
    // Reset all background classes first
    body.classList.remove('bg-particles', 'bg-waves', 'bg-galaxy', 'bg-color');
    body.classList.add(`bg-${type}`);
    
    // Apply color
    document.documentElement.style.setProperty('--bg-color', color);
    
    // Apply animation state
    if (animated) {
      body.classList.add('animated');
    } else {
      body.classList.remove('animated');
    }
    
    // Apply specific settings based on type
    switch (type) {
      case 'particles':
        document.documentElement.style.setProperty('--particle-count', bgSettings.particleCount);
        break;
      case 'waves':
        document.documentElement.style.setProperty('--wave-speed', bgSettings.waveSpeed);
        break;
      case 'galaxy':
        document.documentElement.style.setProperty('--galaxy-density', bgSettings.galaxyDensity);
        break;
      default:
        break;
    }
  };
  
  // Function to apply theme settings
  const applyThemeSettings = (appearanceSettings) => {
    if (!appearanceSettings) return;
    
    const { theme, fontFamily, fontSize, cornerRadius } = appearanceSettings;
    
    // Apply theme
    document.documentElement.setAttribute('data-theme', theme);
    
    // Auto theme based on user preference
    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
    
    // Apply font settings
    document.documentElement.style.setProperty('--font-family', fontFamily);
    document.documentElement.style.setProperty('--font-size', fontSize);
    document.documentElement.style.setProperty('--corner-radius', cornerRadius);
  };
  
  // Function to apply custom CSS
  const applyCustomCSS = (css) => {
    let styleElement = document.getElementById('galaxy-tab-custom-css');
    
    if (!styleElement && css) {
      styleElement = document.createElement('style');
      styleElement.id = 'galaxy-tab-custom-css';
      document.head.appendChild(styleElement);
    }
    
    if (styleElement) {
      styleElement.textContent = css;
    }
  };
  
  // Function to apply custom JS
  const applyCustomJS = (js) => {
    if (!js) return;
    
    try {
      // Using Function constructor to evaluate JS safely
      const customFunction = new Function(js);
      customFunction();
    } catch (error) {
      console.error('Error executing custom JS:', error);
    }
  };

  // Function to update settings
  const updateSettings = (section, updates) => {
    console.log(`Updating settings for section ${section}:`, updates);
    
    setActiveSettings(prev => {
      // Create a deep copy to ensure full update
      const newSettings = JSON.parse(JSON.stringify(prev));
      
      // Update the specific section
      newSettings[section] = {
        ...newSettings[section],
        ...updates,
      };
      
      console.log("New settings:", newSettings);
      return newSettings;
    });
  };

  // Function to reset settings
  const resetSettings = () => {
    console.log('Resetting settings to default');
    setActiveSettings(JSON.parse(JSON.stringify(defaultSettings)));
  };
  
  // Get search URL based on engine
  const getSearchUrl = (query) => {
    const { engine } = activeSettings.search;
    const encodedQuery = encodeURIComponent(query);
    
    switch (engine) {
      case 'bing':
        return `https://www.bing.com/search?q=${encodedQuery}`;
      case 'duckduckgo':
        return `https://duckduckgo.com/?q=${encodedQuery}`;
      case 'yahoo':
        return `https://search.yahoo.com/search?p=${encodedQuery}`;
      case 'google':
      default:
        return `https://www.google.com/search?q=${encodedQuery}`;
    }
  };
  
  // Add search to history
  const addToSearchHistory = (query) => {
    if (!query.trim()) return;
    
    updateSettings('search', {
      searchHistory: [
        query,
        ...activeSettings.search.searchHistory.filter(item => item !== query).slice(0, 9)
      ]
    });
  };
  
  // Clear search history
  const clearSearchHistory = () => {
    updateSettings('search', { searchHistory: [] });
  };
  
  // Toggle experimental features
  const toggleExperimentalFeatures = () => {
    updateSettings('advanced', { 
      experimentalFeatures: !activeSettings.advanced.experimentalFeatures 
    });
  };

  return (
    <SettingsContext.Provider 
      value={{ 
        settings: activeSettings, 
        updateSettings, 
        resetSettings,
        getSearchUrl,
        addToSearchHistory,
        clearSearchHistory,
        toggleExperimentalFeatures
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};