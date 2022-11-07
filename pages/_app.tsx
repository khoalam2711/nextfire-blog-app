import type { AppProps } from 'next/app';
import Navbar from '../components/Navbar';
import { CurrentUserProvider } from '../hooks/useCurrentUser';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<CurrentUserProvider>
				<Navbar />
				<Component {...pageProps} />
			</CurrentUserProvider>
		</>
	);
}
