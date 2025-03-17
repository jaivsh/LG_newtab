// src/components/LinkCard/LinkCard.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Card = styled(motion.div)`
  background-color: ${(props) => props.theme.colors.background.card};
  border-radius: ${(props) => props.theme.borderRadius.medium};
  padding: ${(props) => props.theme.spacing.md};
  box-shadow: ${(props) => props.theme.shadows.small};
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: ${(props) => props.theme.transition.default};

  &:hover {
    box-shadow: ${(props) => props.theme.shadows.medium};
    transform: translateY(-2px);

    .actions {
      opacity: 1;
    }
  }
`;

const Icon = styled.div`
  font-size: 2rem;
  margin-bottom: ${(props) => props.theme.spacing.sm};
`;

const Title = styled.h3`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${(props) => props.theme.colors.text.primary};
  margin: 0;
  text-align: center;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Url = styled.p`
  font-size: 0.7rem;
  color: ${(props) => props.theme.colors.text.secondary};
  margin-top: ${(props) => props.theme.spacing.xs};
  text-align: center;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ActionsPanel = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  border-bottom-left-radius: ${(props) => props.theme.borderRadius.small};
  display: flex;
  opacity: 0;
  transition: ${(props) => props.theme.transition.default};
`;

const ActionButton = styled.button`
  color: ${(props) => props.theme.colors.text.primary};
  padding: ${(props) => props.theme.spacing.xs};
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    color: ${(props) => props.theme.colors.accent};
  }
`;

const LinkCard = ({ link, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedLink, setEditedLink] = useState(link || { title: '', url: '', icon: '' });

  const handleClick = () => {
    if (!isEditing && link.url) {
      window.open(link.url, '_blank');
    }
  };

  const handleEdit = () => setIsEditing(true);
  const handleSave = () => {
    onEdit(link.id, editedLink);
    setIsEditing(false);
  };
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(link.id);
  };

  if (isEditing) {
    return (
      <Card as="form" onClick={(e) => e.stopPropagation()}>
        <input
          type="text"
          value={editedLink.title}
          onChange={(e) => setEditedLink({ ...editedLink, title: e.target.value })}
          placeholder="Title"
          aria-label="Edit title"
        />
        <input
          type="text"
          value={editedLink.url}
          onChange={(e) => setEditedLink({ ...editedLink, url: e.target.value })}
          placeholder="URL"
          aria-label="Edit URL"
        />
        <input
          type="text"
          value={editedLink.icon}
          onChange={(e) => setEditedLink({ ...editedLink, icon: e.target.value })}
          placeholder="Icon (emoji)"
          aria-label="Edit icon"
        />
        <div>
          <button type="button" onClick={handleSave}>Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      </Card>
    );
  }

  return (
    <Card whileHover={{ y: -5 }} onClick={handleClick}>
      <ActionsPanel className="actions">
        <ActionButton onClick={(e) => {
          e.stopPropagation();
          handleEdit();
        }}>
          ✏️
        </ActionButton>
        <ActionButton onClick={handleDelete}>
          🗑️
        </ActionButton>
      </ActionsPanel>
      <Icon>{link.icon}</Icon>
      <Title>{link.title}</Title>
      <Url>{link.url ? new URL(link.url).hostname : 'Invalid URL'}</Url>
    </Card>
  );
};

export default LinkCard;
