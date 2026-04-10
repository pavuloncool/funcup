import type { ReactNode } from 'react';
import { AppOpenGate } from '../components/AppOpenGate';
import './globals.css';
import Providers from './providers';

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AppOpenGate>{props.children}</AppOpenGate>
        </Providers>
      </body>
    </html>
  );
}

