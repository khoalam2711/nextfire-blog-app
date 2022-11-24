import { signInWithPopup } from 'firebase/auth';
import React, { ReactElement } from 'react';
import { auth, googleAuthProvider } from '../firebase';

import Button from '@mui/material/Button';
import { FcGoogle } from 'react-icons/fc';
import useCurrentUser from '../hooks/useCurrentUser';
import UsernameForm from '../components/UsernameForm';
import { useRouter } from 'next/router';

const SignIn = () => {
	const { user, username } = useCurrentUser();
	return (
		<main className="mt-4 p-10">
			{user ? (
				username ? (
					<SignOutButton />
				) : (
					<UsernameForm />
				)
			) : (
				<SignInButton />
			)}
		</main>
	);
};

function SignInButton(): ReactElement {
	const router = useRouter();
	const signInWithGoogle = async () => {
		try {
			await signInWithPopup(auth, googleAuthProvider);
			router.replace('/');
		} catch (e) {
			window.alert(e);
			console.log(e);
		}
	};

	return (
		<>
			<Button
				variant="contained"
				color="primary"
				size="large"
				startIcon={<FcGoogle />}
				className="btn-light"
				onClick={signInWithGoogle}
			>
				Sign In With Google
			</Button>
		</>
	);
}

function SignOutButton(): ReactElement {
	return (
		<Button
			variant="contained"
			color="primary"
			size="large"
			className="btn-light"
			onClick={() => auth.signOut()}
		>
			Sign Out
		</Button>
	);
}

export default SignIn;
