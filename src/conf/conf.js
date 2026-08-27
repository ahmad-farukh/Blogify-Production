const conf = {
    appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL || ""),
    appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID || ""),
    appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID || ""),
    appwriteCollectionId: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID || ""),
    appwriteBucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID || ""),
    tinyMceApiKey: String(import.meta.env.VITE_TINYMCE_API_KEY || "lgsnhempgxezb06bh2sflrrw2n83w454u742v8wrvm1etmm5"),
};

export default conf;