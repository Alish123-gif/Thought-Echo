"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getPostById, updatePost } from "@/utils/api";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import WriteBlogForm from "@/components/writeBlogForm/WriteBlogForm";

const EditPostPage = () => {
    const router = useRouter();
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const data = await getPostById(postId);
                setPost(data);
            } catch (err) {
                setError("Failed to load post");
            } finally {
                setLoading(false);
            }
        };
        if (postId) fetchPost();
    }, [postId]);

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
                <LoadingSpinner size="large" color="#8B5CF6" />
            </div>
        );
    }
    if (error) {
        return <div style={{ color: "red", textAlign: "center" }}>{error}</div>;
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
