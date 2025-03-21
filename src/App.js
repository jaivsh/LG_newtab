// src/App.js
import React from 'react';
import { ThemeProvider } from 'styled-components';
import GlobalStyles from './styles/GlobalStyles';
import theme from './styles/theme';
import Dashboard from './pages/Dashboard';
import { LinksProvider } from './context/LinksContext';

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <LinksProvider>
          <Dashboard />
        </LinksProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;