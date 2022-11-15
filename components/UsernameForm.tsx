import {
	useState,
	ChangeEventHandler,
	useEffect,
	useCallback,
	FormEventHandler,
	FC,
} from 'react';
import { doc, getDoc, writeBatch } from 'firebase/firestore';
import debounce from 'lodash.debounce';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import useCurrentUser from '../hooks/useCurrentUser';
import { firestore } from '../firebase';

const UsernameForm = () => {
	const { username, user } = useCurrentUser();

	const [formValue, setFormValue] = useState('');
	const [isValid, setIsValid] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		checkUsername(formValue);
	}, [formValue]);

	const checkUsername = useCallback(
		debounce(async (username: string) => {
			if (username.length >= 3) {
				const documentRef = doc(firestore, `usernames/${username}`);
				const documentSnap = await getDoc(documentRef);
				setIsValid(!documentSnap.exists());
				setIsLoading(false);
			}
		}, 500),
		[]
	);

	const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
		const value = e.target.value.toLowerCase();
		const regex = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

		if (value.length < 3) {
			setError('Username must be at least 3 characters');
			setFormValue(value);
			setIsValid(false);
			setIsLoading(false);
		}

		if (regex.test(value)) {
			setError('');
			setFormValue(value);
			setIsLoading(true);
			setIsValid(false);
		}
	};

	const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();

		// Create refs for both documents
		const userDoc = doc(firestore, `users/${user?.uid}`);
		const usernameDoc = doc(firestore, `usernames/${formValue}`);

		// Commit both docs together as a batch write
		const batch = writeBatch(firestore);
		batch.set(userDoc, {
			username: formValue,
			photoURL: user?.photoURL,
			displayName: user?.displayName,
		});
		batch.set(usernameDoc, { uid: user?.uid });

		try {
			await batch.commit();
		} catch (e) {
			window.alert(e);
			console.log(e);
		}
	};

	if (username) return null;
	return (
		<section className="md:w-[90%] mx-auto">
			<form onSubmit={handleSubmit}>
				<h3>Choose a username:</h3>
				<TextField
					label="Username"
					variant="outlined"
					fullWidth
					value={formValue}
					onChange={handleChange}
				/>
				<UsernameCheckMessage
					isLoading={isLoading}
					isValid={isValid}
					username={formValue}
				/>
				<Button
					color="success"
					variant="contained"
					className="mt-3"
					type="submit"
					disabled={!isValid}
				>
					CONFIRM CHOICE
				</Button>
			</form>

			{/* Debug section */}
			{/* <h3>Debug State</h3>
				<div>
					Username: {formValue}
					<br />
					Loading: {isLoading.toString()}
					<br />
					Username valid: {isValid.toString()}
				</div> */}
		</section>
	);
};

interface UsernameCheckMessageProps {
	isValid: boolean;
	isLoading: boolean;
	username: string;
}

const UsernameCheckMessage = ({
	isValid,
	isLoading,
	username,
}: UsernameCheckMessageProps) => {
	if (!username) return null;
	if (isLoading)
		return (
			<Typography className={'mt-3 font-semibold'}>Checking...</Typography>
		);
	return (
		<Typography
			color={isValid ? 'green' : 'red'}
			className={'mt-3 font-semibold'}
		>
			{isValid
				? `${username} is available!`
				: `${username} is either taken or invalid`}
		</Typography>
	);
};
export default UsernameForm;
