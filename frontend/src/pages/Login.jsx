import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import axios from 'axios';

export default function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const [error, setError] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const navigate = useNavigate();

	async function handleSubmit(event) {
		event.preventDefault();

		const res = await axios.post('http://localhost:3000/user/login', {
			email,
			password,
		});

		if (res.status === 200) {
			localStorage.setItem('token', res.data.user);
			navigate('/');
		} else {
			setError(true);
			setErrorMessage(res.data.message);
		}
	}

	return (
		<Layout>
			<div className='bg-white w-80 px-6 py-12 shadow-[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_0px_4px_6px_-1px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset] rounded-2xl flex items-center justify-between flex-col mx-auto my-10 gap-10'>
				<h3 className='text-xl font-black text-center'>Login</h3>

				<form
					action=''
					className='flex flex-col gap-4 w-full'
					onSubmit={handleSubmit}
				>
					<input
						type='text'
						placeholder='Email'
						className='py-2 px-1 border-black border-2 rounded-lg w-full'
						onChange={e => setEmail(e.target.value)}
						value={email}
						required
					/>
					<input
						type='password'
						placeholder='Password'
						className='py-2 px-1 border-black border-2 rounded-lg w-full'
						onChange={e => setPassword(e.target.value)}
						value={password}
						required
					/>

					<button className='bg-black text-white px-3 py-2 rounded-lg font-medium'>
						Login
					</button>
				</form>

				{error && (
					<p className='text-sm font-bold text-red-600'>
						{errorMessage}
					</p>
				)}

				<p className='text-sm text-gray-500'>
					Dont'have an account?{' '}
					<Link to={'/singup'} className='text-blue-400'>
						Singup
					</Link>
				</p>
			</div>
		</Layout>
	);
}
