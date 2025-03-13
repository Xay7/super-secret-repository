import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app';
import './style/index.css';
import { registerMapProjections } from './app/utils/projections';

registerMapProjections();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
