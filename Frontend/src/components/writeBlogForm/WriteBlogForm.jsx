"use client";
import React, { useState, useRef, useEffect, useContext } from 'react';
import styles from './writeBlogForm.module.css';
import Image from 'next/image';
import { HiOutlinePhotograph, HiOutlineX, HiOutlineSave } from 'react-icons/hi';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { createPost } from '@/utils/api';

// Import the rich text editor with dynamic import to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), {
    ssr: false,
    loading: () => <div className={styles.editorLoading}>Loading editor...</div>
});
import 'react-quill/dist/quill.snow.css';
import './previewStyles.css'; // Import global styles for preview content
import { getCategories } from '@/utils/categoryService';

const AUTOSAVE_INTERVAL = 30000; // 30 seconds
const LOCAL_STORAGE_KEY = 'blogPostDraft';

const WriteBlogForm = ({ initialData = {}, mode = 'create', onSubmit }) => {
    const { data: session } = useSession();
    const router = useRouter();
    const fileInputRef = useRef(null);
    const [imageUrl, setImageUrl] = useState(initialData.imageUrl || '');
    const [previewUrl, setPreviewUrl] = useState(initialData.imageUrl || '');
    const [title, setTitle] = useState(initialData.title || '');
    const [description, setDescription] = useState(initialData.description || '');
    const [content, setContent] = useState(initialData.content || '');
    const [category, setCategory] = useState(initialData.category || '');
    const [tags, setTags] = useState(initialData.tags || []);
    const [isFeatured, setIsFeatured] = useState(initialData.isFeatured || false);
    const [isPublished, setIsPublished] = useState(
        typeof initialData.isPublished === 'boolean' ? initialData.isPublished : true
    );
    const [currentTag, setCurrentTag] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);
    const [showSavedNotification, setShowSavedNotification] = useState(false);
    const [errors, setErrors] = useState({});

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageUrl(file);
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const [categories, setCategories] = useState([]);
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategories();
                setCategories(response);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);
    const removeImage = () => {
        setImageUrl('');
        setPreviewUrl('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
    const addTag = (e) => {
        e.preventDefault();
        const trimmedTag = currentTag.trim().toLowerCase();
        if (trimmedTag && !tags.includes(trimmedTag)) {
            if (tags.length >= 5) {
                // Replace the error message instead of adding a new tag
                setErrors(prev => ({
                    ...prev,
                    tags: 'Maximum 5 tags allowed'
                }));
                // Clear error after 3 seconds
                setTimeout(() => {
                    setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.tags;
                        return newErrors;
                    });
                }, 3000);
                return;
            }
            setTags([...tags, trimmedTag]);
            setCurrentTag('');
            // Clear any existing tag errors
            if (errors.tags) {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.tags;
                    return newErrors;
                });
            }
        }
    };

    const removeTag = (tagToRemove) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };
    const validateForm = () => {
        const newErrors = {};
        if (!title.trim()) newErrors.title = 'Title is required';
        if (!description.trim()) newErrors.description = 'Description is required';
        if (!content.trim() || content === '<p><br></p>') newErrors.content = 'Content is required';
        if (!category) newErrors.category = 'Category is required';
        if (!imageUrl) newErrors.image = 'Featured image is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Load draft from localStorage when component mounts
    useEffect(() => {
        const savedDraft = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedDraft) {
            try {
                const parsedDraft = JSON.parse(savedDraft);
                setTitle(parsedDraft.title || '');
                setDescription(parsedDraft.description || '');
                setContent(parsedDraft.content || '');
                setCategory(parsedDraft.category || '');
                setTags(parsedDraft.tags || []);
                setIsFeatured(parsedDraft.isFeatured || false);
                setIsPublished(parsedDraft.isPublished || true);

                if (parsedDraft.previewUrl) {
                    setPreviewUrl(parsedDraft.previewUrl);
                    // Note: we can't restore the actual File object, just the preview
                }

                if (parsedDraft.lastSaved) {
                    setLastSaved(new Date(parsedDraft.lastSaved));
                }
            } catch (error) {
                console.error('Error loading draft from localStorage:', error);
            }
        }
    }, []);

    // Update state if initialData changes (for edit mode)
    useEffect(() => {
        if (initialData && mode === 'edit') {
            setTitle(initialData.title || '');
            setDescription(initialData.description || '');
            setContent(initialData.content || '');
            setCategory(initialData.category || '');
            setTags(initialData.tags || []);
            setIsFeatured(initialData.isFeatured || false);
            setIsPublished(
                typeof initialData.isPublished === 'boolean' ? initialData.isPublished : true
            );
            setImageUrl(initialData.imageUrl || '');
            setPreviewUrl(initialData.imageUrl || '');
        }
    }, [initialData, mode]);

    // Save draft to localStorage
    const saveDraft = () => {
        try {
            const draft = {
                title,
                description,
                content,
                category,
                tags,
                isFeatured,
                isPublished,
                lastSaved: new Date().toISOString(),
            };

            if (previewUrl) {
                draft.previewUrl = previewUrl;
            }

            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(draft));
            setLastSaved(new Date());

            // Show saved notification
            setShowSavedNotification(true);
            setTimeout(() => {
                setShowSavedNotification(false);
            }, 3000);
        } catch (error) {
            console.error('Error saving draft to localStorage:', error);
        }
    };
    // Auto-save every AUTOSAVE_INTERVAL
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (title || description || content) {
                saveDraft();
            }
        }, AUTOSAVE_INTERVAL);

        return () => clearInterval(intervalId);
    }, [title, description, content, category, tags, isFeatured, isPublished, previewUrl]);    // Discard draft
    const discardDraft = () => {
        if (window.confirm('Are you sure you want to discard this draft? All changes will be lost.')) {
            clearForm();
        }
    };

    // Helper function to clear the form and draft
    const clearForm = () => {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        setTitle('');
        setDescription('');
        setContent('');
        setCategory('');
        setTags([]);
        setIsFeatured(false);
        setIsPublished(true);
        removeImage();
        setLastSaved(null);
        setErrors({});
    };

    // Warn before closing tab/window if there are unsaved changes
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (title || description || content) {
                const message = 'You have unsaved changes. Are you sure you want to leave?';
                e.returnValue = message;
                return message;
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [title, description, content]);

    // State for showing success message
    const [successMessage, setSuccessMessage] = useState('');    // Function to save draft or publish post
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        // Check if user is authenticated
        if (!session || !session.user) {
            setErrors({ submit: 'You must be logged in to create a post' });
            return;
        }

        setSubmitting(true);
        setSuccessMessage('');

        try {
            // Create a FormData object to send the data including the image
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('content', content);
            formData.append('categoryId', category);
            formData.append('tags', JSON.stringify(tags));
            formData.append('isFeatured', isFeatured);
            formData.append('isPublished', isPublished);

            if (imageUrl instanceof File) {
                formData.append('image', imageUrl);
            }

            // Get the user's token from the session
            const token = session.accessToken;
            if (onSubmit) {
                await onSubmit(formData, token);
                setSuccessMessage(mode === 'edit' ? 'Post updated successfully!' : 'Post created successfully!');

                // Clear the autosave draft and form when editing as well
                if (mode === 'create') {
                    clearForm();
                } else {
                    // For edit mode, just clear the draft but keep the form data
                    localStorage.removeItem(LOCAL_STORAGE_KEY);
                    setLastSaved(null);
                }

                setTimeout(() => {
                    router.push('/admin/posts');
                }, 1500);
                return;
            }// Default: create post
            const response = await createPost(formData, token);

            // Set success message based on post status
            const message = isPublished
                ? 'Your post has been published successfully!'
                : 'Your post has been saved as a draft.';
            setSuccessMessage(message);

            // Clear the form and autosave draft after successful creation
            clearForm();

            // Redirect to the admin posts page after a short delay
            setTimeout(() => {
                router.push('/admin');
            }, 2000);

        } catch (error) {
            console.error('Error submitting form:', error);
            setErrors({ submit: error.message || 'Failed to submit the post. Please try again.' });
        } finally {
            setSubmitting(false);
        }
    };

    // Calculate word count for the editor content
    const countWords = (htmlString) => {
        if (!htmlString || htmlString === '<p><br></p>') return 0;

        // Remove HTML tags and get text only
        const text = htmlString.replace(/<[^>]*>/g, ' ').trim();
        // Count words by splitting on whitespace
        return text.split(/\s+/).filter(word => word.length > 0).length;
    };

    const wordCount = countWords(content);

    // Quill editor modules/formats
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image', 'video'],
            ['clean']
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image', 'video'
    ];
    // Get the category label from the value
    const getCategoryLabel = (value) => {
        const category = categories.find(cat => cat.value === value);
        return category ? category.label : '';
    };

    return (
        <form className={styles.writeBlogForm} onSubmit={handleSubmit}>
            <div className={styles.formSection}>
                <h2>Create New Blog Post</h2>

                {previewMode ? (
                    <div className={styles.previewSection}>            {previewUrl ? (
                        <div className={styles.previewFeaturedImage}>
                            <Image
                                src={previewUrl}
                                alt={title || "Blog post featured image"}
                                fill
                                style={{ objectFit: 'cover' }}
                                className={styles.previewImage}
                            />
                        </div>
                    ) : (
                        <div className={styles.previewNoImage}>
                            <HiOutlinePhotograph className={styles.noImageIcon} />
                            <p>No featured image selected</p>
                        </div>
                    )}

                        <h1 className={styles.previewTitle}>{title || "Untitled Post"}</h1>

                        {description && (
                            <p className={styles.previewDescription}>{description}</p>
                        )}

                        <div className={styles.previewMeta}>
                            {category && (
                                <span className={styles.previewCategory}>{getCategoryLabel(category)}</span>
                            )}

                            {tags.length > 0 && (
                                <div className={styles.previewTags}>
                                    {tags.map(tag => (
                                        <span key={tag} className={styles.previewTag}>#{tag}</span>
                                    ))}
                                </div>
                            )}

                            <div className={styles.previewReadingTime}>
                                {Math.ceil(wordCount / 200)} min read
                            </div>
                        </div>

                        <div
                            className={styles.previewContent}
                            dangerouslySetInnerHTML={{ __html: content }}
                            id="preview-content"
                        />
                    </div>) : (
                    <>
                        <div className={styles.topFormLayout}>
                            {/* Left Column - Image Upload */}
                            <div className={styles.leftColumn}>
                                <div className={styles.imageUploadSection}>
                                    <p className={styles.sectionTitle}>Featured Image</p>
                                    <div
                                        className={`${styles.imageUpload} ${errors.image ? styles.errorBorder : ''}`}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        {previewUrl ? (
                                            <div className={styles.previewContainer}>
                                                <Image
                                                    src={previewUrl}
                                                    alt="Preview"
                                                    fill
                                                    style={{ objectFit: 'cover' }}
                                                />
                                                <button
                                                    type="button"
                                                    className={styles.removeImageBtn}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeImage();
                                                    }}
                                                >
                                                    <HiOutlineX />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className={styles.uploadPrompt}>
                                                <HiOutlinePhotograph className={styles.uploadIcon} />
                                                <p>Click to upload a featured image</p>
                                                <span className={styles.uploadSubtext}>
                                                    (Recommended size: 1200 × 630 pixels)
                                                </span>
                                            </div>
                                        )}
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className={styles.fileInput}
                                        />
                                    </div>
                                    {errors.image && <p className={styles.errorMessage}>{errors.image}</p>}
                                </div>
                            </div>

                            {/* Right Column - Title, Category, Tags */}
                            <div className={styles.rightColumn}>
                                {/* Title */}
                                <div className={styles.formGroup}>
                                    <label htmlFor="title" className={styles.label}>Title</label>
                                    <input
                                        id="title"
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Enter a title that captures attention"
                                        className={`${styles.input} ${errors.title ? styles.errorInput : ''}`}
                                        maxLength={100}
                                    />
                                    <div className={styles.charCount}>
                                        {title.length}/100
                                    </div>
                                    {errors.title && <p className={styles.errorMessage}>{errors.title}</p>}
                                </div>

                                {/* Category */}
                                <div className={styles.formGroup}>
                                    <label htmlFor="category" className={styles.label}>Category</label>
                                    <select
                                        id="category"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className={`${styles.select} ${errors.category ? styles.errorInput : ''}`}
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category && <p className={styles.errorMessage}>{errors.category}</p>}
                                </div>

                                {/* Tags */}
                                <div className={styles.formGroup}>
                                    <label htmlFor="tags" className={styles.label}>Tags (optional)</label>
                                    <div className={styles.tagsInputContainer}>
                                        <div className={styles.tagsDisplay}>
                                            {tags.map((tag) => (
                                                <span key={tag} className={styles.tag}>
                                                    {tag}
                                                    <button
                                                        type="button"
                                                        className={styles.removeTag}
                                                        onClick={() => removeTag(tag)}
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>

                                        <div className={styles.tagsInput}>

                                            <div className={styles.tagInputWrapper}>
                                                <input
                                                    id="tags"
                                                    type="text"
                                                    value={currentTag}
                                                    onChange={(e) => setCurrentTag(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' || e.key === ',') {
                                                            e.preventDefault();
                                                            addTag(e);
                                                        }
                                                    }}
                                                    placeholder="Add tags and press Enter"
                                                    className={styles.tagInput}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={addTag}
                                                    className={styles.addTagBtn}
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        </div>
                                        <p className={styles.helperText}>
                                            Separate tags with Enter or comma. Max 5 tags.
                                        </p>
                                        {errors.tags && <p className={styles.errorMessage}>{errors.tags}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description - Below the two columns */}
                        <div className={styles.formGroup}>
                            <label htmlFor="description" className={styles.label}>Description</label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Provide a brief description or summary of your post"
                                className={`${styles.textarea} ${errors.description ? styles.errorInput : ''}`}
                                maxLength={300}
                                rows={3}
                            />
                            <div className={styles.charCount}>
                                {description.length}/300
                            </div>
                            {errors.description && <p className={styles.errorMessage}>{errors.description}</p>}
                        </div>

                        {/* Toggle switches for Featured and Published */}
                        <div className={styles.togglesContainer}>
                            <div className={styles.toggleGroup}>
                                <label htmlFor="isFeatured" className={styles.toggleLabel}>
                                    Feature this post
                                    <div className={styles.toggleHelp}>
                                        Featured posts appear on the homepage
                                    </div>
                                </label>
                                <label className={styles.switch}>
                                    <input
                                        id="isFeatured"
                                        type="checkbox"
                                        checked={isFeatured}
                                        onChange={() => setIsFeatured(!isFeatured)}
                                    />
                                    <span className={styles.slider}></span>
                                </label>
                            </div>

                            <div className={styles.toggleGroup}>
                                <label htmlFor="isPublished" className={styles.toggleLabel}>
                                    Publish immediately
                                    <div className={styles.toggleHelp}>
                                        Or save as draft
                                    </div>
                                </label>
                                <label className={styles.switch}>
                                    <input
                                        id="isPublished"
                                        type="checkbox"
                                        checked={isPublished}
                                        onChange={() => setIsPublished(!isPublished)}
                                    />
                                    <span className={styles.slider}></span>
                                </label>
                            </div>
                        </div>

                        {/* Content/Body (Rich Text Editor) */}
                        <div className={styles.formGroup}>
                            <label htmlFor="content" className={styles.label}>Content</label>
                            <div className={`${styles.editorContainer} ${errors.content ? styles.errorBorder : ''}`}>
                                <ReactQuill
                                    theme="snow"
                                    value={content}
                                    onChange={setContent}
                                    placeholder="Write your post content here..."
                                    modules={modules}
                                    formats={formats}
                                    className={styles.editor}
                                />
                            </div>
                            <div className={styles.editorStats}>
                                <span className={styles.wordCount}>{wordCount} words</span>
                                <span className={styles.readingTime}>{Math.ceil(wordCount / 200)} min read</span>
                            </div>
                            {errors.content && <p className={styles.errorMessage}>{errors.content}</p>}
                        </div>

                        <div className={styles.draftInfo}>
                            {lastSaved && (
                                <div className={styles.lastSavedInfo}>
                                    Last saved: {lastSaved.toLocaleTimeString()}
                                </div>
                            )}
                            <button
                                type="button"
                                className={styles.saveButton}
                                onClick={saveDraft}
                            >
                                <HiOutlineSave /> Save
                            </button>
                            {showSavedNotification && (
                                <div className={styles.savedNotification}>
                                    <span>✓</span> Draft saved
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Submit Button */}
                <div className={styles.formActions}>
                    <button
                        type="button"
                        className={styles.previewButton}
                        onClick={() => setPreviewMode(!previewMode)}
                        disabled={submitting}
                    >
                        {previewMode ? 'Edit Post' : 'Preview'}
                    </button>
                    <div className={styles.submitButtons}>            <button
                        type="button"
                        className={styles.cancelButton}
                        onClick={discardDraft}
                        disabled={submitting}
                    >
                        Discard
                    </button>
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={submitting || previewMode}
                        >
                            {submitting ? 'Saving...' : isPublished ? 'Publish Post' : 'Save Draft'}
                        </button>
                    </div>
                </div>
                {errors.submit && (
                    <p className={styles.submitError}>{errors.submit}</p>
                )}

                {successMessage && (
                    <p className={styles.successMessage}>{successMessage}</p>
                )}
            </div>
        </form>
    );
};

export default WriteBlogForm;
