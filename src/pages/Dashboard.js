import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useLinks } from '../context/LinksContext';
import Clock from '../components/Clock/Clock';
import SearchBar from '../components/SearchBar/SearchBar';
import LinkCard from '../components/LinkCard/LinkCard';
import AddLinkModal from '../components/AddLinkModal/AddLinkModal';
import ThreeJsAnimation from '../components/ThreeJsAnimation'; 

const DashboardContainer = styled.div`
  min-height: 100vh;
  padding: ${props => props.theme.spacing.lg};
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
  background: transparent;
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

const FloatingButtons = styled.div`
  position: fixed;
  bottom: ${props => props.theme.spacing.lg};
  right: ${props => props.theme.spacing.lg};
  display: flex;
  gap: ${props => props.theme.spacing.md};
  z-index: 2;
`;

const FloatingButton = styled(motion.button)`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.accent};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: ${props => props.theme.shadows.medium};
  transition: ${props => props.theme.transition.default};
  cursor: pointer;
  &:hover {
    transform: scale(1.05);
    background-color: ${props => props.theme.colors.highlight};
  }
`;

const Dashboard = () => {
  const { links, addLink, removeLink, editLink } = useLinks();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  return (
    <>
      {/* Always render the ThreeJs animation */}
      <ThreeJsAnimation />
      
      <DashboardContainer>
        <Header>
          <Logo>Liquid <span>Galaxy</span> Tab by Jaivardhan Shukla</Logo>
          <Clock />
        </Header>
        <SearchBar />
        <LinksGrid>
          {links.map(link => (
            <LinkCard
              key={link.id}
              link={link}
              onDelete={removeLink}
              onEdit={editLink}
            />
          ))}
        </LinksGrid>
        <FloatingButtons>
          <FloatingButton
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAddModalOpen(true)}
          >
            +
          </FloatingButton>
        </FloatingButtons>
        {isAddModalOpen && (
          <AddLinkModal
            onClose={() => setIsAddModalOpen(false)}
            onAdd={addLink}
          />
        )}
      </DashboardContainer>
    </>
  );
};

export default Dashboard;