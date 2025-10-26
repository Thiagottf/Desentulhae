import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import api from '../services/api';

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

  const inputClass =
    "w-full h-12 bg-white border-2 border-gray-400 rounded-md shadow-sm px-4 pr-10 " +
    "placeholder-gray-500 text-gray-900 focus:outline-none " +
    "focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/40";

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center px-4 py-8">
      <div className="max-w-6xl w-full flex flex-col md:flex-row items-baseline justify-center gap-6">
        {/* Lado esquerdo - marca e descrição */}
        <div className="relative text-center md:text-left md:w-1/2 -mt-8">
          <h1 className="text-[44px] md:text-[56px] font-bold text-[#f97316] leading-none">
            Desentulhaê
          </h1>
          <p className="mt-3 md:mt-4 text-xl md:text-2xl text-gray-800 max-w-xl">
            Crie sua conta e comece a transformar entulho em oportunidade.
          </p>
        </div>

        {/* Lado direito - formulário */}
        <div className="md:w-[500px] w-full">
          <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.1)] p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cadastro</h2>

            {errorMessage && (
              <div className="rounded-md border border-red-300 bg-red-50 text-red-700 text-sm px-3 py-2 mb-4">
                {errorMessage}
              </div>
            )}

        <form onSubmit={handleCadastro} className="space-y-3">
              <div className="relative">
                <Input
                  type="text"
                  name="nome_completo"
                  placeholder="Nome completo"
                  required
                  value={form.nome_completo}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div className="relative">
                <Input
                  type="text"
                  name="apelido"
                  placeholder="Apelido"
                  required
                  value={form.apelido}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div className="relative">
                <Input
                  type="text"
                  name="cpf"
                  placeholder="CPF"
                  required
                  value={form.cpf}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div className="relative">
                <Input
                  type="date"
                  name="data_nascimento"
                  required
                  value={form.data_nascimento}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div className="relative">
                <Input
                  type="text"
                  name="telefone"
                  placeholder="Telefone"
                  required
                  value={form.telefone}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div className="relative">
                <Input
                  type="email"
                  name="email"
                  placeholder="E-mail"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div className="relative">
                <Input
                  type="password"
                  name="senha"
                  placeholder="Senha"
                  required
                  value={form.senha}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div className="relative">
                <Input
                  type="password"
                  name="confirmarSenha"
                  placeholder="Confirmar senha"
                  required
                  value={form.confirmarSenha}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-md bg-[#f97316] text-white font-semibold text-lg hover:brightness-95 active:brightness-90 transition mt-4"
              >
                Criar conta
              </button>

              <div className="w-full h-px bg-gray-200 my-4" />

              <button
                type="button"
                className="w-fit mx-auto block px-5 h-12 rounded-md bg-[#42b72a] text-white font-semibold text-base hover:brightness-95 active:brightness-90"
                onClick={() => navigate("/login")}
              >
                Já tem uma conta?
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cadastro;
