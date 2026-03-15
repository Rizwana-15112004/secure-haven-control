export const getBackendURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) return envUrl;

  // Default to live Render backend in any production build (Web or Android)
  if (import.meta.env.PROD || window.location.hostname.includes('vercel.app')) {
    return 'https://sdrrs-backend.onrender.com';
  }

  const ip = localStorage.getItem('serverIP') || window.location.hostname;
  return `${window.location.protocol}//${ip}:8080`;
};

export const getAlertServerURL = () => {
  return getBackendURL();
};
