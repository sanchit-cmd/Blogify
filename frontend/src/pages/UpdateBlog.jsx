import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdateBlog() {
	const { id } = useParams();
	const navigate = useNavigate();

	const [blog, setBlog] = useState({});
	const [image, setImage] = useState('');

	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		async function getBlog() {
			const res = await axios.get(`http://localhost:3000/blog/${id}`);

			if (res.status !== 200) {
				setError(res.data.message);
				setLoading(false);
			} else {
				setBlog(res.data);
			}
		}
		getBlog();
	}, []);

	async function handleSubmit(event) {
		event.preventDefault();

		setLoading(true);
		const formData = new FormData();
		formData.append('image', image);
		formData.append('title', blog.title);
		formData.append('content', blog.content);

		const res = await axios.put(`http://localhost:3000/blog/${id}`, formData, {
			headers: {
				'x-access-token': localStorage.getItem('token'),
			},
		});

		if (res.status !== 200) {
			setError(res.data.message);
			setLoading(false);
		} else {
			navigate(`/blog/${id}`);
			setLoading(false);
		}
	}

	return (
		<Layout>
			<form
				action=''
				className='flex items-center justify-between flex-col gap-6 w-1/2 mx-auto'
				onSubmit={handleSubmit}
			>
				<h3 className='font-black text-3xl underline'>Post a Blog</h3>
				<input
					type='text'
					placeholder='Title'
					className='py-2 px-2 border border-black w-full'
					onChange={e =>
						setBlog({
							...blog,
							title: e.target.value,
						})
					}
					value={blog.title}
					required
				/>

				<textarea
					name='content'
					className='w-full border border-black min-h-80 py-2 px-2'
					placeholder='Content'
					onChange={e =>
						setBlog({
							...blog,
							content: e.target.value,
						})
					}
					value={blog.content}
					required
				></textarea>

				<input
					type='file'
					placeholder='Image'
					className='border border-black'
					accept='image/*'
					onChange={e => setImage(e.target.files[0])}
				/>

				<button
					disabled={loading}
					className='bg-black text-white font-medium w-full py-3'
				>
					{loading ? 'Uploading...' : 'Post'}
				</button>

				{error && (
					<p className='text-red-500 text-center'>{error.message}</p>
				)}
			</form>
		</Layout>
	);
}
