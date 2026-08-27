import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/config";
import authService from "../../appwrite/auth";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);

    const submit = async (data) => {
        setLoading(true);
        setErrorMsg("");
        try {
            // Get active user ID dynamically (Redux Store or Direct Appwrite Fallback)
            let currentUserId = userData?.$id || userData?.userData?.$id;

            if (!currentUserId) {
                const currentUser = await authService.getCurrentUser();
                currentUserId = currentUser?.$id;
            }

            if (!currentUserId && !post) {
                setErrorMsg("User session not found. Please log in again.");
                setLoading(false);
                return;
            }

            if (post) {
                let fileId = post.featuredImage;

                if (data.image && data.image[0]) {
                    const uploadedFile = await appwriteService.uploadFile(data.image[0]);
                    if (uploadedFile) {
                        if (post.featuredImage) {
                            await appwriteService.deleteFile(post.featuredImage);
                        }
                        fileId = uploadedFile.$id;
                    }
                }

                const dbPost = await appwriteService.updatePost(post.$id, {
                    ...data,
                    featuredImage: fileId,
                });

                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                }
            } else {
                if (!data.image || !data.image[0]) {
                    setErrorMsg("Featured image is required.");
                    setLoading(false);
                    return;
                }

                const file = await appwriteService.uploadFile(data.image[0]);

                if (file) {
                    const fileId = file.$id;
                    const dbPost = await appwriteService.createPost({
                        title: data.title,
                        slug: data.slug,
                        content: data.content,
                        featuredImage: fileId,
                        status: data.status,
                        userId: currentUserId,
                    });

                    if (dbPost) {
                        navigate(`/post/${dbPost.$id}`);
                    }
                } else {
                    setErrorMsg("Failed to upload image. Please try again.");
                }
            }
        } catch (error) {
            console.error("Form Submit Error:", error);
            setErrorMsg(error.message || "An error occurred while saving the post.");
        } finally {
            setLoading(false);
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string") {
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z0-9\s-]/g, "")
                .replace(/\s+/g, "-")
                .slice(0, 35);
        }
        return "";
    }, []);

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    const previewUrl = post?.featuredImage ? appwriteService.getFilePreview(post.featuredImage) : '';
    const imageUrl = typeof previewUrl === 'object' ? previewUrl?.href : previewUrl;

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-col lg:flex-row gap-8 bg-white p-6 md:p-8 rounded-2xl border border-red-200 shadow-lg">
            {errorMsg && (
                <div className="w-full lg:col-span-2 bg-red-50 text-red-600 p-3 rounded-xl border border-red-200 text-sm font-semibold mb-4">
                    {errorMsg}
                </div>
            )}
            
            <div className="w-full lg:w-2/3 space-y-6">
                <Input
                    label="Title :"
                    placeholder="Enter post title"
                    className="bg-white text-black border-red-300 focus:border-red-600 focus:bg-white focus:text-black"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Generated slug"
                    className="bg-white text-black border-red-300 focus:border-red-600 focus:bg-white focus:text-black"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>

            <div className="w-full lg:w-1/3 space-y-6">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="bg-white text-black border-red-300"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {post && post.featuredImage && (
                    <div className="w-full overflow-hidden rounded-xl border border-red-200">
                        <img
                            src={imageUrl}
                            alt={post.title}
                            className="w-full h-48 object-cover"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="bg-white text-black border-red-300"
                    {...register("status", { required: true })}
                />
                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 font-bold rounded-xl text-white bg-red-600 border border-red-600 shadow-md transition-all disabled:opacity-50"
                >
                    {loading ? "Processing..." : post ? "Update Post" : "Publish Post"}
                </Button>
            </div>
        </form>
    );
}