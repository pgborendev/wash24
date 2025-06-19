import apiEndpoints from "@/config/config";
import AuthenticationService from "@/services/AuthenticationService";

  interface LoginPayload {
    username: string;
    password: string;
    system: string;
    deviceType: string;
    deviceId: string;
  }

  export const useAuth = () => {

    const authService = new AuthenticationService(apiEndpoints);

    const verifyOtp = async (payload: any) => {
      return await authService.verifyOtp(payload);
    };

    const resendOtp = async (payload: any) => {
      return await authService.resendOtp(payload);
    };
  
    const signIn = async (payload: LoginPayload) => {
      return await authService.login({
        username: payload.username,
        password: payload.password,
        system: payload.system,
        deviceType: payload.deviceType,
        deviceId: payload.deviceId
      })
    };

    const signOut = async () => {
      return await authService.signOut();
    };

    const forgotPassword = async (payload: any) => {
      return await authService.forgotPassword(payload);
    };
  
    return {
      signIn,
      signOut,
      forgotPassword,
      verifyOtp,
      resendOtp
    };
};