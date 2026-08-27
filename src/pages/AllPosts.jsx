// src/pages/AllPosts.jsx
import React, { useState, useEffect } from 'react';
import { Container, PostCard } from '../components';
import appwriteService from "../appwrite/config";
import { useLocation } from 'react-router-dom';

export default function AllPosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation(); // Location hook to detect navigation

    useEffect(() => {
        setLoading(true);
        appwriteService.getPosts().then((res) => {
            if (res && res.documents) {
                setPosts(res.documents);
            } else {
                setPosts([]);
            }
            setLoading(false);
        });
    }, [location.pathname]); // Re-fetch on every route visit

    return (
        <div className="w-full py-12 bg-white min-h-[85vh]">
            <Container>
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-black tracking-tight">All Published Posts</h1>
                    <p className="text-slate-600 text-sm mt-1">Browse and explore community posts</p>
                </div>
                {loading ? (
                    <div className="text-center py-20 text-red-600 font-bold">Fetching latest posts...</div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20 text-slate-500 bg-red-50 rounded-2xl border border-red-200">
                        No posts found in the database.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {posts.map((post) => (
                            <div key={post.$id} className="transition-all duration-300 hover:-translate-y-1">
                                <PostCard {...post} />
                            </div>
                        ))}
                    </div>
                )}
            </Container>
        </div>
    );
}