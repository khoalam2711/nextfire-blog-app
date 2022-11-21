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
import { useDocumentData } from 'react-firebase-hooks/firestore';
import Metatags from '../../components/Metatags';
import PostContent from '../../components/PostContent';

import { firestore } from '../../firebase';
import { getUserWithUsername, postToJSON } from '../../utils/helpers';
import { Post } from '../../utils/typings';

interface IStaticPropsParams extends ParsedUrlQuery {
	username: string;
	slug: string;
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const { username, slug } = params as IStaticPropsParams;

	const authorDoc = await getUserWithUsername(username);
	if (!authorDoc?.exists()) {
		return {
			notFound: true,
		};
	}

	let post;
	let path;

	const postsRef = collection(authorDoc.ref, 'posts');
	const postRef = doc(postsRef, slug);
	const postDoc = await getDoc(postRef);
	if (!postDoc.exists()) {
		return {
			notFound: true,
		};
	}

	post = postToJSON(postDoc.data());
	path = postRef.path;
	
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

interface PostPageProps {
	post: Post;
	path: string;
}

const PostPage = (props: PostPageProps) => {
	const { path } = props;
	const postRef = doc(firestore, path);
	const [realtimePost] = useDocumentData(postRef);

	// const post: PostPage = realtimePost ? {...realtimePost, createdAt: realtimePost.createdAt.toDate()} || {...props.post, createdAt: new Date(props.post.createdAt)}:

	const post: any = realtimePost
		? { ...realtimePost, createdAt: realtimePost.createdAt.toDate() }
		: { ...props.post, createdAt: new Date(props.post.createdAt) };

	return (
		<>
			<Metatags title={post.title} />
			<main className="px-12 py-6 mt-3">
				<PostContent post={post} />;
			</main>
		</>
	);
};

export default PostPage;
