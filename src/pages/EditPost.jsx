// src/pages/EditPost.jsx
import React, { useEffect, useState } from 'react';
import { Container, PostForm } from '../components';
import appwriteService from "../appwrite/config";
import { useNavigate, useParams } from 'react-router-dom';

export default function EditPost() {
    const [post, setPost] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) {
                    setPost(post);
                }
            });
        } else {
            navigate('/');
        }
    }, [slug, navigate]);

    return post ? (
        <div className='py-8 bg-white min-h-[85vh]'>
            <Container>
                <PostForm post={post} />
            </Container>
        </div>
    ) : (
        <div className="text-center py-20 text-red-600 font-bold">Loading Post for Editing...</div>
    );
}