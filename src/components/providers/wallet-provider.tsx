'use client';

import { DEFAULT_CHAIN, SUPPORTED_CHAINS } from '@/constants/chains';
import { PRIVY_APP_ID } from '@/constants/env';
import { PrivyProvider as Web3Provider } from '@privy-io/react-auth';
import { ReactNode } from 'react';

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  if (!PRIVY_APP_ID) {
    console.error('App ID is missing in environment variables');
    return <>{children}</>;
  }

  return (
    <Web3Provider
      appId={PRIVY_APP_ID}
      config={{
        appearance: {
          theme: 'dark',
          logo: '/logo.png',
          showWalletLoginFirst: true,
          walletList: ['metamask', 'coinbase_wallet', 'phantom', 'rainbow'],
        },
        defaultChain: DEFAULT_CHAIN,
        supportedChains: SUPPORTED_CHAINS,
      }}
    >
      {children}
    </Web3Provider>
  );
}
