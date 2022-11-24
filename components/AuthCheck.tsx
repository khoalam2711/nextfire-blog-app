import Link from 'next/link';
import React, { ReactNode } from 'react';
import useCurrentUser from '../hooks/useCurrentUser';

interface AuthCheckProps {
	children: JSX.Element;
	fallback?: JSX.Element;
}

const AuthCheck = ({ children, fallback }: AuthCheckProps) => {
	const { username } = useCurrentUser();

	if (username) return children;
	else
		return (
			fallback || (
				<div>
					You must be{' '}
					<span className="font-semibold cursor-pointer underline text-cyan-500">
						<Link href="/signin">signed in</Link>
					</span>
				</div>
			)
		);
};

export default AuthCheck;
