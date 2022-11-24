import React, { createContext, FC, useState, ReactNode, useContext } from 'react';

import Alert, { AlertColor } from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

interface ICustomToast {
	toast: (severity: AlertColor, message: string) => void;
}

const CustomToastContext = createContext<ICustomToast>({
	toast: () => {},
});

interface CustomToastProviderProps {
	children: ReactNode;
}

export const CustomToastProvider: FC<CustomToastProviderProps> = ({ children }) => {
	const [open, setOpen] = useState(false);
	const [message, setMessage] = useState('');
	const [severity, setSeverity] = useState<AlertColor>('success');

	const toast = (severity: AlertColor, message: string) => {
		setMessage(message);
		setOpen(true);
		setSeverity(severity);
	};

	const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
		if (reason === 'clickaway') {
			return;
		}

		setOpen(false);
	};

	const data = { toast };

	return (
		<CustomToastContext.Provider value={data}>
			{children}
			<Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
				<Alert onClose={handleClose} variant="filled" severity={severity} sx={{ width: '100%' }}>
					{message}
				</Alert>
			</Snackbar>
		</CustomToastContext.Provider>
	);
};

export default function useCustomToast() {
	return useContext(CustomToastContext);
}
