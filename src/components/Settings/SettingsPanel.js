// src/components/Settings/SettingsPanel.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import useLocalStorage from '../../hooks/useLocalStorage';

// Styled Components
const SettingsOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: flex-end;
  z-index: 1000;
`;

const SettingsContainer = styled(motion.div)`
  width: 400px;
  height: 100%;
  background-color: ${props => props.theme.colors.background.card};
  box-shadow: ${props => props.theme.shadows.large};
  padding: 0;
  overflow-y: auto;
`;

const SettingsHeader = styled.div`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  background-color: ${props => props.theme.colors.primary};
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const SettingsTitle = styled.h2`
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
  font-size: 1.5rem;
`;

const CloseButton = styled.button`
  background: none;
  color: ${props => props.theme.colors.text.secondary};
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: ${props => props.theme.spacing.xs};
  border-radius: ${props => props.theme.borderRadius.round};
  transition: ${props => props.theme.transition.default};
  
  &:hover {
    color: ${props => props.theme.colors.text.primary};
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const SettingsContent = styled.div`
  padding: ${props => props.theme.spacing.lg};
`;

const SettingsSection = styled.section`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const SectionTitle = styled.h3`
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.md};
  padding-bottom: ${props => props.theme.spacing.xs};
  border-bottom: 1px solid ${props => props.theme.colors.secondary};
`;

const SettingOption = styled.div`
  margin-bottom: ${props => props.theme.spacing.md};
`;

const OptionLabel = styled.label`
  display: block;
  margin-bottom: ${props => props.theme.spacing.xs};
  color: ${props => props.theme.colors.text.primary};
  font-weight: 500;
`;

const OptionDescription = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  font-size: 0.85rem;
  margin-top: 0;
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const SelectInput = styled.select`
  width: 100%;
  padding: ${props => props.theme.spacing.sm};
  background-color: ${props => props.theme.colors.background.main};
  color: ${props => props.theme.colors.text.primary};
  border: 1px solid ${props => props.theme.colors.secondary};
  border-radius: ${props => props.theme.borderRadius.small};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.accent};
  }
`;

const TextInput = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.sm};
  background-color: ${props => props.theme.colors.background.main};
  color: ${props => props.theme.colors.text.primary};
  border: 1px solid ${props => props.theme.colors.secondary};
  border-radius: ${props => props.theme.borderRadius.small};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.accent};
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  color: ${props => props.theme.colors.text.primary};
`;

const Checkbox = styled.input`
  margin-right: ${props => props.theme.spacing.sm};
  cursor: pointer;
  width: 18px;
  height: 18px;
`;

const ColorPickerContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  flex-wrap: wrap;
  margin-top: ${props => props.theme.spacing.sm};
`;

const ColorOption = styled.div`
  width: 36px;
  height: 36px;
  border-radius: ${props => props.theme.borderRadius.round};
  background-color: ${props => props.color};
  cursor: pointer;
  border: 3px solid ${props => props.isSelected ? props.theme.colors.accent : 'transparent'};
  transition: ${props => props.theme.transition.default};
  
  &:hover {
    transform: scale(1.1);
  }
`;

const BackgroundPreview = styled.div`
  width: 100%;
  height: 120px;
  border-radius: ${props => props.theme.borderRadius.medium};
  overflow: hidden;
  margin-top: ${props => props.theme.spacing.sm};
  background-image: url(${props => props.backgroundUrl});
  background-size: cover;
  background-position: center;
  box-shadow: ${props => props.theme.shadows.small};
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.colors.secondary};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const TabButton = styled.button`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: none;
  border: none;
  color: ${props => props.isActive ? props.theme.colors.accent : props.theme.colors.text.secondary};
  font-weight: ${props => props.isActive ? '600' : '400'};
  border-bottom: 2px solid ${props => props.isActive ? props.theme.colors.accent : 'transparent'};
  transition: ${props => props.theme.transition.default};
  
  &:hover {
    color: ${props => props.isActive ? props.theme.colors.accent : props.theme.colors.text.primary};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${props => props.theme.spacing.sm};
  margin-top: ${props => props.theme.spacing.lg};
`;

const Button = styled.button`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.small};
  font-weight: 500;
  transition: ${props => props.theme.transition.default};
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const ResetButton = styled(Button)`
  background-color: transparent;
  color: ${props => props.theme.colors.text.secondary};
  border: 1px solid ${props => props.theme.colors.secondary};
  
  &:hover {
    color: ${props => props.theme.colors.text.primary};
    border-color: ${props => props.theme.colors.text.primary};
  }
`;

const SaveButton = styled(Button)`
  background-color: ${props => props.theme.colors.accent};
  color: white;
  border: none;
  
  &:hover {
    background-color: ${props => props.theme.colors.highlight};
  }
`;

// Background options
const backgroundOptions = [
  { 
    id: 'solid', 
    name: 'Solid Color', 
    preview: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2400&auto=format&fit=crop'
  },
  { 
    id: 'gradient', 
    name: 'Gradient', 
    preview: 'https://images.unsplash.com/photo-1579546929662-711aa81148cf?q=80&w=2370&auto=format&fit=crop' 
  },
  { 
    id: 'image', 
    name: 'Image', 
    preview: 'https://images.unsplash.com/photo-1518050947974-4be8c7469f0c?q=80&w=2371&auto=format&fit=crop' 
  },
  { 
    id: 'unsplash', 
    name: 'Unsplash Random', 
    preview: 'https://images.unsplash.com/photo-1464802686167-b939a6910659?q=80&w=2450&auto=format&fit=crop' 
  },
  { 
    id: '3d', 
    name: '3D Particles', 
    preview: 'https://images.unsplash.com/photo-1603366615917-1fa6dad5c4fa?q=80&w=2370&auto=format&fit=crop' 
  },
  { 
    id: 'waves', 
    name: 'Animated Waves', 
    preview: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=2487&auto=format&fit=crop' 
  }
];

// Search engine options
const searchEngines = [
  { id: 'google', name: 'Google', url: 'https://www.google.com/search?q=' },
  { id: 'bing', name: 'Bing', url: 'https://www.bing.com/search?q=' },
  { id: 'duckduckgo', name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=' },
  { id: 'yahoo', name: 'Yahoo', url: 'https://search.yahoo.com/search?p=' },
  { id: 'ecosia', name: 'Ecosia', url: 'https://www.ecosia.org/search?q=' },
  { id: 'custom', name: 'Custom', url: '' }
];

// Theme color options
const themeColors = [
  { id: 'default', color: '#5865F2' }, // Discord blurple
  { id: 'red', color: '#ED4245' },
  { id: 'green', color: '#57F287' },
  { id: 'yellow', color: '#FEE75C' },
  { id: 'purple', color: '#9B59B6' },
  { id: 'orange', color: '#E67E22' },
  { id: 'cyan', color: '#00B2FF' },
  { id: 'pink', color: '#EB459E' }
];

// Default settings
const defaultSettings = {
  appearance: {
    background: {
      type: 'solid',
      color: '#36393f',
      gradient: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)',
      imageUrl: '',
      unsplashTopic: 'galaxy,space',
    },
    themeColor: '#5865F2',
    darkMode: true,
    clockDisplay: '24h',
    showWeather: true,
  },
  search: {
    engine: 'google',
    customSearchUrl: '',
    openInNewTab: true,
    showSearchSuggestions: true,
  },
  links: {
    displayStyle: 'grid',
    showIcons: true,
    showLabels: true,
    sortBy: 'custom',
  },
  advanced: {
    enableKeyboardShortcuts: true,
    showFavicons: true,
    enableAnimations: true,
    clearHistoryOnExit: false,
  }
};

const SettingsPanel = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useLocalStorage('galaxyTabSettings', defaultSettings);
  const [activeTab, setActiveTab] = useState('appearance');
  const [tempSettings, setTempSettings] = useState(settings);
  
  // Update temp settings when actual settings change (e.g., first load)
  useEffect(() => {
    setTempSettings(settings);
  }, [settings]);
  
  const handleInputChange = (section, field, value) => {
    setTempSettings({
      ...tempSettings,
      [section]: {
        ...tempSettings[section],
        [field]: value
      }
    });
  };
  
  const handleNestedInputChange = (section, parentField, field, value) => {
    setTempSettings({
      ...tempSettings,
      [section]: {
        ...tempSettings[section],
        [parentField]: {
          ...tempSettings[section][parentField],
          [field]: value
        }
      }
    });
  };
  
  const saveSettings = () => {
    setSettings(tempSettings);
    onClose();
  };
  
  const resetSettings = () => {
    setTempSettings(defaultSettings);
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <SettingsOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <SettingsContainer
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <SettingsHeader>
              <SettingsTitle>Settings</SettingsTitle>
              <CloseButton onClick={onClose}>×</CloseButton>
            </SettingsHeader>
            
            <TabsContainer>
              <TabButton 
                isActive={activeTab === 'appearance'} 
                onClick={() => setActiveTab('appearance')}
              >
                Appearance
              </TabButton>
              <TabButton 
                isActive={activeTab === 'search'} 
                onClick={() => setActiveTab('search')}
              >
                Search
              </TabButton>
              <TabButton 
                isActive={activeTab === 'links'} 
                onClick={() => setActiveTab('links')}
              >
                Links
              </TabButton>
              <TabButton 
                isActive={activeTab === 'advanced'} 
                onClick={() => setActiveTab('advanced')}
              >
                Advanced
              </TabButton>
            </TabsContainer>
            
            <SettingsContent>
              {activeTab === 'appearance' && (
                <div>
                  <SettingsSection>
                    <SectionTitle>Background</SectionTitle>
                    
                    <SettingOption>
                      <OptionLabel htmlFor="backgroundType">Background Type</OptionLabel>
                      <SelectInput
                        id="backgroundType"
                        value={tempSettings.appearance.background.type}
                        onChange={(e) => handleNestedInputChange('appearance', 'background', 'type', e.target.value)}
                      >
                        {backgroundOptions.map(option => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </SelectInput>
                    </SettingOption>
                    
                    {tempSettings.appearance.background.type === 'solid' && (
                      <SettingOption>
                        <OptionLabel>Background Color</OptionLabel>
                        <input
                          type="color"
                          value={tempSettings.appearance.background.color}
                          onChange={(e) => handleNestedInputChange('appearance', 'background', 'color', e.target.value)}
                          style={{ width: '100%', height: '40px' }}
                        />
                      </SettingOption>
                    )}
                    
                    {tempSettings.appearance.background.type === 'image' && (
                      <SettingOption>
                        <OptionLabel htmlFor="imageUrl">Image URL</OptionLabel>
                        <TextInput
                          id="imageUrl"
                          value={tempSettings.appearance.background.imageUrl}
                          onChange={(e) => handleNestedInputChange('appearance', 'background', 'imageUrl', e.target.value)}
                          placeholder="https://example.com/image.jpg"
                        />
                        {tempSettings.appearance.background.imageUrl && (
                          <BackgroundPreview backgroundUrl={tempSettings.appearance.background.imageUrl} />
                        )}
                      </SettingOption>
                    )}
                    
                    {tempSettings.appearance.background.type === 'unsplash' && (
                      <SettingOption>
                        <OptionLabel htmlFor="unsplashTopic">Unsplash Topics</OptionLabel>
                        <OptionDescription>Comma-separated topics (e.g. nature,mountain,space)</OptionDescription>
                        <TextInput
                          id="unsplashTopic"
                          value={tempSettings.appearance.background.unsplashTopic}
                          onChange={(e) => handleNestedInputChange('appearance', 'background', 'unsplashTopic', e.target.value)}
                          placeholder="galaxy,space"
                        />
                      </SettingOption>
                    )}
                    
                    {/* Preview background based on current settings */}
                    {tempSettings.appearance.background.type !== 'image' && (
                      <SettingOption>
                        <OptionLabel>Preview</OptionLabel>
                        <BackgroundPreview 
                          backgroundUrl={
                            backgroundOptions.find(
                              option => option.id === tempSettings.appearance.background.type
                            )?.preview
                          } 
                        />
                      </SettingOption>
                    )}
                  </SettingsSection>
                  
                  <SettingsSection>
                    <SectionTitle>Theme</SectionTitle>
                    
                    <SettingOption>
                      <OptionLabel>Accent Color</OptionLabel>
                      <ColorPickerContainer>
                        {themeColors.map(colorOption => (
                          <ColorOption
                            key={colorOption.id}
                            color={colorOption.color}
                            isSelected={tempSettings.appearance.themeColor === colorOption.color}
                            onClick={() => handleInputChange('appearance', 'themeColor', colorOption.color)}
                          />
                        ))}
                      </ColorPickerContainer>
                    </SettingOption>
                    
                    <SettingOption>
                      <CheckboxLabel>
                        <Checkbox
                          type="checkbox"
                          checked={tempSettings.appearance.darkMode}
                          onChange={(e) => handleInputChange('appearance', 'darkMode', e.target.checked)}
                        />
                        Dark Mode
                      </CheckboxLabel>
                    </SettingOption>
                  </SettingsSection>
                  
                  <SettingsSection>
                    <SectionTitle>Display Options</SectionTitle>
                    
                    <SettingOption>
                      <OptionLabel htmlFor="clockDisplay">Clock Format</OptionLabel>
                      <SelectInput
                        id="clockDisplay"
                        value={tempSettings.appearance.clockDisplay}
                        onChange={(e) => handleInputChange('appearance', 'clockDisplay', e.target.value)}
                      >
                        <option value="12h">12-hour (AM/PM)</option>
                        <option value="24h">24-hour</option>
                      </SelectInput>
                    </SettingOption>
                    
                    <SettingOption>
                      <CheckboxLabel>
                        <Checkbox
                          type="checkbox"
                          checked={tempSettings.appearance.showWeather}
                          onChange={(e) => handleInputChange('appearance', 'showWeather', e.target.checked)}
                        />
                        Show Weather Widget
                      </CheckboxLabel>
                    </SettingOption>
                  </SettingsSection>
                </div>
              )}
              
              {activeTab === 'search' && (
                <div>
                  <SettingsSection>
                    <SectionTitle>Search Engine</SectionTitle>
                    
                    <SettingOption>
                      <OptionLabel htmlFor="searchEngine">Default Search Engine</OptionLabel>
                      <SelectInput
                        id="searchEngine"
                        value={tempSettings.search.engine}
                        onChange={(e) => handleInputChange('search', 'engine', e.target.value)}
                      >
                        {searchEngines.map(engine => (
                          <option key={engine.id} value={engine.id}>
                            {engine.name}
                          </option>
                        ))}
                      </SelectInput>
                    </SettingOption>
                    
                    {tempSettings.search.engine === 'custom' && (
                      <SettingOption>
                        <OptionLabel htmlFor="customSearchUrl">Custom Search URL</OptionLabel>
                        <OptionDescription>Use %s where the search term should be inserted</OptionDescription>
                        <TextInput
                          id="customSearchUrl"
                          value={tempSettings.search.customSearchUrl}
                          onChange={(e) => handleInputChange('search', 'customSearchUrl', e.target.value)}
                          placeholder="https://example.com/search?q=%s"
                        />
                      </SettingOption>
                    )}
                    
                    <SettingOption>
                      <CheckboxLabel>
                        <Checkbox
                          type="checkbox"
                          checked={tempSettings.search.openInNewTab}
                          onChange={(e) => handleInputChange('search', 'openInNewTab', e.target.checked)}
                        />
                        Open search results in new tab
                      </CheckboxLabel>
                    </SettingOption>
                    
                    <SettingOption>
                      <CheckboxLabel>
                        <Checkbox
                          type="checkbox"
                          checked={tempSettings.search.showSearchSuggestions}
                          onChange={(e) => handleInputChange('search', 'showSearchSuggestions', e.target.checked)}
                        />
                        Show search suggestions
                      </CheckboxLabel>
                    </SettingOption>
                  </SettingsSection>
                </div>
              )}
              
              {activeTab === 'links' && (
                <div>
                  <SettingsSection>
                    <SectionTitle>Links Display</SectionTitle>
                    
                    <SettingOption>
                      <OptionLabel htmlFor="displayStyle">Display Style</OptionLabel>
                      <SelectInput
                        id="displayStyle"
                        value={tempSettings.links.displayStyle}
                        onChange={(e) => handleInputChange('links', 'displayStyle', e.target.value)}
                      >
                        <option value="grid">Grid</option>
                        <option value="list">List</option>
                        <option value="compact">Compact</option>
                      </SelectInput>
                    </SettingOption>
                    
                    <SettingOption>
                      <CheckboxLabel>
                        <Checkbox
                          type="checkbox"
                          checked={tempSettings.links.showIcons}
                          onChange={(e) => handleInputChange('links', 'showIcons', e.target.checked)}
                        />
                        Show icons
                      </CheckboxLabel>
                    </SettingOption>
                    
                    <SettingOption>
                      <CheckboxLabel>
                        <Checkbox
                          type="checkbox"
                          checked={tempSettings.links.showLabels}
                          onChange={(e) => handleInputChange('links', 'showLabels', e.target.checked)}
                        />
                        Show labels
                      </CheckboxLabel>
                    </SettingOption>
                    
                    <SettingOption>
                      <OptionLabel htmlFor="sortBy">Sort Links By</OptionLabel>
                      <SelectInput
                        id="sortBy"
                        value={tempSettings.links.sortBy}
                        onChange={(e) => handleInputChange('links', 'sortBy', e.target.value)}
                      >
                        <option value="custom">Custom (Drag & Drop)</option>
                        <option value="name">Name</option>
                        <option value="mostUsed">Most Used</option>
                        <option value="recentlyAdded">Recently Added</option>
                      </SelectInput>
                    </SettingOption>
                  </SettingsSection>
                </div>
              )}
              
              {activeTab === 'advanced' && (
                <div>
                  <SettingsSection>
                    <SectionTitle>Advanced Options</SectionTitle>
                    
                    <SettingOption>
                      <CheckboxLabel>
                        <Checkbox
                          type="checkbox"
                          checked={tempSettings.advanced.enableKeyboardShortcuts}
                          onChange={(e) => handleInputChange('advanced', 'enableKeyboardShortcuts', e.target.checked)}
                        />
                        Enable keyboard shortcuts
                      </CheckboxLabel>
                    </SettingOption>
                    
                    <SettingOption>
                      <CheckboxLabel>
                        <Checkbox
                          type="checkbox"
                          checked={tempSettings.advanced.showFavicons}
                          onChange={(e) => handleInputChange('advanced', 'showFavicons', e.target.checked)}
                        />
                        Show website favicons
                      </CheckboxLabel>
                    </SettingOption>
                    
                    <SettingOption>
                      <CheckboxLabel>
                        <Checkbox
                          type="checkbox"
                          checked={tempSettings.advanced.enableAnimations}
                          onChange={(e) => handleInputChange('advanced', 'enableAnimations', e.target.checked)}
                        />
                        Enable animations
                      </CheckboxLabel>
                    </SettingOption>
                    
                    <SettingOption>
                      <CheckboxLabel>
                        <Checkbox
                          type="checkbox"
                          checked={tempSettings.advanced.clearHistoryOnExit}
                          onChange={(e) => handleInputChange('advanced', 'clearHistoryOnExit', e.target.checked)}
                        />
                        Clear search history on exit
                      </CheckboxLabel>
                    </SettingOption>
                  </SettingsSection>
                  
                  <SettingsSection>
                    <SectionTitle>Data Management</SectionTitle>
                    
                    <SettingOption>
                      <OptionDescription>
                        Export or reset your settings. Resetting will remove all customizations and restore defaults.
                      </OptionDescription>
                      
                      <ButtonGroup>
                        <Button
                          onClick={() => {
                            const dataStr = JSON.stringify(settings);
                            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                            
                            const exportFileDefaultName = 'galaxy-tab-settings.json';
                            
                            const linkElement = document.createElement('a');
                            linkElement.setAttribute('href', dataUri);
                            linkElement.setAttribute('download', exportFileDefaultName);
                            linkElement.click();
                          }}
                        >
                          Export Settings
                        </Button>
                      </ButtonGroup>
                    </SettingOption>
                  </SettingsSection>
                </div>
              )}
              
              <ButtonGroup>
                <ResetButton onClick={resetSettings}>
                  Reset
                </ResetButton>
                <SaveButton onClick={saveSettings}>
                  Save Changes
                </SaveButton>
              </ButtonGroup>
            </SettingsContent>
          </SettingsContainer>
        </SettingsOverlay>
      )}
    </AnimatePresence>
  );
};

export default SettingsPanel;