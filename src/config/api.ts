export const getBackendURL = () => {
  // Use the environment variable if provided, otherwise fallback to local logic
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) return envUrl;

  const ip = localStorage.getItem('serverIP') || window.location.hostname;
  return `${window.location.protocol}//${ip}:8080`;
};

// For the Node.js alert server fallback (if still used)
export const getAlertServerURL = () => {
  const ip = localStorage.getItem('serverIP') || window.location.hostname;
  return `${window.location.protocol}//${ip}:3001`;
};
