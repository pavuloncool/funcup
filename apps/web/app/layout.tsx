import './globals.css';
import Providers from './providers';

export default function RootLayout(props: { children: JSX.Element | JSX.Element[] }) {
  return (
    <html lang="en">
      <body>
        <Providers>{props.children}</Providers>
      </body>
    </html>
  );
}

