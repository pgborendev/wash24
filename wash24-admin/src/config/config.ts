
// const BASE_URL = ' https://192.168.0.8:8080';
const BASE_URL = ' https://localhost:8080';
const API_BASE_URL = `${BASE_URL}/api`;

const apiEndpoints = {
  base:`${BASE_URL}`,
  auth: {
    signIn: `${API_BASE_URL}/auth/signin`,
    checkAuth: `${API_BASE_URL}/auth/check`,
    signOut: `${API_BASE_URL}/auth/signout`,
    refresh: `${API_BASE_URL}/auth/refresh`,
    resend_otp: `${API_BASE_URL}/auth/resend_otp`,
    forget_password_request: `${API_BASE_URL}/auth/forget_password_request`,
    otp_verify: `${API_BASE_URL}/auth/otp_verify`,
  },
  shope: `${API_BASE_URL}/shops`,
  view: {
    doc_list: `${API_BASE_URL}/api`,
  }
  // Add more modules for different parts of your application
} as const;

export type ApiEndpoints = typeof apiEndpoints;

export default apiEndpoints;