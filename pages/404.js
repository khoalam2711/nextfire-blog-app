import Link from 'next/link';
import React from 'react';

const Custom404 = () => {
	return (
		<main className="flex flex-col justify-center items-center h-[95vh]">
			<div>404 | Page Not Found</div>
			<br />
			<div>
				<Link href="/">
					<span className="underline cursor-pointer text-cyan-500">
						Go home
					</span>
				</Link>
			</div>
		</main>
	);
};

export default Custom404;
