// src/components/QuickActions/QuickActions.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const QuickActionsContainer = styled.div`
  margin: ${props => props.theme.spacing.lg} auto;
  width: 100%;
  max-width: 800px;
`;

const SectionTitle = styled.h2`
  font-size: 1rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.spacing.md};
  font-weight: 500;
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: ${props => props.theme.spacing.md};
`;

const SearchEnginesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.md};
`;

const ActionButton = styled(motion.button)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.background.card};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: ${props => props.theme.spacing.md};
  cursor: pointer;
  transition: ${props => props.theme.transition.default};
  
  &:hover {
    background-color: ${props => props.theme.colors.secondary};
  }
`;

const ActionIcon = styled.div`
  font-size: 1.5rem;
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const ActionLabel = styled.span`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.text.secondary};
  text-align: center;
`;

const SearchEngineButton = styled(motion.button)`
  display: flex;
  align-items: center;
  background-color: ${props => props.active ? props.theme.colors.accent : props.theme.colors.background.card};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  cursor: pointer;
  transition: ${props => props.theme.transition.default};
  
  &:hover {
    background-color: ${props => props.active ? props.theme.colors.accent : props.theme.colors.secondary};
    transform: translateY(-2px);
  }
`;

const SearchEngineLogo = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${props => props.theme.spacing.sm};
  font-size: 1.2rem;
`;

const SearchEngineName = styled.span`
  font-size: 0.9rem;
  color: ${props => props.active ? 'white' : props.theme.colors.text.primary};
`;

const QuickActions = ({ onSearchEngineChange }) => {
  const [activeSearchEngine, setActiveSearchEngine] = useState('google');
  
  const searchEngines = [
    { id: 'google', name: 'Google', icon: '🔍', url: 'https://www.google.com/search?q=' },
    { id: 'bing', name: 'Bing', icon: '🔎', url: 'https://www.bing.com/search?q=' },
    { id: 'duckduckgo', name: 'DuckDuckGo', icon: '🦆', url: 'https://duckduckgo.com/?q=' },
    { id: 'yahoo', name: 'Yahoo', icon: '📨', url: 'https://search.yahoo.com/search?p=' }
  ];
  
  const quickActions = [
    { id: 'weather', name: 'Weather', icon: '🌤️', action: () => window.open('https://weather.com', '_blank') },
    { id: 'news', name: 'News', icon: '📰', action: () => window.open('https://news.google.com', '_blank') },
    { id: 'translate', name: 'Translate', icon: '🌐', action: () => window.open('https://translate.google.com', '_blank') },
    { id: 'maps', name: 'Maps', icon: '🗺️', action: () => window.open('https://maps.google.com', '_blank') },
    { id: 'youtube', name: 'YouTube', icon: '▶️', action: () => window.open('https://youtube.com', '_blank') },
    { id: 'mail', name: 'Email', icon: '✉️', action: () => window.open('https://gmail.com', '_blank') },
    { id: 'calendar', name: 'Calendar', icon: '📅', action: () => window.open('https://calendar.google.com', '_blank') },
    { id: 'docs', name: 'Documents', icon: '📄', action: () => window.open('https://docs.google.com', '_blank') }
  ];
  
  const handleSearchEngineChange = (engineId) => {
    setActiveSearchEngine(engineId);
    const selectedEngine = searchEngines.find(engine => engine.id === engineId);
    onSearchEngineChange(selectedEngine);
  };
  
  return (
    <QuickActionsContainer>
      <SectionTitle>Quick Actions</SectionTitle>
      <ActionGrid>
        {quickActions.map(action => (
          <ActionButton
            key={action.id}
            onClick={action.action}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <ActionIcon>{action.icon}</ActionIcon>
            <ActionLabel>{action.name}</ActionLabel>
          </ActionButton>
        ))}
      </ActionGrid>
      
      <SectionTitle style={{ marginTop: '24px' }}>Search With</SectionTitle>
      <SearchEnginesGrid>
        {searchEngines.map(engine => (
          <SearchEngineButton
            key={engine.id}
            active={activeSearchEngine === engine.id}
            onClick={() => handleSearchEngineChange(engine.id)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <SearchEngineLogo>{engine.icon}</SearchEngineLogo>
            <SearchEngineName active={activeSearchEngine === engine.id}>{engine.name}</SearchEngineName>
          </SearchEngineButton>
        ))}
      </SearchEnginesGrid>
    </QuickActionsContainer>
  );
};

export default QuickActions;