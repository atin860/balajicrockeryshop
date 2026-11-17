import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

/* Self-hosted fonts (no Google Fonts request = faster + works offline).
   Only the weights we actually use are imported. The browser downloads a
   font file only when a page uses characters from its unicode range.
   Hindi uses just two weights (regular + semibold, ~50 KB each): medium falls
   back to regular and bold to semibold, which keeps the Hindi pages fast. */
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/noto-sans-devanagari/400.css';
import '@fontsource/noto-sans-devanagari/600.css';

import './index.css';
import App from './App.jsx';
import { LanguageProvider } from './i18n/LanguageContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { EnquiryProvider } from './context/EnquiryContext.jsx';

// Provider order matters: cart and enquiry use language (text) and toasts.
// CartProvider stays mounted while ordering is on hold (shop.features.ordering)
// so the ordering code keeps working the moment it is switched back on.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <LanguageProvider>
        <ToastProvider>
          <CartProvider>
            <EnquiryProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </EnquiryProvider>
          </CartProvider>
        </ToastProvider>
      </LanguageProvider>
    </HelmetProvider>
  </React.StrictMode>,
);
