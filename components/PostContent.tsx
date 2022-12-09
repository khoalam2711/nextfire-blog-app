import React from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

import style from './style.module.css';
import { Post } from '../utils/typings';
interface PostContentProps {
	post: Post;
}

const PostContent = ({ post }: PostContentProps) => {
	return (
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
			<section className={style.markdown}>
				<ReactMarkdown>{post.content}</ReactMarkdown>
			</section>
		</article>
	);
};

export default PostContent;
