import { useState } from "react";
import axios from 'axios';

const RegistrarMedico = () => {
    const [formulario, setFormulario] = useState({
    nombre: '',
    especialidad: '',
    cedula: '',
    email: '',
    telefono: '',
    });
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    try {
        const res = await axios.post('http://127.0.0.1:8000/registrar_medico/', formulario);
        setMensaje(res.data.mensaje);
    } catch (err) {
        console.log(err.response);
        if (err.response?.data?.error) {
        setError(err.response.data.error);
        } else {
        setError("Error al registrar médico.");
        }
    }
    };

    return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Registro de Médico</h2>
        {mensaje && <p className="text-green-600 mb-4">{mensaje}</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="nombre" placeholder="Nombre" value={formulario.nombre} onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="text" name="especialidad" placeholder="Especialidad" value={formulario.especialidad} onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="text" name="cedula" placeholder="Cédula Profesional" value={formulario.cedula} onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="email" name="email" placeholder="Correo" value={formulario.email} onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="text" name="telefono" placeholder="Teléfono" value={formulario.telefono} onChange={handleChange} className="w-full p-2 border rounded" />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full">Registrar</button>
        </form>
    </div>
    );
};

export default RegistrarMedico;