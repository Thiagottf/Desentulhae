import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import  api  from '../services/api';

const Cadastro = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome_completo: '',
    apelido: '',
    cpf: '',
    data_nascimento: '',
    telefone: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  });

  const [errorField, setErrorField] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errorField === e.target.name) {
      setErrorField(null);
      setErrorMessage('');
    }
  };

  const handleCadastro = async (e) => {
    e.preventDefault();
    setErrorField(null);
    setErrorMessage('');

    if (form.senha !== form.confirmarSenha) {
      setErrorField('confirmarSenha');
      setErrorMessage('As senhas não coincidem.');
      return;
    }

    try {
      await api.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      const error = err.response?.data?.error || 'Erro ao cadastrar usuário.';
      const field = err.response?.data?.field || null;

      setErrorField(field);
      setErrorMessage(error);
    }
  };

  const inputClass = (name) =>
    `w-full pl-5 pr-10 p-2 rounded bg-transparent border focus:outline-none ${
      errorField === name ? 'border-red-500' : 'border-white/30'
    } text-white`;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-lg bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Cadastro</h1>

        {errorMessage && (
          <p className="text-red-500 text-center mb-4">{errorMessage}</p>
        )}

        <form onSubmit={handleCadastro} className="space-y-4">
          <Input
            type="text"
            name="nome_completo"
            placeholder="Nome completo"
            required
            value={form.nome_completo}
            onChange={handleChange}
            className={inputClass('nome_completo')}
          />
          <Input
            type="text"
            name="apelido"
            placeholder="Apelido"
            required
            value={form.apelido}
            onChange={handleChange}
            className={inputClass('apelido')}
          />
          <Input
            type="text"
            name="cpf"
            placeholder="CPF"
            required
            value={form.cpf}
            onChange={handleChange}
            className={inputClass('cpf')}
          />
          <Input
            type="date"
            name="data_nascimento"
            placeholder="Data de nascimento"
            required
            value={form.data_nascimento}
            onChange={handleChange}
            className={inputClass('data_nascimento')}
          />
          <Input
            type="text"
            name="telefone"
            placeholder="Telefone"
            required
            value={form.telefone}
            onChange={handleChange}
            className={inputClass('telefone')}
          />
          <Input
            type="email"
            name="email"
            placeholder="E-mail"
            required
            value={form.email}
            onChange={handleChange}
            className={inputClass('email')}
          />
          <Input
            type="password"
            name="senha"
            placeholder="Senha"
            required
            value={form.senha}
            onChange={handleChange}
            className={inputClass('senha')}
          />
          <Input
            type="password"
            name="confirmarSenha"
            placeholder="Confirmar senha"
            required
            value={form.confirmarSenha}
            onChange={handleChange}
            className={inputClass('confirmarSenha')}
          />

          <button
            type="submit"
            className="w-full bg-white text-green-800 font-semibold py-2 rounded-full hover:bg-gray-100 transition"
          >
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Cadastro;
