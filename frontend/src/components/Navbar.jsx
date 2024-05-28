import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import jwt from 'jsonwebtoken';

export default function Navbar() {
	const [isLoggedIn, setIsLoggedIn] = useState(true);
	const [name, setName] = useState('');

	const navigate = useNavigate();

	useEffect(() => {
		async function verify() {
			const token = localStorage.getItem('token');

			if (!token) {
				setIsLoggedIn(false);
			} else {
				const user = jwt.decode(token);
				if (!user) {
					setIsLoggedIn(false);
				} else {
					setIsLoggedIn(true);
					const newName =
						user.name.slice(0, 1).toUpperCase() +
						user.name.slice(1, user.name.length);
					setName(newName);
				}
			}
		}

		verify();
	}, []);

	function handleLogout() {
		localStorage.removeItem('token');
		navigate('/login');
	}

	return (
		<nav className='w-screen py-3 mb-6'>
			<div className='w-4/5 mx-auto flex justify-between items-center'>
				<Link to={'/'}>
					<h1 className='text-3xl font-black'>Blogify</h1>
				</Link>
				<ul className='flex justify-between items-center gap-4'>
					<li>
						<Link to={'/'}>Home</Link>
					</li>

					{!isLoggedIn && (
						<li>
							<Link
								to={'/login'}
								className='px-3 py-2 bg-black text-white rounded-md'
							>
								Login
							</Link>
						</li>
					)}
					{isLoggedIn && (
						<li className='group font-medium relative cursor-pointer'>
							{name}
							<div className='bg-slate-100 hidden absolute top-6 left-0 hover:flex group-hover:flex flex-col gap-2 w-fit px-4 py-3 z-10 rounded shadow-[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_0px_4px_6px_-1px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset]'>
								<Link
									className='w-full text-nowrap'
									to={'/new-blog'}
								>
									New Blog
								</Link>
								<hr />
								<div
									className='cursor-pointer'
									onClick={handleLogout}
								>
									Logout
								</div>
							</div>
						</li>
					)}
				</ul>
			</div>
		</nav>
	);
}
