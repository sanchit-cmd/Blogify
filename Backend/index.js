const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const UserRouter = require('./routes/user');
const BlogRouter = require('./routes/blog');
const CommentRouter = require('./routes/comments');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.connect(process.env.MONGO_URL).then(() => {
	console.log('MongoDB connected');
});

app.use('/user', UserRouter);
app.use('/blog', BlogRouter);
app.use('/comments', CommentRouter)

app.listen(process.env.PORT || 3000, () => {
	console.log('server is running on port 3000');
});
