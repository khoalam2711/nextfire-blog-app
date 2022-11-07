// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyB38tOI7yzPZPF1N0j4YwAWWyQt9zUJPq0',
	authDomain: 'nextfire-blog-app-51852.firebaseapp.com',
	projectId: 'nextfire-blog-app-51852',
	storageBucket: 'nextfire-blog-app-51852.appspot.com',
	messagingSenderId: '36458727693',
	appId: '1:36458727693:web:09edc07503f6e7622bc844',
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const firestore = getFirestore();
const auth = getAuth();
const storage = getStorage();
const googleAuthProvider = new GoogleAuthProvider();

export default app;
export { auth, firestore, storage, googleAuthProvider };
