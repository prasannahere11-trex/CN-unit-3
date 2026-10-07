import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { CityProvider } from './context/CityContext';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <CityProvider>
        <App />
      </CityProvider>
    </HashRouter>
  </StrictMode>
);
