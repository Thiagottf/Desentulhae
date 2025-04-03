import { useState, useEffect } from "react";

const Relatorios = () => {
const [posts, setPosts] = useState([]);

useEffect(() => {
    const postsData = JSON.parse(localStorage.getItem("posts")) || [];
    setPosts(postsData);
}, []);

  // Exemplo: agrupar por categoria ou destino (caso tenha esse campo)
const relatorioPorCategoria = posts.reduce((acc, post) => {
    acc[post.categoria] = (acc[post.categoria] || 0) + 1;
    return acc;
}, {});

return (
    <div className="max-w-4xl mx-auto p-4">
    <h1 className="text-3xl font-bold mb-4">Relatórios de Destino dos Entulhos</h1>
    <h2 className="text-xl font-semibold mb-2">Quantidade por Categoria</h2>
    <table className="w-full border-collapse">
        <thead>
        <tr>
            <th className="border p-2">Categoria</th>
            <th className="border p-2">Quantidade</th>
        </tr>
        </thead>
        <tbody>
        {Object.entries(relatorioPorCategoria).map(([categoria, quantidade]) => (
            <tr key={categoria}>
            <td className="border p-2">{categoria}</td>
            <td className="border p-2">{quantidade}</td>
            </tr>
        ))}
        </tbody>
    </table>
    </div>
);
};

export default Relatorios;
