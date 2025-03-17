// src/context/LinksContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

const LinksContext = createContext();

export const useLinks = () => useContext(LinksContext);

export const LinksProvider = ({ children }) => {
  
  const initialLinks = [
    {
      id: '1',
      title: 'Liquid Galaxy',
      url: 'https://liquidgalaxy.org',
      icon: '🌌',
      category: 'main'
    },
    {
      id: '2',
      title: 'GitHub',
      url: 'https://github.com',
      icon: '💻',
      category: 'dev'
    },
    {
      id: '3',
      title: 'Google',
      url: 'https://google.com',
      icon: '🔍',
      category: 'main'
    }
  ];

  const [links, setLinks] = useState(() => {
    const savedLinks = localStorage.getItem('galaxyTabLinks');
    return savedLinks ? JSON.parse(savedLinks) : initialLinks;
  });

  useEffect(() => {
    localStorage.setItem('galaxyTabLinks', JSON.stringify(links));
  }, [links]);

  const addLink = (link) => {
    setLinks([...links, { ...link, id: Date.now().toString() }]);
  };

  const removeLink = (id) => {
    setLinks(links.filter(link => link.id !== id));
  };

  const editLink = (id, updatedLink) => {
    setLinks(links.map(link => link.id === id ? { ...link, ...updatedLink } : link));
  };

  return (
    <LinksContext.Provider value={{ links, addLink, removeLink, editLink }}>
      {children}
    </LinksContext.Provider>
  );
};