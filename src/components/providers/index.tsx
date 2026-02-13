import { ReactNode } from 'react';
import { AuthProvider } from './auth-provider';
import { QueryProvider } from './query-provider';
import { UIProvider } from './ui-provider';
import { Updater } from './updater';
import { WalletProvider } from './wallet-provider';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <UIProvider>
        <WalletProvider>
          <AuthProvider>
            <Updater />
            {children}
          </AuthProvider>
        </WalletProvider>
      </UIProvider>
    </QueryProvider>
  );
}
