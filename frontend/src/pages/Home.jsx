import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import BlogGrid from '../components/Blogs/BlogGrid';

export default function Home() {
	const [blogs, setBLogs] = useState([]);

	useEffect(() => {
		async function getData() {
			const data = await axios.get('http://localhost:3000/blog');
			setBLogs(data.data.data);
		}
		getData();
	}, []);

	return (
		<Layout>
			<BlogGrid blogs={blogs} />
		</Layout>
	);
}
