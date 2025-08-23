import { http } from '@/app/http/apiRequest';

const authRequests = {
  async login(body: any): Promise<any> {
    return await http.post<any>('/auth/login', body);
  },
  async refreshToken(token: string): Promise<{ success: boolean } | null> {
    return await http.post<{ success: boolean } | null>('/auth/refresh-token', token);
  },
  async serverRefreshToken(): Promise<{ success: boolean } | null> {
    return await http.post<{ success: boolean } | null>('/api/server-refresh-token', null, {
      nextServer: ''
    });
  },
  async logout(): Promise<{ success: boolean } | null> {
    return await http.post<{ success: boolean } | null>('/auth/logout', {});
  }
};

export default authRequests;
