// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useLinks } from '../context/LinksContext';
import { useSettings } from '../context/SettingsContext';
import Clock from '../components/Clock/Clock';
import SearchBar from '../components/SearchBar/SearchBar';
import LinkCard from '../components/LinkCard/LinkCard';
import AddLinkModal from '../components/AddLinkModal/AddLinkModal';
import SettingsModal from '../components/SettingsModal/SettingsModal';
import Background from '../components/Background/Background';
import useGestures from '../hooks/useGestures';

const DashboardContainer = styled.div`
  min-height: 100vh;
  padding: ${props => props.theme.spacing.lg};
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.theme.colors.text.primary};
  span {
    color: ${props => props.theme.colors.accent};
  }
`;

const LinksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.xl};
`;

const AddButton = styled(motion.button)`
  position: fixed;
  bottom: ${props => props.theme.spacing.lg};
  right: ${props => props.theme.spacing.lg};
  width: 60px;
  height: 60px;
  border-radius: ${props => props.theme.borderRadius.round};
  background-color: ${props => props.theme.colors.accent};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  box-shadow: ${props => props.theme.shadows.medium};
  transition: ${props => props.theme.transition.default};
  &:hover {
    transform: scale(1.05);
    background-color: ${props => props.theme.colors.highlight};
  }
`;

const SettingsButton = styled(motion.button)`
  position: fixed;
  bottom: ${props => props.theme.spacing.lg};
  left: ${props => props.theme.spacing.lg};
  width: 60px;
  height: 60px;
  border-radius: ${props => props.theme.borderRadius.round};
  background-color: ${props => props.theme.colors.secondary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: ${props => props.theme.shadows.medium};
  transition: ${props => props.theme.transition.default};
  &:hover {
    transform: scale(1.05);
    background-color: ${props => props.theme.colors.text.secondary};
  }
`;

// Custom style element to inject custom CSS and JS from settings
const CustomCode = ({ css, js }) => {
  useEffect(() => {
    // Inject custom JS if provided
    if (js) {
      try {
        // Create a function from the string and execute it
        new Function(js)();
      } catch (error) {
        console.error("Error executing custom JS:", error);
      }
    }
  }, [js]);

  // Return style element with custom CSS if provided
  return css ? <style dangerouslySetInnerHTML={{ __html: css }} /> : null;
};

const Dashboard = () => {
  const { links, addLink, removeLink, editLink } = useLinks();
  const { settings } = useSettings();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  // Calculate how many items per page based on settings and screen size
  const itemsPerPage = settings.layout.columns === 'auto' ? 12 : parseInt(settings.layout.columns) * 2;
  const totalPages = Math.ceil(links.length / itemsPerPage);
  
  // Get sorted links based on settings
  const getSortedLinks = () => {
    let sortedLinks = [...links];
    
    if (settings.layout.sortBy === 'alphabetical') {
      sortedLinks.sort((a, b) => a.title.localeCompare(b.title));
    } else if (settings.layout.sortBy === 'most-used') {
      sortedLinks.sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0));
    }
    
    // Paginate links
    return sortedLinks.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
  };

  // Handle gesture actions
  const handleDoubleClickAction = (action) => {
    if (action === 'open-settings') {
      setIsSettingsModalOpen(true);
    } else if (action === 'new-link') {
      setIsAddModalOpen(true);
    } else if (action === 'refresh') {
      window.location.reload();
    }
  };

  const handleSwipeLeftAction = (action) => {
    if (action === 'next-page' && currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    } else if (action === 'previous-page' && currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    } else if (action === 'open-settings') {
      setIsSettingsModalOpen(true);
    }
  };

  const handleSwipeRightAction = (action) => {
    if (action === 'previous-page' && currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    } else if (action === 'next-page' && currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    } else if (action === 'open-settings') {
      setIsSettingsModalOpen(true);
    }
  };

// src/pages/Dashboard.js (continued)

  // Initialize gesture support
  useGestures({
    onDoubleClick: handleDoubleClickAction,
    onSwipeLeft: handleSwipeLeftAction,
    onSwipeRight: handleSwipeRightAction
  });

  // Create background based on settings
  const backgroundType = settings.background.animated ? settings.background.type : 'color';
  
  return (
    <>
      {/* Render background based on settings */}
      {backgroundType === 'color' ? (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: settings.background.color,
          zIndex: -1
        }} />
      ) : (
        <Background type={backgroundType} />
      )}
      
      {/* Inject custom CSS and JS from settings */}
      <CustomCode 
        css={settings.advanced.customCSS}
        js={settings.advanced.customJS}
      />
      
      <DashboardContainer>
        <Header>
          <Logo>Liquid <span>Galaxy</span> Tab by Jaivardhan Shukla</Logo>
          <Clock 
            format24={settings.appearance.clock24Hour} 
            showDate={settings.appearance.showDate}
            showWeather={settings.appearance.showWeather}
            weatherUnit={settings.appearance.weatherUnit}
          />
        </Header>
        
        <SearchBar 
          engine={settings.search.engine}
          openInNewTab={settings.search.openInNewTab}
        />
        
        <LinksGrid style={{
          gridTemplateColumns: settings.layout.columns === 'auto' 
            ? 'repeat(auto-fill, minmax(200px, 1fr))' 
            : `repeat(${settings.layout.columns}, 1fr)`
        }}>
          {getSortedLinks().map(link => (
            <LinkCard
              key={link.id}
              link={link}
              onDelete={removeLink}
              onEdit={editLink}
            />
          ))}
        </LinksGrid>
        
        {/* Pagination indicators if we have multiple pages */}
        {totalPages > 1 && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            marginTop: '2rem',
            gap: '0.5rem'
          }}>
            {Array.from({ length: totalPages }).map((_, index) => (
              <div 
                key={index}
                onClick={() => setCurrentPage(index)}
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: currentPage === index ? '#5865F2' : '#4f545c',
                  cursor: 'pointer'
                }}
              />
            ))}
          </div>
        )}
        
        <AddButton
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAddModalOpen(true)}
        >
          +
        </AddButton>
        
        <SettingsButton
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsSettingsModalOpen(true)}
        >
          ⚙️
        </SettingsButton>
        
        {isAddModalOpen && (
          <AddLinkModal
            onClose={() => setIsAddModalOpen(false)}
            onAdd={addLink}
          />
        )}
        
        {isSettingsModalOpen && (
          <SettingsModal
            onClose={() => setIsSettingsModalOpen(false)}
          />
        )}
      </DashboardContainer>
    </>
  );
};

export default Dashboard;