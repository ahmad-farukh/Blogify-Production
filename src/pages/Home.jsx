// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import appwriteService from "../appwrite/config";
import { Container, PostCard } from '../components';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const authStatus = useSelector((state) => state.auth.status);

    useEffect(() => {
        if (authStatus) {
            appwriteService.getPosts().then((res) => {
                if (res && res.documents) {
                    setPosts(res.documents);
                }
                setLoading(false);
            });
        }
    }, [authStatus]);

    if (!authStatus) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center bg-white text-black relative px-4">
                <div className="text-center max-w-2xl mx-auto z-10 space-y-6">
                    <span className="inline-block px-4 py-1.5 bg-red-50 border border-red-200 text-red-600 rounded-full text-xs font-bold uppercase tracking-wider">
                        Welcome to Dev Blog
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-black">
                        Share Your Ideas With The World
                    </h1>
                    <p className="text-slate-600 text-base md:text-lg">
                        Login to explore articles, create rich text posts, and connect with creative minds.
                    </p>
                    <div className="pt-4 flex justify-center gap-4">
                        <Link
                            to="/login"
                            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-500/20 transition-all duration-300"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full py-12 bg-white min-h-[85vh]">
            <Container>
                <div className="mb-10 text-center md:text-left">
                    <h1 className="text-3xl font-bold text-black tracking-tight">Latest Articles</h1>
                    <p className="text-slate-600 text-sm mt-1">Explore all community published blogs</p>
                </div>
                {loading ? (
                    <div className="text-center py-20 text-red-600 font-bold">Loading posts...</div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20 text-slate-500 bg-red-50 rounded-2xl border border-red-200">
                        No posts published yet. Be the first to publish one!
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