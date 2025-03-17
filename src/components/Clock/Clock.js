// src/components/Clock/Clock.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ClockContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TimeDisplay = styled.div`
  font-size: 2rem;
  font-weight: 300;
  color: ${props => props.theme.colors.text.primary};
`;

const DateDisplay = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text.secondary};
`;

const Clock = () => {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    return () => {
      clearInterval(timer);
    };
  }, []);
  
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDate = (date) => {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };
  
  return (
    <ClockContainer>
      <TimeDisplay>{formatTime(time)}</TimeDisplay>
      <DateDisplay>{formatDate(time)}</DateDisplay>
    </ClockContainer>
  );
};

export default Clock;