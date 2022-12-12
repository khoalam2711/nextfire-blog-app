import { collection, collectionGroup, doc, getDoc, getDocs } from 'firebase/firestore';
import { GetStaticPaths, GetStaticProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import React from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import Link from 'next/link';

import Grid from '@mui/material/Unstable_Grid2';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { AiOutlineHeart } from 'react-icons/ai';
import IconButton from '@mui/material/IconButton';

import Metatags from '../../components/Metatags';
import PostContent from '../../components/PostContent';
import { firestore } from '../../firebase';
import { getUserWithUsername, postToJSON } from '../../utils/helpers';
import { Post } from '../../utils/typings';
import useCurrentUser from '../../hooks/useCurrentUser';
import HeartButton from '../../components/HeartButton';

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
	const postDoc = doc(postsRef, slug);
	const postSnap = await getDoc(postDoc);
	if (!postSnap.exists()) {
		return {
			notFound: true,
		};
	}

	post = postToJSON(postSnap.data());
	path = postDoc.path;

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
	const { user } = useCurrentUser();

	const { path } = props;
	const postDoc = doc(firestore, path);
	const [realtimePost, isLoadingPost] = useDocumentData(postDoc);

	const post: any = realtimePost
		? { ...realtimePost, createdAt: realtimePost.createdAt.toDate() }
		: { ...props.post, createdAt: new Date(props.post.createdAt) };

	return (
		<>
			<Metatags title={post.title} />
			<main className="px-12 py-6 mt-3">
				<Grid container spacing={2}>
					<Grid sm={9} lg={10}>
						<Paper className="px-4 pt-8 pb-4">
							<PostContent post={post} />
						</Paper>
					</Grid>
					<Grid sm={3} lg={2}>
						<Paper className="px-4 pt-8 pb-4">
							<aside>
								<Grid container direction="column" justifyContent="center" alignItems="center">
									<Grid>
										{!isLoadingPost && (
											<>
												{user ? (
													<>
														<HeartButton postDoc={postDoc} />
														{post.heartCount}
													</>
												) : (
													<>
														<Link href="/signin">
															<IconButton>
																<AiOutlineHeart />
															</IconButton>
														</Link>
														{post.heartCount}
													</>
												)}
											</>
										)}
									</Grid>
									<Grid>
										{user && user.uid === post.uid && (
											<Link href={`/admin/${post.slug}`}>
												<Button variant="contained">Edit post</Button>
											</Link>
										)}
									</Grid>
								</Grid>
							</aside>
						</Paper>
					</Grid>
				</Grid>
			</main>
		</>
	);
};

export default PostPage;
