const { Router } = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const User = require('../models/user');

const router = Router();

router.post('/register', async (req, res) => {
	try {
		const { email, password, name } = req.body;

		const user = await User.create({
			name,
			email,
			password,
		});

		return res.json(user);
	} catch (error) {
		console.log(error.message);
		return res
			.status(201)
			.json({ status: 'error', message: error.message });
	}
});

router.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email: email });

		if (!user) {
			return res.status(201).json({
				status: 'error',
				message: 'No user found from this email',
			});
		}

		const isValidPassword = await bcrypt.compare(password, user.password);

		if (!isValidPassword) {
			return res.status(201).json({
				status: 'error',
				message: 'Invalid Password',
				user: null,
			});
		} else {
			const token = jwt.sign(
				{
					id: user._id,
					email: user.email,
					name: user.name,
					role: user.role,
				},
				process.env.SECRET
			);
			return res.json({ user: token });
		}
	} catch (error) {
		console.log(error.message);
		return res
			.status(201)
			.json({ status: 'error', message: error.message });
	}
});

module.exports = router;
