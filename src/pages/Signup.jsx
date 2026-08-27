// src/components/Signup.jsx
import React, { useState } from 'react';
import authService from '../appwrite/auth';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../store/authSlice';
import { Button, Input, Logo } from '../components/index.js';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';

export default function Signup() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const { register, handleSubmit } = useForm();

    const create = async (data) => {
        setError("");
        try {
            const userData = await authService.createAccount(data);
            if (userData) {
                const currentUser = await authService.getCurrentUser();
                if (currentUser) dispatch(login(currentUser));
                navigate("/");
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center bg-white px-4">
            <div className="w-full max-w-md bg-white border border-red-200 rounded-2xl p-8 shadow-xl">
                <div className="mb-6 flex justify-center">
                    <Logo width="100%" />
                </div>
                <h2 className="text-center text-2xl font-bold text-black">Create an account</h2>
                <p className="mt-2 text-center text-sm text-slate-600">
                    Already have an account?&nbsp;
                    <Link to="/login" className="font-bold text-red-600 hover:underline">
                        Sign In
                    </Link>
                </p>
                {error && <p className="text-red-600 text-sm mt-4 text-center bg-red-50 py-2 rounded-lg border border-red-200 font-medium">{error}</p>}

                <form onSubmit={handleSubmit(create)} className="mt-6 space-y-4">
                    <Input
                        label="Full Name: "
                        placeholder="Enter your full name"
                        className="bg-white border-red-300 text-black focus:border-red-600"
                        {...register("name", { required: true })}
                    />
                    <Input
                        label="Email: "
                        placeholder="Enter your email"
                        type="email"
                        className="bg-white border-red-300 text-black focus:border-red-600"
                        {...register("email", { required: true })}
                    />
                    <Input
                        label="Password: "
                        type="password"
                        placeholder="Enter your password"
                        className="bg-white border-red-300 text-black focus:border-red-600"
                        {...register("password", { required: true })}
                    />
                    <Button
                        type="submit"
                        className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-500/20 transition-all duration-300"
                    >
                        Create Account
                    </Button>
                </form>
            </div>
        </div>
    );
}