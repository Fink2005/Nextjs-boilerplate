import { http } from '@/app/http/apiRequest';
import { USER_RANKING_LIMIT } from '@/libs/shared/constants/globals';
import type { VerifyKycResponse } from '@/types/auth';
import type { UserGetMe, UserRanking, UserUpdateMeRes } from '@/types/user';

const userRequest = {
  async userKyc(body: { email: string }): Promise<{ message: string } | null> {
    return await http.patch<{ message: string } | null>(
      '/user/kyc',
      body
    );
  },
  async verifyKyc(body: { kycOtp: string }): Promise<VerifyKycResponse | null> {
    return await http.patch<VerifyKycResponse | null>(
      '/user/verify-kyc',
      body
    );
  },
  async resendOtp(): Promise<{ message: string } | null> {
    return await http.patch<{ message: string } | null>(
      '/user/resend-otp'
    );
  },
  async userRanking(page: number): Promise<UserRanking | null> {
    return await http.get<UserRanking | null>(
      `/user/ranking?page=${page}&limit=${USER_RANKING_LIMIT}`
    );
  },
  async userGetMe(): Promise<UserGetMe | null> {
    return await http.get<UserGetMe | null>(
      '/user/get-me',
      {
        next: {
          revalidate: 10 * 60,
          tags: ['get-me'],
        },
      }
    );
  },
  async userUpdateMe(name: string): Promise<UserUpdateMeRes | null> {
    return await http.patch<UserUpdateMeRes | null>(
      '/user/update',
      { name },
    );
  }

};

export default userRequest;
