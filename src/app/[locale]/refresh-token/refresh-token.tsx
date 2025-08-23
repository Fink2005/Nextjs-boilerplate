'use client';

import { checkAndRefreshToken } from '@/libs/utils';

import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

type Props = {
  refreshToken?: string;
};
export default function RefreshToken({ refreshToken }: Props) {
  const timeRef = useRef<number>(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const refreshTokenFromUrl = searchParams.get('refreshToken');
  const redirectPathname = searchParams.get('redirect');
  useEffect(() => {
    const TIME_SHOULD_RELOAD = 1000 * 4; // 4 seconds
    let timeInterval: any = null;
    const handleCountTime = () => {
      if (timeRef.current >= TIME_SHOULD_RELOAD) {
        clearInterval(timeInterval);
        timeInterval = null;
        window.location.reload();
        return;
      }
      timeRef.current += 1000;
    };
    handleCountTime();
    timeInterval = setInterval(() => {
      handleCountTime();
    }, 1000);
    return () => {
      timeRef.current = 0;
      clearInterval(timeInterval);
    };
  }, []);
  useEffect(() => {
    router.prefetch('/');
    if (
      refreshTokenFromUrl
      && refreshTokenFromUrl === refreshToken
    ) {
      checkAndRefreshToken({
        onSuccess: () => {
          router.replace(redirectPathname || '/');
        }
      });
    } else {
      router.push('/');
    }
  }, [router, refreshTokenFromUrl, redirectPathname, refreshToken]);
  return (
    <div className="h-screen text-white flex items-center justify-center">
      <Loader2 className="animate-spin" />
    </div>
  );
}
