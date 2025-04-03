import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Blog = () => {
const [posts, setPosts] = useState([]);

useEffect(() => {
    const blogPosts = JSON.parse(localStorage.getItem("blogPosts")) || [];
    setPosts(blogPosts);
}, []);

return (
    <div className="max-w-4xl mx-auto p-4">
    <h1 className="text-3xl font-bold mb-4">Blog & Ideias</h1>
    {posts.length === 0 ? (
        <p>Nenhum post ainda. Volte mais tarde!</p>
    ) : (
        <div className="grid grid-cols-1 gap-6">
        {posts.map((post, index) => (
            <div key={index} className="bg-white p-4 rounded shadow">
            {post.image && (
                <img
                src={post.image}
                alt={post.title}
                cassName="w-full h-48 object-cover rounded mb-4"
                />
        )}
            <h2 className="text-2xl font-semibold">{post.title}</h2>
            <p className="mt-2 text-gray-700">{post.excerpt}</p>
            <Link to={`/blog/${index}`} className="text-blue-600 hover:underline">
                Ler Mais
            </Link>
            </div>
        ))}
        </div>
    )}
    </div>
);
};

export default Blog;
