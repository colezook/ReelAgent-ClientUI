import '../styles/globals.css';
import { ThemeProvider } from 'next-themes';
import { MyAppProps } from '../src/types';

function MyApp({ Component, pageProps }: MyAppProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
