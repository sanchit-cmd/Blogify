import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Singup from './pages/Singup';
import Blog from './pages/Blog';
import NewBlog from './pages/NewBlog';

function App() {
	return (
		<>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/login' element={<Login />} />
				<Route path='/singup' element={<Singup />} />
				<Route path='/blog/:id' element={<Blog />} />
				<Route path='/new-blog' element={<NewBlog />} />
			</Routes>
		</>
	);
}

export default App;
