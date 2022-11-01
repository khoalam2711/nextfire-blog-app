import CircularProgress from '@mui/material/CircularProgress';
import React from 'react';

interface SpinnerProps {
	show: boolean;
}
const LoadSpinner = ({ show }: SpinnerProps) => {
	if (show) return <CircularProgress />;
	return null;
};

export default LoadSpinner;
