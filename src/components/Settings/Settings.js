// src/components/Settings/Settings.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const SettingsContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  width: 380px;
  height: 100vh;
  background-color: ${props => props.theme.colors.background.card};
  box-shadow: ${props => props.theme.shadows.large};
  padding: ${props => props.theme.spacing.lg};
  z-index: 1000;
  overflow-y: auto;
`;

const CloseButton = styled.button`
  position: absolute;
  top: ${props => props.theme.spacing.md};
  right: ${props => props.theme.spacing.md};
  font-size: 1.5rem;
  color: ${props => props.theme.colors.text.secondary};
  
  &:hover {
    color: ${props => props.theme.colors.text.primary};
  }
`;

const SettingsHeader = styled.h2`
  margin-bottom: ${props => props.theme.spacing.lg};
  color: ${props => props.theme.colors.text.primary};
  font-size: 1.5rem;
`;

const SettingsSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  color: ${props => props.theme.colors.accent};
  margin-bottom: ${props => props.theme.spacing.md};
  padding-bottom: ${props => props.theme.spacing.xs};
  border-bottom: 1px solid ${props => props.theme.colors.secondary};
`;

const OptionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${props => props.theme.spacing.sm};
`;

const BackgroundOption = styled.div`
  position: relative;
  height: 80px;
  border-radius: ${props => props.theme.borderRadius.medium};
  overflow: hidden;
  cursor: pointer;
  border: 2px solid ${props => props.active ? props.theme.colors.accent : 'transparent'};
  transition: ${props => props.theme.transition.default};
  
  &:hover {
    transform: scale(1.05);
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ToggleOption = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.sm} 0;
  cursor: pointer;
`;

const ToggleSwitch = styled.div`
  position: relative;
  width: 50px;
  height: 24px;
  background-color: ${props => props.checked ? props.theme.colors.accent : props.theme.colors.secondary};
  border-radius: 12px;
  transition: ${props => props.theme.transition.default};
  
  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${props => props.checked ? '26px' : '2px'};
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: white;
    transition: ${props => props.theme.transition.default};
  }
`;

const Checkbox = styled.input`
  display: none;
`;

const SelectWrapper = styled.div`
  margin-bottom: ${props => props.theme.spacing.md};
`;

const Select = styled.select`
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

const SettingsButton = styled.button`
  position: fixed;
  bottom: ${props => props.theme.spacing.lg};
  left: ${props => props.theme.spacing.lg};
  width: 50px;
  height: 50px;
  border-radius: ${props => props.theme.borderRadius.round};
  background-color: ${props => props.theme.colors.accent};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: ${props => props.theme.shadows.medium};
  z-index: 100;
  
  &:hover {
    transform: scale(1.05);
    background-color: ${props => props.theme.colors.highlight};
  }
`;

const backgrounds = [
  { id: 'solid', name: 'Solid Color', type: 'color', value: '#202225' },
  { id: 'gradient1', name: 'Blue Gradient', type: 'gradient', value: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' },
  { id: 'gradient2', name: 'Purple Gradient', type: 'gradient', value: 'linear-gradient(135deg, #42275a 0%, #734b6d 100%)' },
  { id: 'stars', name: 'Stars', type: 'pattern', value: 'url("/backgrounds/stars.png")' },
  { id: 'particles', name: '3D Particles', type: '3d', value: 'particles' },
  { id: 'waves', name: '3D Waves', type: '3d', value: 'waves' },
];

const Settings = ({ settings, updateSettings }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleSetting = (setting) => {
    updateSettings({
      ...settings,
      [setting]: !settings[setting]
    });
  };
  
  const changeSetting = (setting, value) => {
    updateSettings({
      ...settings,
      [setting]: value
    });
  };
  
  const renderBackgroundPreview = (background) => {
    if (background.type === 'color' || background.type === 'gradient') {
      return <div style={{ width: '100%', height: '100%', background: background.value }} />;
    }
    
    return <div>Preview</div>;
  };
  
  return (
    <>
      <SettingsButton onClick={() => setIsOpen(true)}>⚙️</SettingsButton>
      
      <AnimatePresence>
        {isOpen && (
          <SettingsContainer
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
          >
            <CloseButton onClick={() => setIsOpen(false)}>✕</CloseButton>
            <SettingsHeader>Settings</SettingsHeader>
            
            <SettingsSection>
              <SectionTitle>Background</SectionTitle>
              <OptionGrid>
                {backgrounds.map(bg => (
                  <BackgroundOption
                    key={bg.id}
                    active={settings.background === bg.id}
                    onClick={() => changeSetting('background', bg.id)}
                  >
                    {renderBackgroundPreview(bg)}
                  </BackgroundOption>
                ))}
              </OptionGrid>
            </SettingsSection>
            
            <SettingsSection>
              <SectionTitle>General</SectionTitle>
              
              <SelectWrapper>
                <label htmlFor="clockFormat">Clock Format</label>
                <Select
                  id="clockFormat"
                  value={settings.clockFormat}
                  onChange={(e) => changeSetting('clockFormat', e.target.value)}
                >
                  <option value="12">12-hour</option>
                  <option value="24">24-hour</option>
                </Select>
              </SelectWrapper>
              
              <ToggleOption>
                <span>Show weather</span>
                <Checkbox
                  type="checkbox"
                  id="showWeather"
                  checked={settings.showWeather}
                  onChange={() => toggleSetting('showWeather')}
                />
                <ToggleSwitch checked={settings.showWeather} />
              </ToggleOption>
              
              <ToggleOption>
                <span>Show date</span>
                <Checkbox
                  type="checkbox"
                  id="showDate"
                  checked={settings.showDate}
                  onChange={() => toggleSetting('showDate')}
                />
                <ToggleSwitch checked={settings.showDate} />
              </ToggleOption>
              
              <ToggleOption>
                <span>Dark mode</span>
                <Checkbox
                  type="checkbox"
                  id="darkMode"
                  checked={settings.darkMode}
                  onChange={() => toggleSetting('darkMode')}
                />
                <ToggleSwitch checked={settings.darkMode} />
              </ToggleOption>
            </SettingsSection>
            
            <SettingsSection>
              <SectionTitle>Features</SectionTitle>
              
              <ToggleOption>
                <span>Enable gestures</span>
                <Checkbox
                  type="checkbox"
                  id="enableGestures"
                  checked={settings.enableGestures}
                  onChange={() => toggleSetting('enableGestures')}
                />
                <ToggleSwitch checked={settings.enableGestures} />
              </ToggleOption>
              
              <ToggleOption>
                <span>Show quick actions</span>
                <Checkbox
                  type="checkbox"
                  id="showQuickActions"
                  checked={settings.showQuickActions}
                  onChange={() => toggleSetting('showQuickActions')}
                />
                <ToggleSwitch checked={settings.showQuickActions} />
              </ToggleOption>
            </SettingsSection>
          </SettingsContainer>
        )}
      </AnimatePresence>
    </>
  );
};

export default Settings;