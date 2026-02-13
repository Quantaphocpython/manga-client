'use client';

import { LoadingPage } from '@/components/ui/loading';
import { PUBLIC_ROUTES, Route } from '@/constants';
import { useUser } from '@/hooks/use-auth';
import { useAuthStore } from '@/stores/auth.store';
import { usePrivy as useWallet } from '@privy-io/react-auth';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoading: isUserLoading } = useUser();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const {
    user: web3User,
    authenticated: isWeb3Authenticated,
    ready,
  } = useWallet();

  useEffect(() => {
    if (ready && isWeb3Authenticated && web3User && !isAuthenticated) {
      console.log('Syncing Web3 User:', web3User);
      // Example: sync with backend if needed
    }
  }, [ready, isWeb3Authenticated, web3User, isAuthenticated]);

  useEffect(() => {
    if (ready && !isUserLoading) {
      const isPublicRoute = PUBLIC_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(route + '/'),
      );

      if (!isPublicRoute && !isAuthenticated && !isWeb3Authenticated) {
        router.push(Route.LOGIN);
      }
    }
  }, [
    isUserLoading,
    isAuthenticated,
    isWeb3Authenticated,
    ready,
    pathname,
    router,
  ]);

  if (isUserLoading || !ready) {
    return <LoadingPage message="Synchronizing session..." />;
  }

  return <>{children}</>;
}
