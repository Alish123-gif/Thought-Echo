"use client";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';
import styles from './profile.module.css';
import { updateUserAvatar } from '@/utils/api';

export default function ProfilePage() {
    const { user, isAuthenticated, isLoading } = useAuth();
    console.log('User:', user);
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
        return <div className="container">Loading profile...</div>;
    }

    const handleImageClick = () => {
        document.getElementById('imageInput').click();
    }; const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                const response = await updateUserAvatar(file);
                console.log('Avatar updated successfully:', response);
            } catch (error) {
                console.error('Failed to update avatar:', error);
                alert('Failed to update avatar. Please try again.');
            }
        }
    };

    return (
        <div className="container">
            <div className={styles.profile}>
                <h1 className={styles.title}>Your Profile</h1>
                {user && (
                    <div className={styles.userInfo}>
                        <div className={styles.userHeader}>
                            <div className={styles.avatar} onClick={handleImageClick} style={{ cursor: 'pointer' }}>
                                {user.avatar ? (
                                    <Image
                                        src={user.avatar}
                                        alt={user.name}
                                        width={80}
                                        height={80}
                                    />
                                ) : (
                                    <span>{user.name?.charAt(0) || 'U'}</span>
                                )}
                                <input
                                    type="file"
                                    id="imageInput"
                                    hidden
                                    accept="image/avif,image/jpeg,image/png,image/gif,image/webp"
                                    onChange={handleImageUpload}
                                />
                            </div>
                            <h2>{user.name || 'User'}</h2>
                        </div>
                        <div className={styles.userDetails}>
                            <p><strong>Email:</strong> {user.email}</p>
                            {/* Add more user details here when available */}
                        </div>
                        <div className={styles.stats}>
                            <div className={styles.stat}>
                                <h3>0</h3>
                                <p>Posts</p>
                            </div>
                            <div className={styles.stat}>
                                <h3>0</h3>
                                <p>Comments</p>
                            </div>
                            <div className={styles.stat}>
                                <h3>0</h3>
                                <p>Likes</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
