import React, { useState } from 'react';
import axios from 'axios';

export default function Comment({
	commentId,
	currentUserId,
	userId,
	name,
	comment,
	handleDeleteComment,
}) {
	name = name.slice(0, 1).toUpperCase() + name.slice(1, name.length);

	const [error, setError] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	async function handleDelete() {
		const token = localStorage.getItem('token');

		const res = await axios.delete(
			`http://localhost:3000/comments/${commentId}`,
			{
				headers: {
					'x-access-token': token,
				},
			}
		);
		console.log(res);

		if (res.status === 200) {
			setError(false);
			handleDeleteComment(commentId);
		} else {
			setError(true);
			setErrorMessage(res.data.message);
		}
	}

	return (
		<div className='px-2 py-1 border-b border-black'>
			<h3 className='text-xl text-black font-bold block'>
				@{name} {'  '}{' '}
				{userId === currentUserId && (
					<button
						className='text-red-500 font-thin text-sm'
						onClick={handleDelete}
					>
						Delete
					</button>
				)}
			</h3>
			<p className='text-gray-700 text-sm text-wrap'>{comment}</p>

			{error && <p className='text-red-500'>{errorMessage}</p>}
		</div>
	);
}
