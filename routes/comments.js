const { Router } = require('express');

const { authenticateAndAuthorize } = require('../middlewares/authentication');
const Comment = require('../models/comments');
const User = require('../models/user');

const router = Router();

//get all comments for a specifi blog
router.get('/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const allComments = await Comment.find({ blogId: id }).populate(
			'createdBy',
			'name'
		);

		return res.json({ blogId: id, comments: allComments });
	} catch (error) {
		console.log(error);
		return res.json({ message: error.message });
	}
});

//Post a comment for a specific blog
router.post('/:id', authenticateAndAuthorize, async (req, res) => {
	try {
		const { id } = req.params;
		const { comment } = req.body;

		const newComment = await Comment.create({
			comment: comment,
			createdBy: req.user.id,
			blogId: id,
		});

		return res.json({ comment: newComment });
	} catch (error) {
		console.log(error);
		return res.json({ message: error.message });
	}
});

//delete a comment using comment ID
router.delete('/:commentId', authenticateAndAuthorize, async (req, res) => {
	try {
		const { commentId } = req.params;
		const comment = await Comment.findById(commentId);

		if (!comment) throw new Error('No Comment found with that ID');

		console.log(comment);

		if (req.user.id !== comment.createdBy._id.toString()) {
			throw new Error('Not a valid user');
		}

		await Comment.findByIdAndDelete(commentId);
		return res.json({ message: 'Comment Deleted!' });
	} catch (error) {
		console.log(error);
		return res.json({ message: error.message });
	}
});

module.exports = router;
