import { collection, doc, DocumentReference, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { FC, useState } from 'react';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import { SubmitHandler, useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Unstable_Grid2';
import AuthCheck from '../../components/AuthCheck';
import { firestore } from '../../firebase';
import useCurrentUser from '../../hooks/useCurrentUser';
import { Post } from '../../utils/typings';
import Custom404 from '../404';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import ReactMarkdown from 'react-markdown';
import useCustomToast from '../../hooks/useCustomToast';
import Link from 'next/link';

const EditPostPage = () => {
	return (
		<AuthCheck>
			<PostManager />
		</AuthCheck>
	);
};

const PostManager: FC = () => {
	const router = useRouter();
	const { user, username } = useCurrentUser();

	const [isPreviewMode, setPreviewMode] = useState(false);

	const { slug } = router.query;
	const postDoc = doc(
		collection(firestore, `users/${user?.uid}/posts`),
		slug && typeof slug === 'string' ? slug : slug![0]
	);
	const [data] = useDocumentDataOnce(postDoc);

	if (!data) return <Custom404 />;

	const post: Post = {
		content: data.content,
		heartCount: data.heartCount,
		published: data.published,
		slug: data.slug,
		title: data.title,
		username: data.username,
		createdAt: data.createdAt.toDate(),
		updatedAt: data.updatedAt.toDate(),
		uid: data.uid,
	};

	return (
		<main className="px-12 py-6 mt-3">
			<Grid container spacing={2}>
				<Grid sm={9}>
					{post && (
						<>
							<section>
								<h1>{post.title}</h1>
								<p>ID: {post.slug}</p>
							</section>
							<Paper className="p-8 pb-3 pl-4">
								<PostForm postDoc={postDoc} defaultValues={post} isPreviewMode={isPreviewMode} />
							</Paper>
						</>
					)}
				</Grid>
				<Grid sm={3}>
					<aside>
						<Button
							variant="contained"
							color="primary"
							size="large"
							fullWidth
							onClick={() => setPreviewMode(!isPreviewMode)}
						>
							{isPreviewMode ? 'Edit' : 'Preview'}
						</Button>
						<Link href={`/${username}/${post.slug}`}>
							<Button variant="contained" color="secondary" size="large" fullWidth className="mt-3">
								Live View
							</Button>
						</Link>
						<Button variant="contained" color="error" size="large" fullWidth className="mt-3">
							Delete
						</Button>
					</aside>
				</Grid>
			</Grid>
		</main>
	);
};

interface PostFormProps {
	defaultValues: { content: string; published: boolean };
	postDoc: DocumentReference;
	isPreviewMode: boolean;
}
interface PostFormInputs {
	content: string;
	published: boolean;
}

const PostForm: FC<PostFormProps> = ({ defaultValues, postDoc, isPreviewMode }) => {
	const { toast } = useCustomToast();
	const {
		watch,
		register,
		handleSubmit,
		reset,
		formState: { isDirty, isValid, errors },
	} = useForm<PostFormInputs>({
		defaultValues: defaultValues,
		mode: 'onChange',
	});

	const updatePost: SubmitHandler<PostFormInputs> = async ({ content, published }) => {
		try {
			await updateDoc(postDoc, { content, published, updatedAt: serverTimestamp() });
			reset({ content, published });
			toast('success', 'Post updated successfully!');
		} catch (e) {
			toast('error', 'Something went wrong!');
			console.log(e);
		}
	};

	return (
		<form onSubmit={handleSubmit(updatePost)}>
			{isPreviewMode ? (
				<ReactMarkdown>{watch('content')}</ReactMarkdown>
			) : (
				<>
					<TextField
						label="Post content"
						rows={15}
						placeholder="Use markdown syntax to format your post!"
						multiline
						fullWidth
						{...register('content', {
							minLength: { value: 3, message: 'Post content is too short' },
							maxLength: { value: 20000, message: 'Post content is too long' },
							required: { value: true, message: 'Post content is required' },
						})}
					/>
					{errors.content && <p className="text-red-600">{errors?.content?.message}</p>}
					<FormControlLabel
						control={<Checkbox defaultChecked />}
						label="Published"
						{...register('published')}
						className="mt-1"
					/>
					<div className="mt-2">
						<Button
							type="submit"
							variant="contained"
							color="success"
							fullWidth
							disabled={!isValid || !isDirty}
						>
							Save changes
						</Button>
					</div>
				</>
			)}
		</form>
	);
};

export default EditPostPage;
