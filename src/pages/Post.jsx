// src/pages/Post.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import authService from "../appwrite/auth";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
    const [post, setPost] = useState(null);
    const [activeUserId, setActiveUserId] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();

    // Redux store se user data nikalna
    const authState = useSelector((state) => state.auth);
    const reduxUserData = authState?.userData;

    useEffect(() => {
        // 1. Fetch Post Data
        if (slug) {
            appwriteService.getPost(slug).then((fetchedPost) => {
                if (fetchedPost) setPost(fetchedPost);
                else navigate("/");
            });
        } else {
            navigate("/");
        }

        // 2. Fetch Active User ID (Redux fallback to Direct Appwrite Auth Service)
        const resolveUserId = async () => {
            let id = reduxUserData?.$id || reduxUserData?.userData?.$id || reduxUserData?.id;

            // Agar Redux mein ID nahi mili (e.g. re-login/refresh par delay), to direct Appwrite se lo
            if (!id) {
                try {
                    const currentUser = await authService.getCurrentUser();
                    id = currentUser?.$id;
                } catch (error) {
                    console.error("Error fetching current user session:", error);
                }
            }
            setActiveUserId(id);
        };

        resolveUserId();
    }, [slug, navigate, reduxUserData]);

    // Author verification with string safety and multiple Appwrite structure checks
    const postAuthorId = post?.userId || post?.$permissions?.[0]?.replace('read("user:', '')?.replace('")', '');
    
    const isAuthor = Boolean(
        post && 
        postAuthorId && 
        activeUserId && 
        String(postAuthorId).trim() === String(activeUserId).trim()
    );

    const deletePost = async () => {
        if (!post) return;
        
        const confirmDelete = window.confirm("Are you sure you want to delete this post?");
        if (!confirmDelete) return;

        try {
            const status = await appwriteService.deletePost(post.$id);
            if (status) {
                if (post.featuredImage) {
                    await appwriteService.deleteFile(post.featuredImage);
                }
                navigate("/all-posts", { replace: true });
            } else {
                alert("Failed to delete post from Appwrite Database.");
            }
        } catch (error) {
            console.error("Delete Post Error:", error);
            alert(`Delete failed: ${error.message}`);
        }
    };

    const previewUrl = post?.featuredImage ? appwriteService.getFilePreview(post.featuredImage) : '';
    const imageUrl = typeof previewUrl === 'object' ? previewUrl?.href : previewUrl;

    return post ? (
        <div className="py-12 bg-white min-h-[85vh] text-black">
            <Container>
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="space-y-4 text-center">
                        <h1 className="text-3xl md:text-5xl font-extrabold text-black tracking-tight">
                            {post.title}
                        </h1>
                    </div>

                    <div className="w-full relative rounded-2xl overflow-hidden bg-white border border-red-200 shadow-xl">
                        {post.featuredImage && (
                            <img
                                src={imageUrl}
                                alt={post.title}
                                className="w-full max-h-[500px] object-cover"
                            />
                        )}

                        {/* Condition Match hone par hi Edit/Delete Render honge */}
                        {isAuthor && (
                            <div className="absolute right-4 top-4 flex gap-3 bg-white/90 p-2 rounded-xl shadow-lg border border-red-100 z-10">
                                <Link to={`/edit-post/${post.$id}`}>
                                    <Button className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-4 py-2 rounded-lg">
                                        Edit
                                    </Button>
                                </Link>
                                <Button onClick={deletePost} className="bg-red-600 hover:bg-red-700 font-bold text-xs px-4 py-2 rounded-lg text-white">
                                    Delete
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="bg-white p-6 md:p-10 rounded-2xl border border-red-200 shadow-md prose max-w-none text-black leading-relaxed">
                        {parse(post.content)}
                    </div>
                </div>
            </Container>
        </div>
    ) : null;
}