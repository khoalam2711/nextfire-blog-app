import type { AppProps } from 'next/app';
import Navbar from '../components/Navbar';
import { CurrentUserProvider } from '../hooks/useCurrentUser';
import '../styles/globals.css';
import { CustomToastProvider } from '../hooks/useCustomToast';
import Footer from '../components/Footer';
import { StyledEngineProvider } from '@mui/material/styles';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<StyledEngineProvider injectFirst>
				<CurrentUserProvider>
					<CustomToastProvider>
						<Navbar />
						<Component {...pageProps} />
						<Footer />
					</CustomToastProvider>
				</CurrentUserProvider>
			</StyledEngineProvider>
		</>
	);
}
