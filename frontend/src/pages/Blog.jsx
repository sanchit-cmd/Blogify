import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Link, json, useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import Comment from '../components/Comments/Comment';
import jwt from 'jsonwebtoken';

export default function Blog() {
	const { id } = useParams();
	const navigate = useNavigate();

	const [blog, setBlog] = useState({});
	const [comments, setComments] = useState([]);
	const [currentUser, setCurrentUser] = useState('');
	const [commentInput, setCommentInput] = useState('');

	const [error, setError] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	useEffect(() => {
		async function getData() {
			const res = await axios.get(`http://localhost:3000/blog/${id}`);

			res.data.createdAt = new Date(
				res.data.createdAt
			).toLocaleDateString('en-GB');

			res.data.author =
				res.data.createdBy.name.slice(0, 1).toUpperCase() +
				res.data.createdBy.name.slice(
					1,
					res.data.createdBy.name.length
				);

			res.data.authorId = res.data.createdBy._id;
			setBlog(res.data);
		}

		getData();
	}, []);

	useEffect(() => {
		const token = localStorage.getItem('token');

		if (token) {
			const user = jwt.decode(token);

			if (user) {
				setCurrentUser(user);
			}
		}
	}, []);

	useEffect(() => {
		async function getComments() {
			const res = await axios.get(`http://localhost:3000/comments/${id}`);
			setComments(res.data.comments);
		}

		getComments();
	}, []);

	function openModal() {
		document.querySelector('#modal').showModal();
	}

	function closeModal() {
		document.querySelector('#modal').close();
	}

	function handleDeleteComment(id) {
		setComments(comments.filter(comment => comment._id !== id));
	}

	async function handlePostComment(event) {
		event.preventDefault();

		const token = localStorage.getItem('token');
		const res = await axios.post(
			`http://localhost:3000/comments/${id}`,
			{ comment: commentInput },
			{
				headers: {
					'x-access-token': token,
				},
			}
		);

		if (res.status === 200) {
			setError(false);
			setComments([
				...comments,
				{
					_id: res.data._id,
					comment: commentInput,
					createdBy: {
						_id: currentUser.id,
						name: currentUser.name,
					},
				},
			]);
			setCommentInput('');
		} else {
			setError(true);
			setErrorMessage(res.data.message);
		}
	}

	async function handleDeletePost() {
		const res = await axios.delete(`http://localhost:3000/blog/${id}`, {
			headers: {
				'x-access-token': localStorage.getItem('token'),
			},
		});

		if (res.status === 200) {
			document.querySelector('#modal').close();
			navigate('/');
		} else {
			setError(true);
			setErrorMessage(res.data.message);
			document.querySelector('#modal').close();
		}
	}

	return (
		<>
			<Layout>
				<h1 className='block text-5xl font-black mb-4'>
					{blog.title}
					<span className='font-thin text-gray-500 text-sm block mt-2'>
						Publish On: {blog.createdAt}
						<span className='ml-4'>
							Published By: {blog.author}
						</span>
					</span>
				</h1>
				{error && (
					<p className='text-red-500 text-sm text-center my-4'>
						{errorMessage}
					</p>
				)}

				{blog.authorId === currentUser.id && (
					<div className='flex items-center justify-center gap-4 mb-2'>
						<p
							className='text-red-500 text-sm cursor-pointer'
							onClick={() => {
								navigate(`/update/${id}`);
							}}
						>
							Edit
						</p>
						<p
							className='text-red-500 text-sm cursor-pointer'
							onClick={openModal}
						>
							Delete
						</p>
					</div>
				)}

				<dialog
					className='bg-white shadow-2xl px-14 py-8 rounded-lg'
					id='modal'
				>
					<p className='text-2xl block text-center mb-6'>
						Are you sure?
					</p>
					<div className='flex items-center justify-center gap-4'>
						<button
							onClick={closeModal}
							className='bg-green-600 px-6 py-2 rounded text-white'
						>
							No
						</button>
						<button
							onClick={handleDeletePost}
							className='bg-red-500 px-6 py-2 rounded text-white'
						>
							yes
						</button>
					</div>
				</dialog>

				<div className='flex items-center justify-center h-[300px] w-4/5 mx-auto overflow-hidden mb-20 rounded-md shadow-xl'>
					<img
						src={blog.imageURL}
						alt={'Cover Image'}
						className=' w-full mx-auto overflow-hidden '
					/>
				</div>

				<pre className='leading-loose text-wrap w-9/12 mx-auto mb-20'>
					{blog.content}
				</pre>

				<div className='my-2'>
					<h3 className='text-2xl font-black mb-5'>Comments</h3>
					{currentUser ? (
						<form action='' onSubmit={handlePostComment}>
							<input
								type='text'
								placeholder='Comment...'
								className='border border-black py-1 px-2 w-80'
								value={commentInput}
								onChange={e => setCommentInput(e.target.value)}
							/>
							<button className='py-1 px-4 bg-black font-medium text-white border border-black '>
								Post
							</button>
							<p className='block text-red-500 '>
								{errorMessage}
							</p>
						</form>
					) : (
						<Link to={'/login'} className='underline'>
							Login to post a comment!!!
						</Link>
					)}

					<div className='grid grid-cols-1 gap-4 mt-4 w-96'>
						{comments.map(comment => (
							<Comment
								key={comment._id}
								name={comment.createdBy.name}
								comment={comment.comment}
								commentId={comment._id}
								userId={comment.createdBy._id}
								currentUserId={currentUser.id}
								handleDeleteComment={handleDeleteComment}
							/>
						))}
					</div>
				</div>
			</Layout>
		</>
	);
}
