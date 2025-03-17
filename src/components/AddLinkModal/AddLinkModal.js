// src/components/AddLinkModal/AddLinkModal.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

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
  padding: ${props => props.theme.spacing.lg};
  width: 90%;
  max-width: 500px;
  box-shadow: ${props => props.theme.shadows.large};
`;

const Title = styled.h2`
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.md};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${props => props.theme.spacing.xs};
  color: ${props => props.theme.colors.text.secondary};
`;

const Input = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.small};
  border: 1px solid ${props => props.theme.colors.secondary};
  background-color: ${props => props.theme.colors.background.main};
  color: ${props => props.theme.colors.text.primary};
  transition: ${props => props.theme.transition.default};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.accent};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.accent}40;
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
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const CancelButton = styled(Button)`
  background-color: transparent;
  color: ${props => props.theme.colors.text.secondary};
  
  &:hover {
    color: ${props => props.theme.colors.text.primary};
  }
`;

const AddButton = styled(Button)`
  background-color: ${props => props.theme.colors.accent};
  color: white;
  
  &:hover {
    background-color: ${props => props.theme.colors.highlight};
  }
`;

const AddLinkModal = ({ onClose, onAdd }) => {
  const [newLink, setNewLink] = useState({
    title: '',
    url: '',
    icon: '🔗',
    category: 'main'
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewLink(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    let url = newLink.url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    onAdd({
      ...newLink,
      url
    });
    
    onClose();
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
          <Title>Add New Link</Title>
          
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                type="text"
                value={newLink.title}
                onChange={handleChange}
                placeholder="Google"
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                name="url"
                type="text"
                value={newLink.url}
                onChange={handleChange}
                placeholder="https://google.com"
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="icon">Icon (emoji)</Label>
              <Input
                id="icon"
                name="icon"
                type="text"
                value={newLink.icon}
                onChange={handleChange}
                placeholder="🔍"
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                type="text"
                value={newLink.category}
                onChange={handleChange}
                placeholder="main"
              />
            </FormGroup>
            
            <ButtonGroup>
              <CancelButton type="button" onClick={onClose}>
                Cancel
              </CancelButton>
              <AddButton type="submit">
                Add Link
              </AddButton>
            </ButtonGroup>
          </Form>
        </ModalContent>
      </ModalOverlay>
    </AnimatePresence>
  );
};

export default AddLinkModal;