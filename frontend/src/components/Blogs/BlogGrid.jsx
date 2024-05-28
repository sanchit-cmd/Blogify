import React from 'react';
import BlogCard from './BlogCard';

export default function BlogGrid({ blogs }) {
	return (
		<div className='w-4/5 mx-auto grid grid-cols-1 gap-4'>
			{blogs.map(blog => (
				<BlogCard
					key={blog._id}
					id={blog._id}
					title={blog.title}
					content={blog.content}
					author={blog.createdBy.name}
					imageURL={blog.imageURL}
				/>
			))}
		</div>
	);
}
