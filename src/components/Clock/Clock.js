// src/components/Clock/Clock.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ClockContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const TimeDisplay = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: ${props => props.theme.colors.text.primary};
`;

const DateDisplay = styled.div`
  font-size: 1rem;
  color: ${props => props.theme.colors.text.secondary};
`;

const WeatherDisplay = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Clock = ({ format24 = false, showDate = true, showWeather = true, weatherUnit = 'celsius' }) => {
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (showWeather) {
      // Simulate fetching weather data
      // In a real app, you'd use a weather API
      setTimeout(() => {
        setWeather({
          temp: 22,
          condition: 'Sunny',
          icon: '☀️'
        });
        setLoading(false);
      }, 1000);
    }
  }, [showWeather]);

  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    if (!format24) {
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      return `${hours}:${minutes} ${ampm}`;
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  };

  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  const formatTemperature = (temp) => {
    if (weatherUnit === 'fahrenheit') {
      return `${Math.round((temp * 9/5) + 32)}°F`;
    }
    return `${temp}°C`;
  };

  return (
    <ClockContainer
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <TimeDisplay>{formatTime(time)}</TimeDisplay>
      {showDate && <DateDisplay>{formatDate(time)}</DateDisplay>}
      {showWeather && (
        <WeatherDisplay>
          {loading ? (
            'Loading weather...'
          ) : (
            <>
              <span>{weather.icon}</span>
              <span>{formatTemperature(weather.temp)}</span>
              <span>{weather.condition}</span>
            </>
          )}
        </WeatherDisplay>
      )}
    </ClockContainer>
  );
};

export default Clock;