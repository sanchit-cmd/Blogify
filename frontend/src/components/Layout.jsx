import React from 'react';
import Navbar from './Navbar';

export default function Layout(props) {
	return (
		<>
			<Navbar />
			<main className='w-4/5 mx-auto overflow-x-hidden'>{props.children}</main>
		</>
	);
}
