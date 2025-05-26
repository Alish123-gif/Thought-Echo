"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getPostById, updatePost } from "@/utils/api";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import DataMessage from "@/components/ui/DataMessage";
import WriteBlogForm from "@/components/writeBlogForm/WriteBlogForm";

const EditPostPage = () => {
    const router = useRouter();
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Extract fetch logic into a separate function for reuse
    const fetchPost = async () => {
        if (!postId) return;
        try {
            setLoading(true);
            setError(null);
            const data = await getPostById(postId);
            setPost(data);
        } catch (err) {
            console.error('Error fetching post:', err);
            setError(err.message || "Failed to load post");
        } finally {
            setLoading(false);
        }
    };

    // Retry function that only re-fetches data
    const handleRetry = () => {
        fetchPost();
    };

    useEffect(() => {
        fetchPost();
    }, [postId]);

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
                <LoadingSpinner size="large" color="#8B5CF6" />
            </div>
        );
    } if (error) {
        return (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 40 }}>
                <DataMessage
                    type="error"
                    title="Error Loading Post"
                    message={error}
                    showRetry={true}
                    onRetry={handleRetry}
                />
            </div>
        );
    }
    if (!post) return null;

    return <WriteBlogForm mode="edit" initialData={post} onSubmit={async (formData, token) => {
        // Call updatePost API
        try {
            await updatePost(postId, formData, token);
            router.push("/admin/posts");
        } catch (err) {
            alert("Failed to update post");
        }
    }} />;
};

export default EditPostPage;
