// src/styles/theme.js
const theme = {
    colors: {
      
      primary: '#36393f', 
      secondary: '#2f3136', 
      accent: '#5865F2', 
      highlight: '#7289da', 
      text: {
        primary: '#ffffff',
        secondary: '#b9bbbe',
        accent: '#dcddde',
      },
      background: {
        main: '#202225', 
        card: '#2f3136', 
      },
      status: {
        success: '#43b581',
        warning: '#faa61a',
        error: '#f04747',
      }
    },
    shadows: {
      small: '0 1px 2px rgba(0, 0, 0, 0.07)',
      medium: '0 5px 15px rgba(0, 0, 0, 0.15)',
      large: '0 10px 25px rgba(0, 0, 0, 0.25)',
    },
    borderRadius: {
      small: '4px',
      medium: '8px',
      large: '12px',
      round: '50%',
    },
    transition: {
      default: 'all 0.3s ease',
      fast: 'all 0.1s ease',
      slow: 'all 0.5s ease',
    },
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
      xxl: '48px',
    },
    breakpoints: {
      xs: '320px',
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
    }
  };
  
  export default theme;