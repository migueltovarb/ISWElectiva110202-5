import { useState } from "react";
import axios from "axios";

const CrearUsuario = () => {
    const [formData, setFormData] = useState({
    nombre_completo: "",
    email: "",
    telefono: "",
    password: ""
    });

    const [mensaje, setMensaje] = useState(null);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje(null);
    setError(null);

    try {
        const response = await axios.post("http://127.0.0.1:8000/registro_paciente/", formData);
        setMensaje(response.data.mensaje);
        setFormData({
        nombre_completo: "",
        email: "",
        telefono: "",
        password: ""
        });
    } catch (err) {
        if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
        } else {
        setError("Ocurrió un error al intentar registrar");
        }
    }
    };

    return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Registro de Paciente</h2>
        {mensaje && <p className="text-green-600 mb-4">{mensaje}</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
        <input
            type="text"
            name="nombre_completo"
            placeholder="Nombre completo"
            value={formData.nombre_completo}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl p-2"
            required
        />
        <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl p-2"
            required
        />
        <input
            type="tel"
            name="telefono"
            placeholder="Teléfono"
            value={formData.telefono}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl p-2"
            required
        />
        <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl p-2"
            required
        />
        <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition"
        >
            Registrarse
        </button>
        </form>
    </div>
    );
};

export default CrearUsuario;