// Configuration for API requests

const LOCAL_IP = '192.168.1.10'; 
const PORT = '8000'; // Python FastAPI

// ☁️ RAILWAY: Once you deploy, paste your Railway URL here (e.g. 'https://dairy-back.up.railway.app')
const CLOUD_URL = 'https://swaraaj-diary-app-production.up.railway.app'; 

export const SERVER_URL = CLOUD_URL || `http://${LOCAL_IP}:${PORT}`;
export const API_BASE_URL = `${SERVER_URL}/api`;
