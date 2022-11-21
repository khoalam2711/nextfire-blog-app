import React from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

import Grid from '@mui/material/Unstable_Grid2';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';

import { AiOutlineHeart } from 'react-icons/ai';
import { Post } from '../utils/typings';
interface PostContentProps {
	post: Post;
}

const PostContent = ({ post }: PostContentProps) => {
	return (
		<>
			<Grid container spacing={2}>
				<Grid sm={10}>
					<Paper className="px-4 pt-8 pb-4">
						<article>
							<h1>{post.title}</h1>
							<p>
								Written by{' '}
								<Link href={`/${post.username}`}>
									<span className="font-semibold cursor-pointer underline text-cyan-500">
										@{post.username}
									</span>
								</Link>{' '}
								on {post.createdAt.toLocaleString()}
							</p>
							<section>
								<ReactMarkdown>{post.content}</ReactMarkdown>
							</section>
						</article>
					</Paper>
				</Grid>
				<Grid sm={2}>
					<Paper className="px-4 pt-8 pb-4">
						<aside>
							<Grid
								container
								direction="column"
								justifyContent="center"
								alignItems="center"
							>
								<Grid>
									<IconButton>
										<AiOutlineHeart />
									</IconButton>
									{post.heartCount}
								</Grid>
								<Grid>
									<Button variant="contained">
										Edit post
									</Button>
								</Grid>
							</Grid>
						</aside>
					</Paper>
				</Grid>
			</Grid>
			</>
	);
};

export default PostContent;
