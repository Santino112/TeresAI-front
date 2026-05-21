import { useEffect, useState } from 'react';
import {
  getInstallPrompt,
  subscribeInstallPrompt,
} from './installPrompt.js';

export const usePwaInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(() => getInstallPrompt());

  useEffect(() => subscribeInstallPrompt(setDeferredPrompt), []);

  return deferredPrompt;
};
