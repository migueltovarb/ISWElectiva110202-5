import axios from 'axios';
import { useState } from 'react';

const LoginMedico = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}medico/login/`, {
        email,
        password,
      });

      const { token, medico } = response.data;

      localStorage.setItem('token', token);

      setMensaje('Login exitoso');
      console.log(medico);

    } catch (error) {
      console.error(error);
      setMensaje('Correo o contraseña incorrectos');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Login Médico</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Correo"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
          Iniciar sesión
        </button>
      </form>
      {mensaje && <p className="mt-4 text-center text-red-500">{mensaje}</p>}
    </div>
  );
};

export default LoginMedico;
