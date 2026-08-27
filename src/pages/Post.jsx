// src/pages/Post.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
    const [post, setPost] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();

    // Fetch Redux User State
    const userData = useSelector((state) => state.auth.userData);

    // Safely extract User ID (handles nested and direct payload structures)
    const currentUserId = userData?.$id || userData?.userData?.$id;

    // Strict string-level author comparison
    const isAuthor = post && currentUserId ? String(post.userId) === String(currentUserId) : false;

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) setPost(post);
                else navigate("/");
            });
        } else navigate("/");
    }, [slug, navigate]);
// src/pages/Post.jsx ke andar delete function update karein
const deletePost = async () => {
    if (!post) return;
    
    try {
        console.log("Deleting document with ID:", post.$id);
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

                        {/* Render Buttons only if Author Matches */}
                        {isAuthor && (
                            <div className="absolute right-4 top-20 flex gap-3 bg-blue-600/90 p-2 rounded-xl shadow-lg">
                                <Link to={`/edit-post/${post.$id}`}>
                                    <Button className=" bg-green-700 text-white font-bold text-xs px-4 py-2 rounded-lg">
                                        Edit
                                    </Button>
                                </Link>
                                <Button onClick={deletePost} className="bg-red-600  font-bold text-xs px-4 py-2 rounded-lg ">
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