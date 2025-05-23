const Category = require('../models/Category');
const Post = require('../models/Post');
const { Op } = require('sequelize');
const slugify = require('slugify');

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
        }

        const category = await Category.create({
            name,
            slug,
            color,
            description
        });

        res.status(201).json(category);
    } catch (error) {
        console.error('Error creating category:', error);
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                error: error.errors.map(e => e.message).join(', ')
            });
        }
        res.status(500).json({ error: 'Failed to create category' });
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

        // Update the category
        await category.update({
            name,
            slug,
            color,
            description
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

        // Delete the category
        await category.destroy();

        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: 'Failed to delete category' });
    }
};