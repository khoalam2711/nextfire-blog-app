import Link from 'next/link';
import React from 'react';
import { MdFireplace } from 'react-icons/md';
import AppBar from '@mui/material/AppBar';
import SvgIcon from '@mui/material/SvgIcon';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import MUILink from '@mui/material/Link';
import { RiUserLine } from 'react-icons/ri';
import Image from 'next/image';
import useCurrentUser from '../hooks/useCurrentUser';

const fallbackPhotoURL =
	'https://www.wycliffe.ca/wp-content/uploads/bb-plugin/cache/member-fallback-user-image-square.png';

const Navbar = () => {
	const { user, username } = useCurrentUser();
	return (
		<AppBar position="sticky">
			<Toolbar>
				<Link href="/home">
					<SvgIcon className="mr-3 cursor-pointer">
						<MdFireplace size={25} />
					</SvgIcon>
				</Link>
				<Link href="/home" passHref>
					<MUILink
						className="text-2xl font-semibold"
						color="inherit"
						underline="none"
						sx={{ flexGrow: 1 }}
					>
						Nextfire Blog
					</MUILink>
				</Link>

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
						<Link href={`/${user}`}>
							<Avatar className="cursor-pointer">
								<Image src={user?.photoURL || fallbackPhotoURL} layout="fill" />
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
