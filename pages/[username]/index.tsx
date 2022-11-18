import {
	collection,
	getDocs,
	limit,
	orderBy,
	query,
	where,
} from 'firebase/firestore';
import { GetServerSideProps } from 'next';
import React from 'react';
import PostFeed from '../../components/PostFeed';
import UserProfile from '../../components/UserProfile';
import { getUserWithUsername, postToJSON } from '../../utils/helpers';
import { Post, User } from '../../utils/typings';

export const getServerSideProps: GetServerSideProps = async ({
	query: queryStrings,
}) => {
	const { username } = queryStrings;
	if (!username)
		return {
			props: {},
		};
	const userDoc = await getUserWithUsername(username);

	// JSON serializable data
	let user: any;
	let posts: any;

	if (userDoc?.exists()) {
		user = userDoc.data();
		const postsRef = collection(userDoc.ref, '/posts');
		const q = query(
			postsRef,
			where('published', '==', true),
			orderBy('createdAt', 'desc'),
			limit(5)
		);
		try {
			posts = (await getDocs(q)).docs.map((doc) => postToJSON(doc.data()));
		} catch (error) {
			console.log(error);
		}
	}

	return {
		props: { user, posts },
	};
};

interface UserProfilePageProps {
	user: User;
	posts: Post[];
}

const UserProfilePage = ({ user, posts }: UserProfilePageProps) => {
	return (
		<main className="p-12 px-24">
			<UserProfile user={user} />
			<PostFeed posts={posts} />
		</main>
	);
};

export default UserProfilePage;
