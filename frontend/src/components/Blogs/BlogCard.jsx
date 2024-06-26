import React from 'react';
import { Link } from 'react-router-dom';

export default function BlogCard({ id, title, content, author, imageURL }) {
	return (
		<Link
			to={`/blog/${id}`}
			className='flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100  mx-auto w-full'
		>
			<img
				className='object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg'
				src={imageURL}
				alt={title}
			/>
			<div className='flex flex-col justify-between p-4 leading-normal'>
				<h5 className='mb-2 text-2xl font-bold tracking-tight text-gray-900 '>
					{title}
				</h5>
				<p className='mb-3 font-normal text-gray-700 '>
					{content.length < 150
						? content + '...'
						: content.slice(0, 150) + '...'}
				</p>
			</div>
		</Link>
	);
}
