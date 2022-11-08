import {
	createContext,
	useState,
	useEffect,
	useContext,
	ReactNode,
} from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, firestore } from '../firebase';
interface ICurrentUser {
	user: User | null | undefined;
	username: string | null;
}

export const CurrentUserContext = createContext<ICurrentUser>({
	user: null,
	username: null,
});

interface CurrentUserProviderProps {
	children: ReactNode;
}

export const CurrentUserProvider = ({ children }: CurrentUserProviderProps) => {
	const [user] = useAuthState(auth);
	const [username, setUsername] = useState<string | null>(null);

	useEffect(() => {
		let unsubscribe;

		if (user) {
			// const collectionRef = collection(firestore, '/users', user.uid);
			const documentRef = doc(firestore, '/users', user.uid);
			unsubscribe = onSnapshot(documentRef, (doc) => {
				setUsername(doc.data()?.username);
			});
		} else {
			setUsername(null);
		}
		return unsubscribe;
	}, [user]);

	return (
		<CurrentUserContext.Provider value={{ user, username }}>
			{children}
		</CurrentUserContext.Provider>
	);
};

export default function useCurrentUser() {
	return useContext(CurrentUserContext);
}
