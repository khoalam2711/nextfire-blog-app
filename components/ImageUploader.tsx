import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';
import React, { ChangeEventHandler, useRef, useState } from 'react';
import { MdAddPhotoAlternate } from 'react-icons/md';
import useCurrentUser from '../hooks/useCurrentUser';
import { storage } from '../firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
const ImageUploader = () => {
	const { user } = useCurrentUser();
	const [uploading, setUploading] = useState(false);
	const [progress, setProgress] = useState(0);
	const [imageURL, setImageURL] = useState('');
	const imageUploaderInputRef = useRef<HTMLInputElement>(null);

	const handleUploadFile: ChangeEventHandler<HTMLInputElement> = async (e) => {
		// Get the file
		if (!e.target.files) return;
		const file = e.target.files[0];
		const fileExtension = file?.type.split('/')[1];

		// Make a reference to the storage bucket location
		const storageRef = ref(storage, `uploads/${user!.uid}/${Date.now()}.${fileExtension}`);

		// Start the upload task
		setUploading(true);
		const uploadTask = uploadBytesResumable(storageRef, file);

		// Monitor upload task progress
		uploadTask.on('state_changed', (snapshot) => {
			const uploadPercentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			setProgress(Math.ceil(uploadPercentage));

			uploadTask
				.then((data) => getDownloadURL(storageRef))
				.then((url) => {
					if (typeof url === 'string') {
						setImageURL(url);
						setUploading(false);
					} else {
						console.log('Something went wrong when upload the image');
					}
				});
		});
	};
	const handleOpenUploadDialog = () => {
		imageUploaderInputRef?.current?.click();
	};
	return (
		<>
			{uploading && <LinearProgress variant="determinate" value={progress} />}
			{!uploading && (
				<div>
					<input
						type="file"
						style={{ display: 'none' }}
						id="image-uploader"
						accept="image/x-png, image/gif, image/jpeg"
						onChange={handleUploadFile}
						ref={imageUploaderInputRef}
					/>
					<Button
						variant="contained"
						startIcon={<MdAddPhotoAlternate />}
						onClick={handleOpenUploadDialog}
					>
						Upload Image
					</Button>
				</div>
			)}
			{imageURL && !uploading && (
				<div>
					<p className="m-0 mt-3">Copy these lines into your post to show the uploaded image: </p>

					<div className="bg-gray-300 mt-1">
						<code>{`![alt](${imageURL})`}</code>
					</div>
					<small>
						Pro tip: You can click &quot;Preview&quot; to see the how the image would look in your
						post!
					</small>
				</div>
			)}
		</>
	);
};

export default ImageUploader;
