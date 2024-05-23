const { Router } = require('express');
const { v2: cloudinary } = require('cloudinary');
const multer = require('multer');
const path = require('path');

const { authenticateAndAuthorize } = require('../middlewares/authentication');
const Blog = require('../models/blog');

const router = Router();

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({
	storage: multer.diskStorage({}),
	fileFilter: (req, file, cb) => {
		let ext = path.extname(file.originalname);
		if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
			cb(new Error('Unsupported file type!'), false);
			return;
		}
		cb(null, true);
	},
});

const uploadSingle = upload.single('image');

//uploading new blogs
router.post(
	'/',
	authenticateAndAuthorize,
	upload.single('image'),
	async (req, res) => {
		try {
			const { title, content } = req.body;

			if (!title && !content) {
				throw new Error('Enter all the required data');
			}
			const imageURL = await cloudinary.uploader.upload(req.file.path, {
				folder: 'blogify',
			});

			const blog = await Blog.create({
				title,
				content,
				imageURL: imageURL.secure_url,
				createdBy: req.user.id,
			});

			return res.json({ message: 'Blog created!', blog });
		} catch (error) {
			console.log(error);
			return res.status(201).json({ messgae: error.message });
		}
	}
);

// Fetch all blogs
router.get('/', async (req, res) => {
	try {
		const allBlogs = await Blog.find({}).populate('createdBy', 'name');
		if (!allBlogs || allBlogs.length === 0) {
			return res.json({ message: 'No blogs found', blogs: null });
		}
		return res.json({ count: allBlogs.length, blogs: allBlogs });
	} catch (error) {
		console.log(error);
		return res.status(201).json({ message: error.message });
	}
});

// Fetch blog by ID
router.get('/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const blog = await Blog.findById(id).populate('createdBy', 'name');
		return res.json(blog);
	} catch (error) {
		return res.status(201).json({ message: error.message });
	}
});

// Delete Blog
router.delete('/:id', async (req, res) => {
	try {
		const { id } = req.params;
		await Blog.findByIdAndDelete(id);
		return res.json({ message: 'Blog Deleted' });
	} catch (error) {
		return res.json({ message: error.message });
	}
});

//Update a blog
router.put('/:id', authenticateAndAuthorize, async (req, res) => {
	uploadSingle(req, res, async err => {
		try {
			const { id } = req.params;
			const blog = await Blog.findById(id);

			if (req.user.id !== blog.createdBy._id.toString()) {
				throw new Error('Not a valid user');
			}
			const { title, content } = req.body;
			console.log(title, content);

			let imageURL;
			if (!err && req.file) {
				console.log(req.file);
				const image = await cloudinary.uploader.upload(req.file.path, {
					folder: 'blogify',
				});
				imageURL = image.secure_url;
			} else {
				imageURL = blog.imageURL;
			}

			await Blog.findByIdAndUpdate(id, {
				title,
				content,
				imageURL,
			});

			return res.json({ message: 'Blog Updated!' });
		} catch (error) {
			console.log(error);
			return res.status(201).json({ message: error.message });
		}
	});
});

module.exports = router;
