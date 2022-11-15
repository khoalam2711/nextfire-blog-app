import React from 'react';
import Image from 'next/image';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { User } from '../utils/typings';
interface UserProfileProps {
	user: User | null | undefined;
}
const UserProfile = ({ user }: UserProfileProps) => {
	return (
		<section className="flex flex-col justify-center items-center">
			<Avatar className="cursor-pointer" sx={{ height: 130, width: 130 }}>
				{user?.photoURL && <Image src={user.photoURL} layout="fill" />}
			</Avatar>
			<Typography variant="subtitle1" className="mt-3">
				{user?.username}
			</Typography>
			<Typography variant="h4" component="h1" fontWeight={500} className="my-6">
				{user?.displayName}
			</Typography>
		</section>
	);
};

export default UserProfile;
