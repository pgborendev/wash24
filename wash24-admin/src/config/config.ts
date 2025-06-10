const API_BASE_URL = 'https://localhost:8080/api';

const apiEndpoints = {
  base:`${API_BASE_URL}`,
  auth: {
    signIn: `${API_BASE_URL}/auth/signin`,
  },
  view: {
    doc_list: `${API_BASE_URL}/api`,
  }
  // Add more modules for different parts of your application
} as const;

export type ApiEndpoints = typeof apiEndpoints;

export default apiEndpoints;