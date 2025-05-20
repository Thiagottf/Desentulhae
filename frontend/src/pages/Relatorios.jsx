import { useState, useEffect } from "react";
import api from "../services/api";

const Relatorios = () => {
const [relatorioPorCategoria, setRelatorioPorCategoria] = useState({});
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
    (async () => {
    setLoading(true);
    try {
        const { data } = await api.get('/entulhos/report');
        // data esperado: { categoriaA: count, categoriaB: count, ... }
        setRelatorioPorCategoria(data);
    } catch (err) {
        console.error('Erro ao carregar relatórios', err);
        setError('Não foi possível carregar os relatórios.');
    } finally {
        setLoading(false);
    }
    })();
}, []);

if (loading) {
    return <p className="text-center mt-10">Carregando relatórios...</p>;
}
if (error) {
    return <p className="text-center mt-10 text-red-500">{error}</p>;
}

return (
    <div className="max-w-4xl mx-auto p-4">
    <h1 className="text-3xl font-bold mb-4">Relatórios de Destino dos Entulhos</h1>
    <h2 className="text-xl font-semibold mb-2">Quantidade por Categoria</h2>
    <table className="w-full border-collapse">
        <thead>
        <tr>
            <th className="border p-2 text-left">Categoria</th>
            <th className="border p-2 text-right">Quantidade</th>
        </tr>
        </thead>
        <tbody>
        {Object.entries(relatorioPorCategoria).map(([categoria, quantidade]) => (
            <tr key={categoria}>
            <td className="border p-2">{categoria}</td>
            <td className="border p-2 text-right">{quantidade}</td>
            </tr>
        ))}
        </tbody>
    </table>
    </div>
);
};

export default Relatorios;
