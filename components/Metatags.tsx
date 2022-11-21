import Head from 'next/head';
import React from 'react';

interface MetatagsProps {
	title?: string;
	description?: string;
	image?: string;
}

const Metatags = ({ title, description, image }: MetatagsProps) => {
	return (
		<Head>
			<title>{title}</title>
			<meta property="og:title" content={title} />
			<meta property="og:description" content={description} />
			<meta property="og:image" content={image} />
		</Head>
	);
};

export default Metatags;
