import { AppOpenGate } from '../components/AppOpenGate';
import './globals.css';
import Providers from './providers';

export default function RootLayout(props: { children: JSX.Element | JSX.Element[] }) {
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

