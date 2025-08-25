import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './lib/i18n'

// Ensure correct dir/lang attributes on initial load
if (typeof document !== 'undefined') {
  const lang = 'ar';
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
}

createRoot(document.getElementById("root")!).render(<App />);
