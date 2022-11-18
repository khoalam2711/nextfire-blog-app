import {
	collection,
	collectionGroup,
	doc,
	getDoc,
	getDocs,
} from 'firebase/firestore';
import { GetStaticPaths, GetStaticProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import React from 'react';
import { firestore } from '../../firebase';
import { getUserWithUsername, postToJSON } from '../../utils/helpers';

interface IStaticPropsParams extends ParsedUrlQuery {
	username: string;
	slug: string;
}
export const getStaticProps: GetStaticProps = async ({ params }) => {
	const { username, slug } = params as IStaticPropsParams;

	const authorDoc = await getUserWithUsername(username);
	let post;
	let path;

	if (authorDoc?.exists()) {
		const postsRef = collection(authorDoc.ref, 'posts');
		const postRef = doc(postsRef, slug);
		const postDoc = await getDoc(postRef);
		if (postDoc.exists()) {
			post = postToJSON(postDoc.data());
			path = postRef.path;
		}
	}

	return {
		props: { post, path },
		revalidate: 5000,
	};
};

export const getStaticPaths: GetStaticPaths = async () => {
	const postsRef = collectionGroup(firestore, 'posts');

	const paths = (await getDocs(postsRef)).docs.map((doc) => {
		const { slug, username } = doc.data();
		return {
			params: { username, slug },
		};
	});

	return {
		paths,
		fallback: 'blocking',
	};
};
const Post = () => {
	return <div>Post</div>;
};

export default Post;
