import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import AppBar from '@mui/material/AppBar';
import SvgIcon from '@mui/material/SvgIcon';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

import { MdFireplace } from 'react-icons/md';

import useCurrentUser from '../hooks/useCurrentUser';
import { FALLBACK_PHOTO_URL } from '../utils/constants';

const Navbar = () => {
	const { user, username } = useCurrentUser();
	return (
		<AppBar position="sticky">
			<Toolbar>
				<Link href="/">
					<SvgIcon className="mr-3 cursor-pointer">
						<MdFireplace size={25} />
					</SvgIcon>
				</Link>
				<div className="text-2xl font-semibold flex-grow">
					<Link href="/">
						Nextfire Blog
					</Link>
				</div>

				{/* user is signed in and has username */}
				{username && (
					<>
						<Button color="inherit" className="mr-4">
							Sign Out
						</Button>
						<Link href="/admin">
							<Button color="inherit" className="mr-4">
								Write Post
							</Button>
						</Link>
						<Link href={`/${username}`}>
							<Avatar className="cursor-pointer">
								<Image
									src={user?.photoURL || FALLBACK_PHOTO_URL}
									layout="fill"
								/>
							</Avatar>
						</Link>
					</>
				)}

				{/* user is not signed in OR has not created username */}
				{!username && (
					<Link href="/signin">
						<Button color="inherit">Sign In</Button>
					</Link>
				)}
			</Toolbar>
		</AppBar>
	);
};

export default Navbar;
