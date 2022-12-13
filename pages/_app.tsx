import type { AppProps } from 'next/app';
import Navbar from '../components/Navbar';
import { CurrentUserProvider } from '../hooks/useCurrentUser';
import '../styles/globals.css';
import { CustomToastProvider } from '../hooks/useCustomToast';
import Footer from '../components/Footer';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<CurrentUserProvider>
				<CustomToastProvider>
					<Navbar />
					<Component {...pageProps} />
					<Footer/>
				</CustomToastProvider>
			</CurrentUserProvider>
		</>
	);
}
