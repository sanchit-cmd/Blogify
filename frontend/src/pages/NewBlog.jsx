import React, { useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function NewBlog() {
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [image, setImage] = useState(null);
	const [error, setError] = useState(null);

	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();

	async function handleSubmit(e) {
		e.preventDefault();
		setLoading(true);

		const formData = new FormData();
		formData.append('image', image);
		formData.append('title', title);
		formData.append('content', content);

		const token = localStorage.getItem('token');

		const res = await axios.post('http://localhost:3000/blog', formData, {
			headers: {
				'x-access-token': token,
			},
		});

		if (res.status !== 200) {
			setError(res.data);
		} else {
			navigate('/');
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
					onChange={e => setTitle(e.target.value)}
					value={title}
					required
				/>

				<textarea
					name='content'
					className='w-full border border-black min-h-80 py-2 px-2'
					placeholder='Content'
					id=''
					onChange={e => setContent(e.target.value)}
					value={content}
					required
				></textarea>

				<input
					type='file'
					placeholder='Image'
					className='border border-black'
					required
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
