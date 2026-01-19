import { ReactNode } from 'react';
import { AppContainer } from '@/components/app/container';

export const metadata = {
  title: 'Manga Studio Creator',
  description: 'Create stunning manga with AI',
};

export default function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AppContainer>
      {children}
    </AppContainer>
  );
}
