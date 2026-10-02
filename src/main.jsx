import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { StoreProvider } from './services/store';
import { AuthProvider } from './services/auth';
import { ToastProvider } from './components/ui';
import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/public.css';
import './styles/dashboard.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <StoreProvider>
        <AuthProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </AuthProvider>
      </StoreProvider>
    </BrowserRouter>
  </StrictMode>,
);
