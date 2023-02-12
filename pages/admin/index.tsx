import {
	collection,
	doc,
	orderBy,
	query,
	serverTimestamp,
	setDoc,
} from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { ChangeEventHandler, FC, FormEventHandler, useState } from 'react';
import kebabCase from 'lodash.kebabcase';

import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { useCollection } from 'react-firebase-hooks/firestore';
import AuthCheck from '../../components/AuthCheck';
import PostFeed from '../../components/PostFeed';
import { firestore } from '../../firebase';
import useCurrentUser from '../../hooks/useCurrentUser';
import useCustomToast from '../../hooks/useCustomToast';

const AdminPostsPage: FC = () => {
	return (
		<main>
			<>
				<AuthCheck>
					<main className="py-6 px-24">
						<PostList />
						<CreateNewPost />
					</main>
				</AuthCheck>
			</>
		</main>
	);
};

const PostList: FC = () => {
	const { user } = useCurrentUser();
	const userDoc = doc(firestore, `users/${user?.uid}`);
	const postsCollection = collection(userDoc, 'posts');
	const q = query(postsCollection, orderBy('createdAt', 'desc'));

	const [querySnapshot] = useCollection(q);

	const posts: any = querySnapshot?.docs.map((doc) => doc.data());
	return (
		<>
			<h1>Manage your post</h1>
			<PostFeed posts={posts} admin/>
		</>
	);
};

const CreateNewPost: FC = () => {
	const router = useRouter();
	const { username, user } = useCurrentUser();
	const { toast } = useCustomToast();
	const [title, setTitle] = useState('');

	const slug = encodeURI(kebabCase(title));
	const isValid = title.length >= 3 && title.length <= 100;

	const handleChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event) => {
		setTitle(event.target.value);
	};

	const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
		event.preventDefault();
		
		const authorPostsCollection = collection(doc(firestore, `users/${user?.uid}`), 'posts');
		const newPostDoc = doc(authorPostsCollection, slug);

		const data = {
			title,
			slug,
			content: '',
			heartCount: 0,
			published: false,
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp(),
			uid: user?.uid,
			username,
		};
		try {
			await setDoc(newPostDoc, data);
			toast('success', 'Post successfully created!');
			router.push(`/admin/${slug}`);
		} catch (e) {
			toast('error', 'An error occurred while writing to firestore');
			console.log(e);
		}
	};
	return (
		<Paper className="mt-6 p-2">
			<form onSubmit={handleSubmit}>
				<h2 className="mt-1 ml-1">Create a new post</h2>
				<TextField
					label="Title"
					value={title}
					fullWidth
					placeholder="My awesome article!"
					onChange={handleChange}
				/>
				<div className="mt-3 ml-1">
					<strong>Slug: {slug}</strong>
				</div>
				<div className="mt-3 mb-2">
					<Button type="submit" variant="contained" disabled={!isValid} color="success">
						Create New Post
					</Button>
				</div>
			</form>
		</Paper>
	);
};

export default AdminPostsPage;
