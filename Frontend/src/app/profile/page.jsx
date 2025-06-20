"use client";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import styles from './profile.module.css';
import { updateUserAvatar, getUserPosts } from '@/utils/api';
import ThemeContext from '@/context/ThemeContext';
import {
    FaCamera, FaEdit, FaUser, FaEnvelope,
    FaCalendarAlt, FaCog, FaChartLine,
    FaThumbsUp, FaComment, FaNewspaper,
    FaPalette, FaBell, FaBookmark
} from 'react-icons/fa';

export default function ProfilePage() {    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const { customTheme, setThemePreference, themeOptions } = useContext(ThemeContext);
    const [profileStats, setProfileStats] = useState({
        posts: 0,
        comments: 0,
        likes: 0
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [joinDate, setJoinDate] = useState('');
    const [profileCompletion, setProfileCompletion] = useState(0);
    const [showThemePicker, setShowThemePicker] = useState(false);
    const [themeChangeMessage, setThemeChangeMessage] = useState('');
    const [recentActivity, setRecentActivity] = useState([
        { type: 'comment', content: 'Great article!', date: '2 days ago' },
        { type: 'like', content: 'How to Build a React App', date: '3 days ago' },
        { type: 'post', content: 'Getting Started with Next.js', date: '1 week ago' }
    ]);
    const [bookmarks, setBookmarks] = useState([
        { id: 1, title: 'React Best Practices', slug: 'react-best-practices' },
        { id: 2, title: 'CSS Grid Tutorial', slug: 'css-grid-tutorial' }
    ]);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, isLoading, router]);

    useEffect(() => {
        if (user && user.createdAt) {
            // Format the date
            const date = new Date(user.createdAt);
            setJoinDate(date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
        }

        // Fetch user stats if authenticated
        if (isAuthenticated && user) {
            fetchUserStats();
            calculateProfileCompletion();
        }
    }, [user, isAuthenticated]);

    const calculateProfileCompletion = () => {
        if (!user) return 0;

        let completionScore = 0;
        const totalFields = 5; // Name, email, avatar, bio, social links (these are hypothetical fields)

        if (user.name) completionScore++;
        if (user.email) completionScore++;
        if (user.avatar) completionScore++;
        // Add other field checks here when they exist

        setProfileCompletion(Math.round((completionScore / totalFields) * 100));
    };

    const fetchUserStats = async () => {
        if (user && user.isAdmin) {

            try {
                // Get user posts
                const postsData = await getUserPosts();

                // Update stats with actual data
                setProfileStats({
                    posts: postsData?.posts?.length || 0,
                    comments: 0, // This would come from a real API call
                    likes: 0 // This would come from a real API call
                });
            } catch (error) {
                console.error('Failed to fetch user stats:', error);
            }
        }
    };

    const handleImageClick = () => {
        document.getElementById('imageInput').click();
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                setIsUploading(true);
                const response = await updateUserAvatar(file);
                console.log('Avatar updated successfully:', response);
                // Refresh the page to show the new avatar
                window.location.reload();
            } catch (error) {
                console.error('Failed to update avatar:', error);
                alert('Failed to update avatar. Please try again.');
            } finally {
                setIsUploading(false);
            }
        }
    };    const handleThemeChange = (themeId) => {
        // Use the context's function to set and persist the theme
        setThemePreference(themeId);
        
        // Show confirmation message
        const selectedTheme = themeOptions.find(theme => theme.id === themeId);
        setThemeChangeMessage(`Theme changed to ${selectedTheme.name}. Your preference will be saved for future sessions.`);
        
        // Clear message after 3 seconds
        setTimeout(() => {
            setThemeChangeMessage('');
        }, 3000);
        
        // Close the theme picker
        setShowThemePicker(false);
    };

    const ActivityIcon = ({ type }) => {
        switch (type) {
            case 'comment':
                return <FaComment className={styles.activityIcon} />;
            case 'like':
                return <FaThumbsUp className={styles.activityIcon} />;
            case 'post':
                return <FaNewspaper className={styles.activityIcon} />;
            default:
                return null;
        }
    };

    if (isLoading) {
        return (
            <div className="container">
                <div className={styles.loadingContainer}>
                    <div className={styles.loadingSpinner}></div>
                    <p>Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className={styles.profile}>
                <h1 className={styles.title}>Your Profile</h1>
                {user && (
                    <div className={styles.userInfo}>
                        <div className={styles.userHeader}>
                            <div className={styles.avatarContainer}>
                                <div className={styles.avatar} onClick={handleImageClick}>
                                    {user.avatar ? (
                                        <Image
                                            src={user.avatar}
                                            alt={user.name}
                                            width={120}
                                            height={120}
                                            className={styles.avatarImage}
                                        />
                                    ) : (
                                        <span>{user.name?.charAt(0) || 'U'}</span>
                                    )}
                                    {isUploading ? (
                                        <div className={styles.uploadingOverlay}>
                                            <div className={styles.uploadingSpinner}></div>
                                        </div>
                                    ) : (
                                        <div className={styles.avatarOverlay}>
                                            <FaCamera className={styles.cameraIcon} />
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        id="imageInput"
                                        hidden
                                        accept="image/avif,image/jpeg,image/png,image/gif,image/webp"
                                        onChange={handleImageUpload}
                                    />
                                </div>
                                {/* Profile completion indicator */}
                                <div className={styles.completionRing}>
                                    <svg viewBox="0 0 36 36" className={styles.circularChart}>
                                        <path
                                            className={styles.circleBg}
                                            d="M18 2.0845
                                            a 15.9155 15.9155 0 0 1 0 31.831
                                            a 15.9155 15.9155 0 0 1 0 -31.831"
                                        />
                                        <path
                                            className={styles.circle}
                                            strokeDasharray={`${profileCompletion}, 100`}
                                            d="M18 2.0845
                                            a 15.9155 15.9155 0 0 1 0 31.831
                                            a 15.9155 15.9155 0 0 1 0 -31.831"
                                        />
                                        <text x="18" y="20.35" className={styles.percentage}>{profileCompletion}%</text>
                                    </svg>
                                </div>
                            </div>
                            <h2 className={styles.userName}>{user.name || 'User'}</h2>
                            {user.isAdmin && <div className={styles.adminBadge}>Admin</div>}
                        </div>

                        <div className={styles.userDetailsCard}>
                            <div className={styles.cardHeader}>
                                <h3><FaUser className={styles.icon} /> Personal Information</h3>
                            </div>
                            <div className={styles.userDetails}>
                                <div className={styles.detailRow}>
                                    <FaEnvelope className={styles.detailIcon} />
                                    <div>
                                        <p className={styles.detailLabel}>Email</p>
                                        <p className={styles.detailValue}>{user.email}</p>
                                    </div>
                                </div>
                                {joinDate && (
                                    <div className={styles.detailRow}>
                                        <FaCalendarAlt className={styles.detailIcon} />
                                        <div>
                                            <p className={styles.detailLabel}>Member Since</p>
                                            <p className={styles.detailValue}>{joinDate}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Theme customization card */}
                        <div className={styles.customizationCard}>
                            <div className={styles.cardHeader}>
                                <h3><FaPalette className={styles.icon} /> Personalize Your Profile</h3>
                            </div>
                            <div className={styles.customizationContent}>
                                <p>Choose a theme that matches your style:</p>                                <div className={styles.themeSelector}>
                                    {themeOptions.map(theme => (
                                        <div
                                            key={theme.id}
                                            className={`${styles.themeOption} ${customTheme === theme.id ? styles.selectedTheme : ''}`}
                                            style={{ '--theme-color': theme.color }}
                                            onClick={() => handleThemeChange(theme.id)}
                                        >
                                            <div className={styles.themeColor}></div>
                                            <span>{theme.name}</span>
                                        </div>
                                    ))}
                                </div>
                                
                                {themeChangeMessage && (
                                    <div className={styles.themeConfirmation}>
                                        {themeChangeMessage}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recent activity section */}
                        <div className={styles.activityCard}>
                            <div className={styles.cardHeader}>
                                <h3><FaChartLine className={styles.icon} /> Recent Activity</h3>
                            </div>
                            <div className={styles.activityList}>
                                {recentActivity.map((activity, index) => (
                                    <div key={index} className={styles.activityItem}>
                                        <ActivityIcon type={activity.type} />
                                        <div className={styles.activityContent}>
                                            <p className={styles.activityText}>
                                                {activity.type === 'comment' && 'You commented: '}
                                                {activity.type === 'like' && 'You liked: '}
                                                {activity.type === 'post' && 'You published: '}
                                                <span>{activity.content}</span>
                                            </p>
                                            <p className={styles.activityDate}>{activity.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bookmarks section */}
                        <div className={styles.bookmarksCard}>
                            <div className={styles.cardHeader}>
                                <h3><FaBookmark className={styles.icon} /> Your Bookmarks</h3>
                            </div>
                            <div className={styles.bookmarksList}>
                                {bookmarks.length > 0 ? (
                                    bookmarks.map(bookmark => (
                                        <div key={bookmark.id} className={styles.bookmarkItem}>
                                            <h4 className={styles.bookmarkTitle}>{bookmark.title}</h4>
                                            <button
                                                className={styles.readButton}
                                                onClick={() => router.push(`/post/${bookmark.slug}`)}
                                            >
                                                Read
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className={styles.emptyMessage}>No bookmarks yet. Save articles to read later!</p>
                                )}
                            </div>
                        </div>

                        {user.isAdmin && (
                            <div className={styles.statsContainer}>
                                <h3 className={styles.statsHeader}>Your Activity</h3>
                                <div className={styles.stats}>
                                    <div className={styles.stat}>
                                        <h3>{profileStats.posts}</h3>
                                        <p>Posts</p>
                                    </div>
                                    <div className={styles.stat}>
                                        <h3>{profileStats.comments}</h3>
                                        <p>Comments</p>
                                    </div>
                                    <div className={styles.stat}>
                                        <h3>{profileStats.likes}</h3>
                                        <p>Likes</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className={styles.actionButtons}>
                            <button
                                className={styles.editButton}
                                onClick={() => alert('Edit profile functionality will be implemented soon!')}
                            >
                                <FaEdit /> Edit Profile
                            </button>
                            {user.isAdmin && (
                                <button
                                    className={styles.dashboardButton}
                                    onClick={() => router.push('/admin')}
                                >
                                    Go to Dashboard
                                </button>
                            )}
                            <button
                                className={styles.settingsButton}
                                onClick={() => alert('Settings will be implemented soon!')}
                            >
                                <FaCog /> Settings
                            </button>
                            <button
                                className={styles.notificationButton}
                                onClick={() => alert('Notifications will be implemented soon!')}
                            >
                                <FaBell /> Notifications
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
