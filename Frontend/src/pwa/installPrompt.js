let deferredPrompt = null;
const listeners = new Set();
let initialized = false;

const notify = () => {
  listeners.forEach((listener) => {
    listener(deferredPrompt);
  });
};

export const initInstallPrompt = () => {
  if (initialized || typeof window === 'undefined') {
    return;
  }

  initialized = true;

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    console.log('✅ beforeinstallprompt capturado globalmente');
    notify();
  });

  window.addEventListener('appinstalled', () => {
    console.log('✅ App instalada correctamente');
    deferredPrompt = null;
    notify();
  });
};

export const subscribeInstallPrompt = (listener) => {
  listeners.add(listener);
  listener(deferredPrompt);

  return () => {
    listeners.delete(listener);
  };
};

export const getInstallPrompt = () => deferredPrompt;

export const isStandaloneDisplayMode = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(display-mode: standalone)').matches;

export const promptInstallApp = async () => {
  if (!deferredPrompt) {
    return null;
  }

  const promptEvent = deferredPrompt;
  deferredPrompt = null;
  notify();

  try {
    promptEvent.prompt();
    return await promptEvent.userChoice;
  } finally {
    notify();
  }
};
