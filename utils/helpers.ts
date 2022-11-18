import {
	collection,
	DocumentData,
	getDocs,
	query,
	where,
} from 'firebase/firestore';
import { firestore } from '../firebase';

/**
 * Gets a user/{uid} document with username
 * @param username
 */
export async function getUserWithUsername(username: string | string[]) {
	const usersRef = collection(firestore, 'users');
	const q = query(
		usersRef,
		where(
			'username',
			'==',
			typeof username === 'string' ? username : username[0]
		)
	);
	try {
		let userDoc = (await getDocs(q)).docs[0];
		return userDoc;
	} catch (error) {
		window.alert('Cannot get user with username');
		console.log(error);
	}
}

/**
 * Converts a firestore document to JSON
 * @param {DocumentSnapshot} doc
 */
export function postToJSON(data: DocumentData) {
	return {
		...data,
		createdAt: data.createdAt.toMillis(),
		updatedAt: data.updatedAt.toMillis(),
	};
}
