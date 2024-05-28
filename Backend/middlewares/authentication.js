const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

async function authentication(req, res, next) {
	try {
		const token = req.headers['x-access-token'];
		if (!token) {
			return next();
		}
		const user = jwt.verify(token, process.env.SECRET);
		req.user = user;
		return next();
	} catch (error) {
		return res.status(201).json({ message: error.message });
	}
}

async function authenticateAndAuthorize(req, res, next) {
	try {
		const token = req.headers['x-access-token'];
		if (!token) {
			throw new Error('You are not logged in...');
		}

		const user = jwt.verify(token, process.env.SECRET);
		req.user = user;

		return next();
	} catch (error) {
		console.log(error);
		return res.status(201).json({ message: error.message });
	}
}

module.exports = {
	authentication,
	authenticateAndAuthorize,
};
