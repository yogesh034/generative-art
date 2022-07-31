import '../styles/index.scss';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Header from '../components/Header';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className='dark:bg-neutral-900'>
      <Header />
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
