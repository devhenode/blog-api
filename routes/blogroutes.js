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

router.use(protect);

router.post('/', createBlog);
router.get('/p/my-blogs', getMyBlogs);
router.patch('/:id', updateBlog); 
router.delete('/:id', deleteBlog);

export default router;