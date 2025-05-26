import axios from 'axios';
import { useState } from 'react';

const LoginPaciente = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}api/login-paciente/`, {
        email,
        password,
      });

      setMensaje('Login exitoso');
      console.log(response.data);

    } catch (error) {
      setMensaje('Correo o contraseña incorrectos');
      console.error(error);
    }
  };

  return (
<div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-md p-8 rounded-xl shadow-none">
        <h2 className="text-4xl font-bold mb-2 text-center text-white">Iniciar Sesion</h2>
        <p className="text-center text-white mb-8">Inicia sesión para acceder a tus citas médicas</p>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {/* Icono de correo */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12l-4-4-4 4m8 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v4" />
              </svg>
            </span>
            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="w-full pl-10 pr-3 py-3 rounded-md bg-gray-100 text-gray-700 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {/* Icono de candado */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.104 0 2-.896 2-2V7a2 2 0 10-4 0v2c0 1.104.896 2 2 2zm6 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2v-6a2 2 0 012-2h8a2 2 0 012 2z" />
              </svg>
            </span>
            <input
              type="password"
              placeholder="Ingresa tu contraseña"
              className="w-full pl-10 pr-3 py-3 rounded-md bg-gray-100 text-gray-700 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <a href="#" className="text-indigo-500 text-sm hover:underline">olvidaste tu contraseña?</a>
          </div>
          <button type="submit" className="w-full bg-indigo-500 text-white py-3 rounded-md font-semibold text-lg hover:bg-indigo-600 transition">
            Iniciar Sesión
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-white">
          necesitas crear una cuenta?
          <a href="#" className="text-indigo-500 ml-1 hover:underline">crear cuenta</a>
        </div>
        {mensaje && <p className="mt-4 text-center text-red-500">{mensaje}</p>}
      </div>
    </div>
  );
};

export default LoginPaciente;
