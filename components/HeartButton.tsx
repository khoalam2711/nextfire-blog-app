import React, { FC } from 'react';
import IconButton from '@mui/material/IconButton';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import {
	collection,
	doc,
	DocumentReference,
	increment,
	writeBatch,
	WriteBatch,
} from 'firebase/firestore';
import useCurrentUser from '../hooks/useCurrentUser';
import { useDocument } from 'react-firebase-hooks/firestore';
import { firestore } from '../firebase';

interface HeartButtonProps {
	postDoc: DocumentReference;
}

const HeartButton: FC<HeartButtonProps> = ({ postDoc }) => {
	const { user } = useCurrentUser();

	// Listen to heart doc for currently logged in user
	const userHeartedDoc = doc(collection(postDoc, 'hearts'), user?.uid);
	const [userHeartedSnap, loading] = useDocument(userHeartedDoc);

	const handleHeart = async () => {
		const uid = user?.uid;
		const batch = writeBatch(firestore);

		batch.set(userHeartedDoc, { uid });
		batch.update(postDoc, { heartCount: increment(1) });

		await batch.commit();
	};

	const handleUnHeart = async () => {
		const uid = user?.uid;
		const batch = writeBatch(firestore);

		batch.delete(userHeartedDoc);
		batch.update(postDoc, { heartCount: increment(-1) });

		await batch.commit();
	};
	console.log('userHeartedSnap?.exists()', userHeartedSnap?.exists());
	if (loading) return null;
	return userHeartedSnap?.exists() ? (
		<IconButton onClick={handleUnHeart}>
			<AiFillHeart />
		</IconButton>
	) : (
		<IconButton onClick={handleHeart}>
			<AiOutlineHeart />
		</IconButton>
	);
};

export default HeartButton;
