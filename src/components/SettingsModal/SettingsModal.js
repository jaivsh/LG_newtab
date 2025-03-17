// src/components/SettingsModal/SettingsModal.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../../context/SettingsContext';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
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

const Input = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.small};
  border: 1px solid ${props => props.theme.colors.secondary};
  background-color: ${props => props.theme.colors.background.main};
  color: ${props => props.theme.colors.text.primary};
`;

const Checkbox = styled.input`
  margin-right: ${props => props.theme.spacing.sm};
`;

const ColorPicker = styled.input`
  width: 100%;
  height: 40px;
  border: 1px solid ${props => props.theme.colors.secondary};
  border-radius: ${props => props.theme.borderRadius.small};
  background-color: ${props => props.theme.colors.background.main};
`;

const SettingsModal = ({ onClose }) => {
  const { settings, updateSettings, resetSettings } = useSettings();
  const [activeTab, setActiveTab] = useState('background');

  const tabs = [
        { id: 'background', label: 'Background' },
        { id: 'search', label: 'Search' },
        { id: 'appearance', label: 'Appearance' },
        { id: 'layout', label: 'Layout' },
        { id: 'gestures', label: 'Gestures' },
        { id: 'advanced', label: 'Advanced' },
      ];
    
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
                <CloseButton onClick={onClose}>×</CloseButton>
              </ModalHeader>
              
              <ModalBody>
                <Sidebar>
                  {tabs.map(tab => (
                    <SidebarItem
                      key={tab.id}
                      active={activeTab === tab.id}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.label}
                    </SidebarItem>
                  ))}
                  
                  <SidebarItem onClick={resetSettings}>
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
                          value={settings.background.type}
                          onChange={(e) => updateSettings('background', { type: e.target.value })}
                        >
                          <option value="particles">Particles</option>
                          <option value="waves">Waves</option>
                          <option value="galaxy">Galaxy</option>
                          <option value="color">Solid Color</option>
                        </Select>
                      </FormGroup>
                      
                      {settings.background.type === 'color' && (
                        <FormGroup>
                          <Label htmlFor="backgroundColor">Background Color</Label>
                          <ColorPicker
                            type="color"
                            id="backgroundColor"
                            value={settings.background.color}
                            onChange={(e) => updateSettings('background', { color: e.target.value })}
                          />
                        </FormGroup>
                      )}
                      
                      <FormGroup>
                        <Label>
                          <Checkbox
                            type="checkbox"
                            checked={settings.background.animated}
                            onChange={(e) => updateSettings('background', { animated: e.target.checked })}
                          />
                          Animated Background
                        </Label>
                      </FormGroup>
                    </Section>
                  )}
                  
                  {activeTab === 'search' && (
                    <Section>
                      <SectionTitle>Search Settings</SectionTitle>
                      
                      <FormGroup>
                        <Label htmlFor="searchEngine">Default Search Engine</Label>
                        <Select
                          id="searchEngine"
                          value={settings.search.engine}
                          onChange={(e) => updateSettings('search', { engine: e.target.value })}
                        >
                          <option value="google">Google</option>
                          <option value="bing">Bing</option>
                          <option value="duckduckgo">DuckDuckGo</option>
                          <option value="yahoo">Yahoo</option>
                        </Select>
                      </FormGroup>
                      
                      <FormGroup>
                        <Label>
                          <Checkbox
                            type="checkbox"
                            checked={settings.search.openInNewTab}
                            onChange={(e) => updateSettings('search', { openInNewTab: e.target.checked })}
                          />
                          Open search results in new tab
                        </Label>
                      </FormGroup>
                    </Section>
                  )}
                  
                  {activeTab === 'appearance' && (
                    <Section>
                      <SectionTitle>Appearance Settings</SectionTitle>
                      
                      <FormGroup>
                        <Label htmlFor="theme">Theme</Label>
                        <Select
                          id="theme"
                          value={settings.appearance.theme}
                          onChange={(e) => updateSettings('appearance', { theme: e.target.value })}
                        >
                          <option value="dark">Dark</option>
                          <option value="light">Light</option>
                          <option value="auto">Auto (System)</option>
                        </Select>
                      </FormGroup>
                      
                      <FormGroup>
                        <Label>
                          <Checkbox
                            type="checkbox"
                            checked={settings.appearance.clock24Hour}
                            onChange={(e) => updateSettings('appearance', { clock24Hour: e.target.checked })}
                          />
                          Use 24-hour clock
                        </Label>
                      </FormGroup>
                      
                      <FormGroup>
                        <Label>
                          <Checkbox
                            type="checkbox"
                            checked={settings.appearance.showDate}
                            onChange={(e) => updateSettings('appearance', { showDate: e.target.checked })}
                          />
                          Show date
                        </Label>
                      </FormGroup>
                      
                      <FormGroup>
                        <Label>
                          <Checkbox
                            type="checkbox"
                            checked={settings.appearance.showWeather}
                            onChange={(e) => updateSettings('appearance', { showWeather: e.target.checked })}
                          />
                          Show weather
                        </Label>
                      </FormGroup>
                      
                      {settings.appearance.showWeather && (
                        <FormGroup>
                          <Label htmlFor="weatherUnit">Weather Unit</Label>
                          <Select
                            id="weatherUnit"
                            value={settings.appearance.weatherUnit}
                            onChange={(e) => updateSettings('appearance', { weatherUnit: e.target.value })}
                          >
                            <option value="celsius">Celsius</option>
                            <option value="fahrenheit">Fahrenheit</option>
                          </Select>
                        </FormGroup>
                      )}
                    </Section>
                  )}
                  
                  {activeTab === 'layout' && (
                    <Section>
                      <SectionTitle>Layout Settings</SectionTitle>
                      
                      <FormGroup>
                        <Label htmlFor="columns">Columns</Label>
                        <Select
                          id="columns"
                          value={settings.layout.columns}
                          onChange={(e) => updateSettings('layout', { columns: e.target.value })}
                        >
                          <option value="auto">Auto</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                        </Select>
                      </FormGroup>
                      
                      <FormGroup>
                        <Label htmlFor="sortBy">Sort Links By</Label>
                        <Select
                          id="sortBy"
                          value={settings.layout.sortBy}
                          onChange={(e) => updateSettings('layout', { sortBy: e.target.value })}
                        >
                          <option value="custom">Custom</option>
                          <option value="alphabetical">Alphabetical</option>
                          <option value="most-used">Most Used</option>
                        </Select>
                      </FormGroup>
                    </Section>
                  )}
                  
                  {activeTab === 'gestures' && (
                    <Section>
                      <SectionTitle>Gesture Settings</SectionTitle>
                      
                      <FormGroup>
                        <Label>
                          <Checkbox
                            type="checkbox"
                            checked={settings.gestures.enabled}
                            onChange={(e) => updateSettings('gestures', { enabled: e.target.checked })}
                          />
                          Enable gesture controls
                        </Label>
                      </FormGroup>
                      
                      {settings.gestures.enabled && (
                        <>
                          <FormGroup>
                            <Label htmlFor="doubleClickAction">Double-Click Action</Label>
                            <Select
                              id="doubleClickAction"
                              value={settings.gestures.doubleClickAction}
                              onChange={(e) => updateSettings('gestures', { doubleClickAction: e.target.value })}
                            >
                              <option value="open-settings">Open Settings</option>
                              <option value="new-link">Add New Link</option>
                              <option value="refresh">Refresh Page</option>
                            </Select>
                          </FormGroup>
                          
                          <FormGroup>
                            <Label htmlFor="swipeLeftAction">Swipe Left Action</Label>
                            <Select
                              id="swipeLeftAction"
                              value={settings.gestures.swipeLeftAction}
                              onChange={(e) => updateSettings('gestures', { swipeLeftAction: e.target.value })}
                            >
                              <option value="next-page">Next Page</option>
                              <option value="previous-page">Previous Page</option>
                              <option value="open-settings">Open Settings</option>
                            </Select>
                          </FormGroup>
                          
                          <FormGroup>
                            <Label htmlFor="swipeRightAction">Swipe Right Action</Label>
                            <Select
                              id="swipeRightAction"
                              value={settings.gestures.swipeRightAction}
                              onChange={(e) => updateSettings('gestures', { swipeRightAction: e.target.value })}
                            >
                              <option value="previous-page">Previous Page</option>
                              <option value="next-page">Next Page</option>
                              <option value="open-settings">Open Settings</option>
                            </Select>
                          </FormGroup>
                        </>
                      )}
                    </Section>
                  )}
                  
                  {activeTab === 'advanced' && (
                    <Section>
                      <SectionTitle>Advanced Settings</SectionTitle>
                      
                      <FormGroup>
                        <Label htmlFor="customCSS">Custom CSS</Label>
                        <Input
                          as="textarea"
                          id="customCSS"
                          rows="5"
                          value={settings.advanced.customCSS}
                          onChange={(e) => updateSettings('advanced', { customCSS: e.target.value })}
                          placeholder="/* Add your custom CSS here */"
                        />
                      </FormGroup>
                      
                      <FormGroup>
                        <Label htmlFor="customJS">Custom JavaScript</Label>
                        <Input
                          as="textarea"
                          id="customJS"
                          rows="5"
                          value={settings.advanced.customJS}
                          onChange={(e) => updateSettings('advanced', { customJS: e.target.value })}
                          placeholder="// Add your custom JavaScript here"
                        />
                      </FormGroup>
                    </Section>
                  )}
                </Content>
              </ModalBody>
            </ModalContent>
          </ModalOverlay>
        </AnimatePresence>
      );
    };
    
    export default SettingsModal;