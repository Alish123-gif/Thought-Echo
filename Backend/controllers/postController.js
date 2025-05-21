const Post = require('../models/Post');
const User = require('../models/User');
const imagekit = require('../config/imagekit');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);
const { Op } = require('sequelize');

// Helper function to create slug from title
function createSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
}

// Helper function to calculate reading time
function calculateReadingTime(htmlContent) {
    const text = htmlContent.replace(/<[^>]*>/g, ' ').trim();
    const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
    return Math.ceil(wordCount / 200); // 200 words per minute reading speed
}

// Get all posts with pagination, filtering, and sorting
exports.getAllPosts = async (req, res) => {
    try {
        const { page = 1, limit = 10, category, tag, featured, author, published } = req.query;
        const offset = (page - 1) * limit;

        // Build where clause for filtering
        const where = {};
        if (category) where.category = category;
        if (featured) where.isFeatured = featured === 'true';
        if (published !== undefined) where.isPublished = published === 'true';

        // Filter by tags (if provided)
        if (tag) {
            where.tags = { [Op.contains]: [tag] };
        }

        // Filter by author (if provided)
        let include = [];
        if (author) {
            include.push({
                model: User,
                as: 'author',
                where: { id: author },
                attributes: ['id', 'name', 'email']
            });
        } else {
            include.push({
                model: User,
                as: 'author',
                attributes: ['id', 'name', 'email']
            });
        }

        const { count, rows: posts } = await Post.findAndCountAll({
            where,
            include,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            totalPosts: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            posts
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Error fetching posts', error: error.message });
    }
};

// Get a single post by slug
exports.getPostBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const post = await Post.findOne({
            where: { slug },
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: ['id', 'name', 'email']
                }
            ]
        });

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json(post);
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ message: 'Error fetching post', error: error.message });
    }
};

// Create a new post
exports.createPost = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Extract form data
        const { title, description, content, category, tags, isFeatured, isPublished } = req.body;
        const parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;

        // Validation
        if (!title || !description || !content || !category) {
            return res.status(400).json({ message: 'Required fields missing' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Featured image is required' });
        }

        // Generate slug from title
        const baseSlug = createSlug(title);
        let slug = baseSlug;
        let counter = 1;

        // Ensure slug is unique
        while (await Post.findOne({ where: { slug } })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        // Calculate reading time
        const readingTime = calculateReadingTime(content);

        // Upload image to ImageKit
        let imageUploadResponse;
        try {
            // Read file
            const fileBuffer = req.file.buffer;

            // Upload to ImageKit
            imageUploadResponse = await imagekit.upload({
                file: fileBuffer,
                fileName: `blog-${Date.now()}-${req.file.originalname}`,
                folder: '/blog-posts'
            });

            // Delete temporary file if exists
            if (req.file.path) {
                await unlinkAsync(req.file.path);
            }
        } catch (uploadError) {
            console.error('Error uploading image:', uploadError);
            return res.status(500).json({ message: 'Failed to upload image', error: uploadError.message });
        }

        // Create post record
        const post = await Post.create({
            title,
            description,
            content,
            slug,
            category,
            tags: parsedTags || [],
            imageUrl: imageUploadResponse.url,
            isFeatured: isFeatured === 'true' || isFeatured === true,
            isPublished: isPublished === 'true' || isPublished === true || isPublished === undefined,
            readingTime,
            authorId: req.user.id
        });

        res.status(201).json({
            message: 'Post created successfully',
            post
        });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Failed to create post', error: error.message });
    }
};

// Update a post
exports.updatePost = async (req, res) => {
    try {
        const { id } = req.params;

        // Make sure user is authorized
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Find post
        const post = await Post.findByPk(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if user is the author or admin
        if (post.authorId !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Forbidden - you can only edit your own posts' });
        }

        // Extract form data
        const { title, description, content, category, tags, isFeatured, isPublished } = req.body;
        const parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;

        // Update slug only if title changed
        let slug = post.slug;
        if (title && title !== post.title) {
            const baseSlug = createSlug(title);
            slug = baseSlug;
            let counter = 1;

            // Ensure slug is unique
            let existingPost = await Post.findOne({ where: { slug } });
            while (existingPost && existingPost.id !== id) {
                slug = `${baseSlug}-${counter}`;
                counter++;
                existingPost = await Post.findOne({ where: { slug } });
            }
        }

        // Calculate new reading time if content changed
        const readingTime = content ? calculateReadingTime(content) : post.readingTime;

        // Handle image upload if provided
        let imageUrl = post.imageUrl;
        if (req.file) {
            try {
                // Read file
                const fileBuffer = req.file.buffer;

                // Upload to ImageKit
                const imageUploadResponse = await imagekit.upload({
                    file: fileBuffer,
                    fileName: `blog-${Date.now()}-${req.file.originalname}`,
                    folder: '/blog-posts'
                });

                // Delete temporary file if exists
                if (req.file.path) {
                    await unlinkAsync(req.file.path);
                }

                imageUrl = imageUploadResponse.url;
            } catch (uploadError) {
                console.error('Error uploading image:', uploadError);
                return res.status(500).json({ message: 'Failed to upload image', error: uploadError.message });
            }
        }

        // Update post
        await post.update({
            title: title || post.title,
            description: description || post.description,
            content: content || post.content,
            slug,
            category: category || post.category,
            tags: parsedTags || post.tags,
            imageUrl,
            isFeatured: isFeatured === 'true' || isFeatured === true || (isFeatured === undefined && post.isFeatured),
            isPublished: isPublished === 'true' || isPublished === true || (isPublished === undefined && post.isPublished),
            readingTime
        });

        res.status(200).json({
            message: 'Post updated successfully',
            post
        });
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ message: 'Failed to update post', error: error.message });
    }
};

// Delete a post
exports.deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        // Make sure user is authorized
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Find post
        const post = await Post.findByPk(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if user is the author or admin
        if (post.authorId !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Forbidden - you can only delete your own posts' });
        }

        // Delete post
        await post.destroy();

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Failed to delete post', error: error.message });
    }
};

// Get posts by category
exports.getPostsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const { count, rows: posts } = await Post.findAndCountAll({
            where: {
                category,
                isPublished: true
            },
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: ['id', 'name', 'email']
                }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            totalPosts: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            posts
        });
    } catch (error) {
        console.error('Error fetching posts by category:', error);
        res.status(500).json({ message: 'Error fetching posts', error: error.message });
    }
};

// Get featured posts
exports.getFeaturedPosts = async (req, res) => {
    try {
        const { limit = 5 } = req.query;

        const posts = await Post.findAll({
            where: {
                isFeatured: true,
                isPublished: true
            },
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: ['id', 'name', 'email']
                }
            ],
            limit: parseInt(limit),
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching featured posts:', error);
        res.status(500).json({ message: 'Error fetching featured posts', error: error.message });
    }
};

// Get user posts
exports.getUserPosts = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { page = 1, limit = 10, published } = req.query;
        const offset = (page - 1) * limit;

        // Build where clause
        const where = { authorId: req.user.id };
        if (published !== undefined) {
            where.isPublished = published === 'true';
        }

        const { count, rows: posts } = await Post.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            totalPosts: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            posts
        });
    } catch (error) {
        console.error('Error fetching user posts:', error);
        res.status(500).json({ message: 'Error fetching user posts', error: error.message });
    }
};
