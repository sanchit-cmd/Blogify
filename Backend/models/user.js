const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

var userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		role: {
			type: String,
			required: true,
			default: 'USER',
		},
		password: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		return next();
	}

	try {
		const hashedPassword = await bcrypt.hash(this.password, 10);
		this.password = hashedPassword;

		return next();
	} catch (error) {
		return next(error);
	}
});

const User = mongoose.model('user', userSchema);
module.exports = User;
