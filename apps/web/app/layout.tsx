import './globals.css';

export default function RootLayout(props: { children: JSX.Element | JSX.Element[] }) {
  return (
    <html lang="en">
      <body>{props.children}</body>
    </html>
  );
}

