import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';

export default function Blog() {
	const { id } = useParams();
	const [blog, setBlog] = useState({});

	useEffect(() => {
		async function getData() {
			const res = await axios.get(`http://localhost:3000/blog/${id}`);

			res.data.createdAt = new Date(
				res.data.createdAt
			).toLocaleDateString('en-GB');

			setBlog(res.data);
		}

		getData();
	}, []);

	return (
		<>
			<Layout>
				<h1 className='block text-5xl font-black mb-4'>
					{blog.title}
					<span className='font-thin text-gray-500 text-sm block mt-2'>
						Publish On: {blog.createdAt}
					</span>
				</h1>

				<div className='flex items-center justify-center h-[500px] w-4/5 mx-auto overflow-hidden mb-20 rounded-md shadow-xl'>
					<img
						src={blog.imageURL}
						alt={'Cover Image'}
						className=' w-full mx-auto overflow-hidden '
					/>
				</div>

				<pre className='leading-loose text-wrap w-9/12 mx-auto'>
					{blog.content}
				</pre>
			</Layout>
		</>
	);
}
