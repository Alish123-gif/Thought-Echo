const { DataTypes } = require('sequelize');
const path = require('path');
const sequelize = require(path.join(__dirname, '..', 'config', 'database'));
const slugify = require('slugify');

const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: {
                msg: 'Category name is required'
            },
            len: {
                args: [2, 50],
                msg: 'Category name must be between 2 and 50 characters'
            }
        }
    },
    slug: {
        type: DataTypes.STRING,
        unique: true
    },
    color: {
        type: DataTypes.STRING,
        defaultValue: '#3B82F6',
        validate: {
            isHexColor(value) {
                if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)) {
                    throw new Error('Please provide a valid hex color code');
                }
            }
        }
    },
    description: {
        type: DataTypes.TEXT,
        validate: {
            len: {
                args: [0, 200],
                msg: 'Description cannot exceed 200 characters'
            }
        }
    },
    imageUrl: {
        type: DataTypes.STRING,
        validate: {
            isUrl: {
                msg: 'Please provide a valid URL for the image'
            }
        }
    }
}, {
    timestamps: true,
    hooks: {
        beforeCreate: (category) => {
            if (category.name && !category.slug) {
                category.slug = slugify(category.name, {
                    lower: true,
                    strict: true,
                    remove: /[*+~.()'"!:@]/g
                });
            }
        },
        beforeUpdate: (category) => {
            if (category.changed('name') && !category.changed('slug')) {
                category.slug = slugify(category.name, {
                    lower: true,
                    strict: true,
                    remove: /[*+~.()'"!:@]/g
                });
            }
        }
    }
});

// Association with Posts (to be defined once Post model exists)
Category.associate = (models) => {
    Category.hasMany(models.Post, {
        foreignKey: 'categoryId',
        as: 'posts'
    });
};

module.exports = Category;