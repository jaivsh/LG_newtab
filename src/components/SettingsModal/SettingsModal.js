import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../../context/SettingsContext';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled(motion.div)`
  background-color: ${props => props.theme.colors.background.card};
  border-radius: ${props => props.theme.borderRadius.medium};
  width: 90%;
  max-width: 800px;
  height: 80vh;
  max-height: 700px;
  box-shadow: ${props => props.theme.shadows.large};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  padding: ${props => props.theme.spacing.md};
  border-bottom: 1px solid ${props => props.theme.colors.secondary};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.theme.colors.text.secondary};
  font-size: 1.5rem;
  
  &:hover {
    color: ${props => props.theme.colors.text.primary};
  }
`;

const ModalBody = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const Sidebar = styled.div`
  width: 200px;
  border-right: 1px solid ${props => props.theme.colors.secondary};
  padding: ${props => props.theme.spacing.md};
  overflow-y: auto;
`;

const SidebarItem = styled.div`
  padding: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.xs};
  border-radius: ${props => props.theme.borderRadius.small};
  cursor: pointer;
  transition: ${props => props.theme.transition.default};
  color: ${props => props.active ? props.theme.colors.accent : props.theme.colors.text.secondary};
  background-color: ${props => props.active ? `${props.theme.colors.accent}20` : 'transparent'};
  
  &:hover {
    background-color: ${props => props.active ? `${props.theme.colors.accent}20` : props.theme.colors.secondary};
  }
`;

const Content = styled.div`
  flex: 1;
  padding: ${props => props.theme.spacing.md};
  overflow-y: auto;
`;

const Section = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const SectionTitle = styled.h3`
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.md};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${props => props.theme.spacing.xs};
  color: ${props => props.theme.colors.text.secondary};
`;

const Select = styled.select`
  width: 100%;
  padding: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.small};
  border: 1px solid ${props => props.theme.colors.secondary};
  background-color: ${props => props.theme.colors.background.main};
  color: ${props => props.theme.colors.text.primary};
`;

const ColorPicker = styled.input`
  width: 100%;
  height: 40px;
  border: 1px solid ${props => props.theme.colors.secondary};
  border-radius: ${props => props.theme.borderRadius.small};
  background-color: ${props => props.theme.colors.background.main};
`;

const Range = styled.input`
  width: 100%;
  background-color: ${props => props.theme.colors.background.main};
`;

const Button = styled.button`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.small};
  background-color: ${props => props.primary ? props.theme.colors.accent : props.theme.colors.background.card};
  color: ${props => props.primary ? props.theme.colors.text.white : props.theme.colors.text.primary};
  border: 1px solid ${props => props.primary ? props.theme.colors.accent : props.theme.colors.secondary};
  cursor: pointer;
  transition: ${props => props.theme.transition.default};
  
  &:hover {
    background-color: ${props => props.primary ? props.theme.colors.accentHover : props.theme.colors.secondary};
  }
`;

const Checkbox = styled.input`
  margin-right: ${props => props.theme.spacing.sm};
`;

const DialogOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
`;

const DialogContent = styled(motion.div)`
  background-color: ${props => props.theme.colors.background.card};
  border-radius: ${props => props.theme.borderRadius.medium};
  width: 90%;
  max-width: 400px;
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.large};
`;

const DialogTitle = styled.h3`
  color: ${props => props.theme.colors.text.primary};
  margin-top: 0;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const DialogText = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const DialogActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${props => props.theme.spacing.md};
`;

const SettingsModal = ({ onClose }) => {
  const { settings, updateSettings, resetSettings, clearSearchHistory } = useSettings() || {};
  const [activeTab, setActiveTab] = useState('background');
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  
  useEffect(() => {
    if (!settings) {
      console.error('Settings not available in the context');
    }
  }, [settings]);

  const tabs = [
    { id: 'background', label: 'Background' },
    { id: 'search', label: 'Search' },
    { id: 'appearance', label: 'Appearance' },
    { id: 'gestures', label: 'Gestures' },
  ];

  const handleUpdateSettings = (section, updates) => {
    if (updateSettings) {
      updateSettings(section, updates);
    } else {
      console.error('updateSettings function not available');
    }
  };

  const handleResetSettings = () => {
    if (resetSettings) {
      resetSettings();
      setShowResetConfirmation(false);
    } else {
      console.error('resetSettings function not available');
    }
  };

  const handleClearSearchHistory = () => {
    if (clearSearchHistory) {
      clearSearchHistory();
    } else {
      console.error('clearSearchHistory function not available');
    }
  };

  const handleTabClick = (tabId, e) => {
    e.stopPropagation();
    setActiveTab(tabId);
  };

  // Simple getter function that always uses the latest context settings
  const getSetting = (path, defaultValue) => {
    if (!settings) return defaultValue;
    return path.split('.').reduce((acc, key) => {
      return (acc && Object.prototype.hasOwnProperty.call(acc, key)) ? acc[key] : defaultValue;
    }, settings);
  };

  return (
    <AnimatePresence>
      <ModalOverlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <ModalContent
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          onClick={e => e.stopPropagation()}
        >
          <ModalHeader>
            <Title>Settings</Title>
            <CloseButton onClick={e => { e.stopPropagation(); onClose(); }}>
              ×
            </CloseButton>
          </ModalHeader>
          
          <ModalBody>
            <Sidebar>
              {tabs.map(tab => (
                <SidebarItem
                  key={tab.id}
                  active={activeTab === tab.id}
                  onClick={e => handleTabClick(tab.id, e)}
                  data-tab={tab.id}
                >
                  {tab.label}
                </SidebarItem>
              ))}
              <SidebarItem onClick={e => { e.stopPropagation(); setShowResetConfirmation(true); }}>
                Reset All
              </SidebarItem>
            </Sidebar>
            
            <Content>
              {activeTab === 'background' && (
                <Section>
                  <SectionTitle>Background Settings</SectionTitle>
                  
                  <FormGroup>
                    <Label htmlFor="backgroundType">Background Type</Label>
                    <Select
                      id="backgroundType"
                      value={getSetting('background.type', 'particles')}
                      onChange={e => handleUpdateSettings('background', { type: e.target.value })}
                    >
                      <option value="particles">Particles</option>
                      <option value="waves">Waves</option>
                      <option value="galaxy">Galaxy</option>
                      <option value="color">Solid Color</option>
                    </Select>
                  </FormGroup>
                  
                  <FormGroup>
                    <Label htmlFor="backgroundColor">Background Color</Label>
                    <ColorPicker
                      type="color"
                      id="backgroundColor"
                      value={getSetting('background.color', '#202225')}
                      onChange={e => handleUpdateSettings('background', { color: e.target.value })}
                    />
                  </FormGroup>
                  
                  {getSetting('background.type', '') === 'particles' && (
                    <FormGroup>
                      <Label htmlFor="particleCount">
                        Particle Count: {getSetting('background.particleCount', 50)}
                      </Label>
                      <Range
                        type="range"
                        id="particleCount"
                        min="10"
                        max="200"
                        value={getSetting('background.particleCount', 50)}
                        onChange={e => handleUpdateSettings('background', { particleCount: parseInt(e.target.value, 10) })}
                      />
                    </FormGroup>
                  )}
                  
                  {getSetting('background.type', '') === 'waves' && (
                    <FormGroup>
                      <Label htmlFor="waveSpeed">
                        Wave Speed: {getSetting('background.waveSpeed', 5)}
                      </Label>
                      <Range
                        type="range"
                        id="waveSpeed"
                        min="1"
                        max="10"
                        value={getSetting('background.waveSpeed', 5)}
                        onChange={e => handleUpdateSettings('background', { waveSpeed: parseInt(e.target.value, 10) })}
                      />
                    </FormGroup>
                  )}
                  
                  {getSetting('background.type', '') === 'galaxy' && (
                    <FormGroup>
                      <Label htmlFor="galaxyDensity">Galaxy Density</Label>
                      <Select
                        id="galaxyDensity"
                        value={getSetting('background.galaxyDensity', 'medium')}
                        onChange={e => handleUpdateSettings('background', { galaxyDensity: e.target.value })}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </Select>
                    </FormGroup>
                  )}
                </Section>
              )}
              
              {activeTab === 'search' && (
                <Section>
                  <SectionTitle>Search Settings</SectionTitle>
                  
                  <FormGroup>
                    <Label htmlFor="searchEngine">Default Search Engine</Label>
                    <Select
                      id="searchEngine"
                      value={getSetting('search.engine', 'google')}
                      onChange={e => handleUpdateSettings('search', { engine: e.target.value })}
                    >
                      <option value="google">Google</option>
                      <option value="bing">Bing</option>
                      <option value="duckduckgo">DuckDuckGo</option>
                      <option value="yahoo">Yahoo</option>
                    </Select>
                  </FormGroup>
                  
                  {getSetting('search.searchHistory', []).length > 0 && (
                    <FormGroup>
                      <Label>Search History</Label>
                      <div>
                        {getSetting('search.searchHistory', []).map((query, index) => (
                          <div key={index}>{query}</div>
                        ))}
                      </div>
                      <Button onClick={e => { e.stopPropagation(); handleClearSearchHistory(); }}>
                        Clear Search History
                      </Button>
                    </FormGroup>
                  )}
                </Section>
              )}
              
              {activeTab === 'appearance' && (
                <Section>
                  <SectionTitle>Appearance Settings</SectionTitle>
                  
                  <FormGroup>
                    <Label htmlFor="theme">Theme</Label>
                    <Select
                      id="theme"
                      value={getSetting('appearance.theme', 'dark')}
                      onChange={e => handleUpdateSettings('appearance', { theme: e.target.value })}
                    >
                      <option value="dark">Dark</option>
                      <option value="light">Light</option>
                      <option value="auto">Auto (System)</option>
                    </Select>
                  </FormGroup>
                  
                  <FormGroup>
                    <Label htmlFor="fontFamily">Font Family</Label>
                    <Select
                      id="fontFamily"
                      value={getSetting('appearance.fontFamily', 'Inter, sans-serif')}
                      onChange={e => handleUpdateSettings('appearance', { fontFamily: e.target.value })}
                    >
                      <option value="Inter, sans-serif">Inter</option>
                      <option value="Roboto, sans-serif">Roboto</option>
                      <option value="'Open Sans', sans-serif">Open Sans</option>
                      <option value="'SF Pro Display', sans-serif">SF Pro</option>
                      <option value="monospace">Monospace</option>
                    </Select>
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>
                      <Checkbox
                        type="checkbox"
                        checked={getSetting('appearance.clock24Hour', false)}
                        onChange={e => handleUpdateSettings('appearance', { clock24Hour: e.target.checked })}
                      />
                      Use 24-hour clock
                    </Label>
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>
                      <Checkbox
                        type="checkbox"
                        checked={getSetting('appearance.showDate', true)}
                        onChange={e => handleUpdateSettings('appearance', { showDate: e.target.checked })}
                      />
                      Show date
                    </Label>
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>
                      <Checkbox
                        type="checkbox"
                        checked={getSetting('appearance.showWeather', true)}
                        onChange={e => handleUpdateSettings('appearance', { showWeather: e.target.checked })}
                      />
                      Show weather
                    </Label>
                  </FormGroup>
                  
                  {getSetting('appearance.showWeather', false) && (
                    <FormGroup>
                      <Label htmlFor="weatherUnit">Weather Unit</Label>
                      <Select
                        id="weatherUnit"
                        value={getSetting('appearance.weatherUnit', 'celsius')}
                        onChange={e => handleUpdateSettings('appearance', { weatherUnit: e.target.value })}
                      >
                        <option value="celsius">Celsius</option>
                        <option value="fahrenheit">Fahrenheit</option>
                      </Select>
                    </FormGroup>
                  )}
                </Section>
              )}
              
              {activeTab === 'gestures' && (
                <Section>
                  <SectionTitle>Gesture Settings</SectionTitle>
                  
                  <FormGroup>
                    <Label>
                      <Checkbox
                        type="checkbox"
                        checked={getSetting('gestures.enabled', true)}
                        onChange={e => handleUpdateSettings('gestures', { enabled: e.target.checked })}
                      />
                      Enable gesture controls
                    </Label>
                  </FormGroup>
                  
                  {getSetting('gestures.enabled', false) && (
                    <>
                      <FormGroup>
                        <Label htmlFor="doubleClickAction">Double-Click Action</Label>
                        <Select
                          id="doubleClickAction"
                          value={getSetting('gestures.doubleClickAction', 'open-settings')}
                          onChange={e => handleUpdateSettings('gestures', { doubleClickAction: e.target.value })}
                        >
                          <option value="open-settings">Open Settings</option>
                          <option value="open-search">Open Search</option>
                          <option value="refresh-page">Refresh Page</option>
                        </Select>
                      </FormGroup>
                      
                      <FormGroup>
                        <Label htmlFor="swipeLeftAction">Swipe Left Action</Label>
                        <Select
                          id="swipeLeftAction"
                          value={getSetting('gestures.swipeLeftAction', 'next-page')}
                          onChange={e => handleUpdateSettings('gestures', { swipeLeftAction: e.target.value })}
                        >
                          <option value="next-page">Next Page</option>
                          <option value="open-menu">Open Menu</option>
                          <option value="close-tab">Close Tab</option>
                        </Select>
                      </FormGroup>
                      
                      <FormGroup>
                        <Label htmlFor="swipeRightAction">Swipe Right Action</Label>
                        <Select
                          id="swipeRightAction"
                          value={getSetting('gestures.swipeRightAction', 'previous-page')}
                          onChange={e => handleUpdateSettings('gestures', { swipeRightAction: e.target.value })}
                        >
                          <option value="previous-page">Previous Page</option>
                          <option value="go-back">Go Back</option>
                          <option value="show-favorites">Show Favorites</option>
                        </Select>
                      </FormGroup>
                      
                      <FormGroup>
                        <Label htmlFor="pinchAction">Pinch Action</Label>
                        <Select
                          id="pinchAction"
                          value={getSetting('gestures.pinchAction', 'zoom')}
                          onChange={e => handleUpdateSettings('gestures', { pinchAction: e.target.value })}
                        >
                          <option value="zoom">Zoom</option>
                          <option value="reset-view">Reset View</option>
                        </Select>
                      </FormGroup>
                    </>
                  )}
                </Section>
              )}
            </Content>
          </ModalBody>
        </ModalContent>
      </ModalOverlay>

      {showResetConfirmation && (
        <DialogOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowResetConfirmation(false)}
        >
          <DialogContent
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <DialogTitle>Reset All Settings</DialogTitle>
            <DialogText>
              Are you sure you want to reset all settings to their default values? This action cannot be undone.
            </DialogText>
            <DialogActions>
              <Button onClick={() => setShowResetConfirmation(false)}>
                Cancel
              </Button>
              <Button primary onClick={handleResetSettings}>
                Reset All
              </Button>
            </DialogActions>
          </DialogContent>
        </DialogOverlay>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;
