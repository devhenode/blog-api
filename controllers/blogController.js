import Blog from '../models/Blog.js';
import User from '../models/User.js';


export const getPublishedBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 20, author, title, tags, order_by, order = 'asc' } = req.query;

    const query = { state: 'published' };

    if (author) {
      const authorUser = await User.findOne({
        $or: [
            { first_name: { $regex: author, $options: 'i' } },
            { last_name: { $regex: author, $options: 'i' } }
        ]
      });
      if (authorUser) {
        query.author = authorUser._id;
      } else {
         
          query.author = null; 
      }
    }

    if (title) {
      query.title = { $regex: title, $options: 'i' }; 
    }

    if (tags) {
      query.tags = { $in: tags.split(',') };
    }

    const sortQuery = {};
    if (order_by) {
      sortQuery[order_by] = order === 'desc' ? -1 : 1;
    } else {
      sortQuery.timestamp = -1;
    }

    const blogs = await Blog.find(query)
      .populate('author', 'first_name last_name email')
      .sort(sortQuery)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Blog.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: blogs.length,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: { blogs },
    });
  } catch (error) {
    res.status(404).json({ status: 'fail', message: error.message });
  }
};

export const getSingleBlog = async (req, res) => {
  try {
    const { id } = req.params;
    
    const blog = await Blog.findOne({ _id: id, state: 'published' }).populate('author', 'first_name last_name email');

    if (!blog) {
      return res.status(404).json({ status: 'fail', message: 'Blog not found' });
    }

    blog.read_count += 1;
    await blog.save();

    res.status(200).json({
      status: 'success',
      data: { blog },
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

export const createBlog = async (req, res) => {
  try {
    const { title, description, body, tags } = req.body;

    const newBlog = await Blog.create({
      title,
      description,
      body,
      tags,
      author: req.user._id,
    });

    res.status(201).json({
      status: 'success',
      data: { blog: newBlog },
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

export const getMyBlogs = async (req, res) => {
    try {
        const { page = 1, limit = 20, state } = req.query;
        
        const query = { author: req.user._id };
        if (state) {
            query.state = state; 
        }

        const blogs = await Blog.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit);
        
        res.status(200).json({
            status: 'success',
            results: blogs.length,
            data: { blogs }
        })
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
}

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ status: 'fail', message: 'Blog not found' });
    }

    // Check ownership
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ status: 'fail', message: 'You are not authorized to delete this blog' });
    }

    await blog.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Blog deleted successfully',
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ status: 'fail', message: 'Blog not found' });
    }

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ status: 'fail', message: 'You are not authorized to update this blog' });
    }

    const { state, title, description, body, tags } = req.body;
    
    if (state) blog.state = state;
    if (title) blog.title = title;
    if (description) blog.description = description; 
    if (body) blog.body = body;
    if (tags) blog.tags = tags;

    await blog.save();

    res.status(200).json({
      status: 'success',
      data: { blog },
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};