// src/context/SettingsContext.js
import React, { createContext, useState, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  // Default settings
  const defaultSettings = {
    background: {
      type: 'particles', // 'particles', 'waves', 'galaxy', or 'color'
      color: '#202225',
      animated: true,
    },
    search: {
      engine: 'google', // 'google', 'bing', 'duckduckgo', 'yahoo'
      openInNewTab: true,
    },
    appearance: {
      theme: 'dark', // 'dark', 'light', 'auto'
      clock24Hour: false,
      showDate: true,
      showWeather: true,
      weatherUnit: 'celsius', // 'celsius' or 'fahrenheit'
    },
    layout: {
      columns: 'auto', // 'auto', '3', '4', '5', etc.
      sortBy: 'custom', // 'custom', 'alphabetical', 'most-used'
    },
    gestures: {
      enabled: true,
      doubleClickAction: 'open-settings',
      swipeLeftAction: 'next-page',
      swipeRightAction: 'previous-page',
    },
    advanced: {
      customCSS: '',
      customJS: '',
    }
  };

  const [settings, setSettings] = useLocalStorage('galaxyTabSettings', defaultSettings);

  const updateSettings = (section, updates) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...updates,
      },
    }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};