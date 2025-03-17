// src/components/SearchBar/SearchBar.js
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useSettings } from '../../context/SettingsContext';

const SearchContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  position: relative;
`;

const SearchForm = styled.form`
  display: flex;
  align-items: center;
  background-color: ${props => props.theme.colors.background.card};
  border-radius: ${props => props.theme.borderRadius.large};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  box-shadow: ${props => props.theme.shadows.medium};
  transition: ${props => props.theme.transition.default};
  
  &:focus-within {
    box-shadow: ${props => props.theme.shadows.large};
    transform: translateY(-2px);
  }
`;

const SearchIcon = styled.div`
  color: ${props => props.theme.colors.text.secondary};
  margin-right: ${props => props.theme.spacing.sm};
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SearchInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  padding: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.text.primary};
  font-size: 1rem;
  
  &:focus {
    outline: none;
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.text.secondary};
  }
`;

const SearchButton = styled(motion.button)`
  background-color: ${props => props.theme.colors.accent};
  color: white;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.medium};
  font-weight: 500;
  border: none;
  cursor: pointer;
`;

const EngineSelector = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: ${props => props.theme.colors.background.card};
  border-radius: ${props => props.theme.borderRadius.medium};
  margin-top: ${props => props.theme.spacing.sm};
  box-shadow: ${props => props.theme.shadows.medium};
  overflow: hidden;
  z-index: 10;
`;

const EngineOption = styled.div`
  padding: ${props => props.theme.spacing.md};
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: ${props => props.theme.transition.default};
  
  &:hover {
    background-color: ${props => props.theme.colors.background.hover || props.theme.colors.background.secondary || '#f0f0f0'};
  }
  
  .engine-icon {
    width: 20px;
    height: 20px;
    margin-right: ${props => props.theme.spacing.md};
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .engine-name {
    color: ${props => props.theme.colors.text.primary};
  }
`;

// Search engine information
const SearchEngines = {
  google: {
    name: "Google",
    url: "https://www.google.com/search?q=",
    icon: "G"
  },
  bing: {
    name: "Bing",
    url: "https://www.bing.com/search?q=",
    icon: "B"
  },
  duckduckgo: {
    name: "DuckDuckGo",
    url: "https://duckduckgo.com/?q=",
    icon: "D"
  },
  yahoo: {
    name: "Yahoo",
    url: "https://search.yahoo.com/search?p=",
    icon: "Y"
  },
  ecosia: {
    name: "Ecosia",
    url: "https://www.ecosia.org/search?q=",
    icon: "E"
  }
};

const SearchBar = () => {
  // Simple localStorage-based settings if context is not available
  const getInitialEngine = () => {
    try {
      const storedEngine = localStorage.getItem('preferredSearchEngine');
      if (storedEngine && SearchEngines[storedEngine]) {
        return storedEngine;
      }
    } catch (e) {
      console.log('Error accessing localStorage:', e);
    }
    return 'google';
  };

  const [query, setQuery] = useState('');
  const [showEngines, setShowEngines] = useState(false);
  const [selectedEngine, setSelectedEngine] = useState(getInitialEngine());
  const containerRef = useRef(null);
  
  // Try to use context if available, otherwise use local state
  const settingsContext = useSettings?.();
  
  useEffect(() => {
    // Update selected engine from context if available
    if (settingsContext?.settings?.search?.engine && 
        SearchEngines[settingsContext.settings.search.engine]) {
      setSelectedEngine(settingsContext.settings.search.engine);
    }
  }, [settingsContext]);

  useEffect(() => {
    // Close engine selector when clicking outside
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowEngines(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (query.trim()) {
      // Check if query is a URL
      if (query.match(/^(http|https):\/\/[a-zA-Z0-9-_.]+\.[a-zA-Z]{2,}(\/.*)?$/)) {
        window.open(query, '_blank');
      } else {
        // Make sure we have a valid engine selected
        const engine = SearchEngines[selectedEngine] ? selectedEngine : 'google';
        const engineUrl = SearchEngines[engine].url;
        window.open(`${engineUrl}${encodeURIComponent(query)}`, '_blank');
      }
      setShowEngines(false);
    }
  };

  const handleEngineSelect = (engine) => {
    // Update the selected engine
    setSelectedEngine(engine);
    setShowEngines(false);
    
    // Save to localStorage for persistence
    try {
      localStorage.setItem('preferredSearchEngine', engine);
    } catch (e) {
      console.log('Error saving to localStorage:', e);
    }
    
    // Update context if available
    if (settingsContext?.updateSettings) {
      settingsContext.updateSettings({
        search: {
          ...settingsContext.settings?.search,
          engine
        }
      });
    }
    
    // Log for debugging
    console.log(`Search engine changed to: ${engine}`);
  };

  // Get color for each search engine
  const getEngineColor = (engine) => {
    const colors = {
      google: "#4285F4",
      bing: "#008373",
      duckduckgo: "#DE5833",
      yahoo: "#6001D2",
      ecosia: "#33A557"
    };
    return colors[engine] || "#999";
  };

  // Helper function to render search engine icon
  const renderEngineIcon = (engine) => {
    return (
      <div style={{ 
        width: "20px", 
        height: "20px", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        fontWeight: "bold",
        backgroundColor: getEngineColor(engine),
        color: "#fff",
        borderRadius: "50%",
        fontSize: "12px"
      }}>
        {SearchEngines[engine].icon}
      </div>
    );
  };

  return (
    <SearchContainer ref={containerRef}>
      <SearchForm onSubmit={handleSubmit}>
        <SearchIcon onClick={() => setShowEngines(!showEngines)}>
          {renderEngineIcon(selectedEngine)}
        </SearchIcon>
        <SearchInput
          type="text"
          placeholder={`Search with ${SearchEngines[selectedEngine].name} or enter URL`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <SearchButton
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Search
        </SearchButton>
      </SearchForm>
      
      {showEngines && (
        <EngineSelector>
          {Object.entries(SearchEngines).map(([key, engine]) => (
            <EngineOption
              key={key}
              onClick={() => handleEngineSelect(key)}
              style={{ backgroundColor: selectedEngine === key ? 
                'rgba(0,0,0,0.05)' : 'transparent' }}
            >
              <span className="engine-icon">{renderEngineIcon(key)}</span>
              <span className="engine-name">{engine.name}</span>
            </EngineOption>
          ))}
        </EngineSelector>
      )}
    </SearchContainer>
  );
};

export default SearchBar;