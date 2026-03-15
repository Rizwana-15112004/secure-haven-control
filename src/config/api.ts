export const getBackendURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) return envUrl;

  // If on Vercel/Production, default to the live Render backend
  if (window.location.hostname.includes('vercel.app')) {
    return 'https://sdrrs-backend.onrender.com';
  }

  const ip = localStorage.getItem('serverIP') || window.location.hostname;
  return `${window.location.protocol}//${ip}:8080`;
};

export const getAlertServerURL = () => {
  // Alert server is now integrated into the Java backend for SSE
  return getBackendURL();
};
