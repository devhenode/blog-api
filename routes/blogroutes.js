import express from 'express';
import {
    getPublishedBlogs,
    getSingleBlog,
    createBlog,
    deleteBlog,
    updateBlog,
    getMyBlogs
} from '../controllers/blogController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getPublishedBlogs);
router.get('/:id', getSingleBlog);

router.post('/', protect, createBlog);
router.get('/p/my-blogs', protect, getMyBlogs);
router.patch('/:id', protect, updateBlog);
router.delete('/:id', protect, deleteBlog);

export default router;