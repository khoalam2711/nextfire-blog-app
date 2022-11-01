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

const Navbar = () => {
	const { user, username } = { user: 'Khoa', username: 'Khoa' };
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
						<Link href="/admin">
							<Button color="inherit" className="mr-4">
								Write Post
							</Button>
						</Link>
						<Link href={`/${user}`}>
							<Avatar className="cursor-pointer">
								<SvgIcon>
									<RiUserLine />
								</SvgIcon>
							</Avatar>
						</Link>
					</>
				)}

				{/* user is not signed in OR has not created username */}
				{!username && (
					<Link href="/enter">
						<Button color="inherit">Log in</Button>
					</Link>
				)}
			</Toolbar>
		</AppBar>
	);
};

export default Navbar;
