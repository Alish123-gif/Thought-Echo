const Category = require('../models/Category');
const Post = require('../models/Post');
const { Op } = require('sequelize');
const slugify = require('slugify');
const imagekit = require('../config/imagekit');
const crypto = require('crypto');

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            order: [['name', 'ASC']]
        });

        // Get post counts for each category
        const categoriesWithCounts = await Promise.all(
            categories.map(async (category) => {
                const postCount = await Post.count({
                    where: { categoryId: category.id }
                });

                return {
                    ...category.toJSON(),
                    postCount
                };
            })
        );

        res.status(200).json(categoriesWithCounts);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
};

// Get a category by ID
exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        const postCount = await Post.count({
            where: { categoryId: category.id }
        });

        res.status(200).json({
            ...category.toJSON(),
            postCount
        });
    } catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({ error: 'Failed to fetch category' });
    }
};

// Create a new category
exports.createCategory = async (req, res) => {
    try {
        const { name, slug, color, description } = req.body;

        // Check if category already exists
        const existingCategory = await Category.findOne({
            where: {
                [Op.or]: [
                    { name },
                    { slug: slug || slugify(name, { lower: true, strict: true }) }
                ]
            }
        });

        if (existingCategory) {
            return res.status(400).json({
                error: 'A category with this name or slug already exists'
            });
        } let imageUrl = null;

        // Upload image to ImageKit if provided
        if (req.file) {
            console.log('=== Category Creation Debug ===');
            console.log('File received:', !!req.file);
            console.log('ImageKit config exists:', {
                publicKey: !!process.env.IMAGEKIT_PUBLIC_KEY,
                privateKey: !!process.env.IMAGEKIT_PRIVATE_KEY,
                urlEndpoint: !!process.env.IMAGEKIT_URL_ENDPOINT
            });

            // Test authentication before upload
            try {
                await imagekit.listFiles({ limit: 1 });
                console.log('✅ ImageKit auth successful');
            } catch (authError) {
                console.error('❌ ImageKit auth failed:', authError.message);            throw new Error('ImageKit authentication failed: ' + authError.message);
            }

            // Create short, unique filename
            const timestamp = Date.now();
            const randomId = Math.random().toString(36).substring(2, 8); // 6 char random string
            const fileExtension = req.file.originalname.split('.').pop();
            const shortFileName = `cat_${timestamp}_${randomId}.${fileExtension}`;
            const fileType = req.file.mimetype;

            const uploadResponse = await imagekit.upload({
                file: req.file.buffer.toString('base64'),
                fileName: shortFileName,
                folder: '/categories',
                useUniqueFileName: false, // We're creating unique names ourselves
                fileType: fileType
            });

            imageUrl = uploadResponse.url;
        }

        const category = await Category.create({
            name,
            slug,
            color,
            description,
            imageUrl
        });

        res.status(201).json(category);
    } catch (error) {
        console.error('=== Category Creation Error ===');
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('ImageKit response:', error.response?.data);

        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                error: error.errors.map(e => e.message).join(', ')
            });
        }
        res.status(500).json({
            error: 'Failed to create category',
            details: error.message
        });
    }
};

// Update a category
exports.updateCategory = async (req, res) => {
    try {
        const { name, slug, color, description } = req.body;
        const categoryId = req.params.id;

        // Find the category
        const category = await Category.findByPk(categoryId);

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Check if name or slug is already taken by another category
        if (name !== category.name || slug !== category.slug) {
            const existingCategory = await Category.findOne({
                where: {
                    [Op.and]: [
                        { id: { [Op.ne]: categoryId } },
                        {
                            [Op.or]: [
                                { name },
                                { slug: slug || slugify(name, { lower: true, strict: true }) }
                            ]
                        }
                    ]
                }
            });

            if (existingCategory) {
                return res.status(400).json({
                    error: 'Another category with this name or slug already exists'
                });
            }
        }

        let imageUrl = category.imageUrl;        // Upload new image to ImageKit if provided
        if (req.file) {
            // Create short, unique filename
            const timestamp = Date.now();
            const randomId = Math.random().toString(36).substring(2, 8); // 6 char random string
            const fileExtension = req.file.originalname.split('.').pop();
            const shortFileName = `cat_${timestamp}_${randomId}.${fileExtension}`;
            const fileType = req.file.mimetype;

            const uploadResponse = await imagekit.upload({
                file: req.file.buffer.toString('base64'),
                fileName: shortFileName,
                folder: '/categories',
                useUniqueFileName: false, // We're creating unique names ourselves
                fileType: fileType
            });

            imageUrl = uploadResponse.url;
        }

        // Update the category
        await category.update({
            name,
            slug,
            color,
            description,
            imageUrl
        });

        res.status(200).json(category);
    } catch (error) {
        console.error('Error updating category:', error);
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                error: error.errors.map(e => e.message).join(', ')
            });
        }
        res.status(500).json({ error: 'Failed to update category' });
    }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;

        // Find the category
        const category = await Category.findByPk(categoryId);

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Check if category has posts
        const postCount = await Post.count({
            where: { categoryId }
        });

        if (postCount > 0) {
            return res.status(400).json({
                error: `Cannot delete category with ${postCount} posts. Reassign or delete posts first.`
            });
        }

        // Try to delete the image from ImageKit if it exists
        if (category.imageUrl) {
            try {
                // Extract the file ID from the URL
                const fileId = category.imageUrl.split('/').pop().split('.')[0];

                // Delete the file from ImageKit (this will silently fail if the file doesn't exist)
                await imagekit.deleteFile(fileId);
            } catch (error) {
                console.error('Failed to delete image from ImageKit:', error);
                // Continue with category deletion even if image deletion fails
            }
        }

        // Delete the category
        await category.destroy();

        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: 'Failed to delete category' });
    }
};

// Upload category image
exports.uploadCategoryImage = async (req, res) => {
    try {
        const categoryId = req.params.id;

        // Find the category
        const category = await Category.findByPk(categoryId);

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Check if image file is provided
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        // Try to delete the old image from ImageKit if it exists
        if (category.imageUrl) {
            try {
                // Extract the file ID from the URL
                const fileId = category.imageUrl.split('/').pop().split('.')[0];

                // Delete the file from ImageKit (this will silently fail if the file doesn't exist)
                await imagekit.deleteFile(fileId);
            } catch (error) {
                console.error('Failed to delete old image from ImageKit:', error);
                // Continue with new image upload even if old image deletion fails
            }
        }        // Upload new image to ImageKit
        // Create short, unique filename
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substring(2, 8); // 6 char random string
        const fileExtension = req.file.originalname.split('.').pop();
        const shortFileName = `cat_${timestamp}_${randomId}.${fileExtension}`;
        const fileType = req.file.mimetype;

        const uploadResponse = await imagekit.upload({
            file: req.file.buffer.toString('base64'),
            fileName: shortFileName,
            folder: '/categories',
            useUniqueFileName: false, // We're creating unique names ourselves
            fileType: fileType
        });

        // Update the category with the new image URL
        await category.update({
            imageUrl: uploadResponse.url
        });

        res.status(200).json({
            message: 'Category image updated successfully',
            category
        });
    } catch (error) {
        console.error('Error uploading category image:', error);
        res.status(500).json({ error: 'Failed to upload category image' });
    }
};