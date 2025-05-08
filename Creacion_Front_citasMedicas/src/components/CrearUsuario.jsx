import { useState } from "react";
import axios from "axios";
import { FaUser, FaEnvelope, FaPhone, FaLock } from "react-icons/fa";

const CrearUsuario = () => {
    const [formData, setFormData] = useState({
    nombre_completo: "",
    email: "",
    telefono: "",
    password: "",
    });

    const [aceptaTerminos, setAceptaTerminos] = useState(false);
    const [mensaje, setMensaje] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje(null);
    setError(null);

    if (!aceptaTerminos) {
        setError("Debes aceptar los términos y condiciones.");
        return;
    }

    setLoading(true);
    try {
        const response = await axios.post(
        `${import.meta.env.VITE_API_URL}registro-paciente/`,
        formData
        );
        setMensaje(response.data.mensaje || "Registro exitoso.");
        setFormData({
        nombre_completo: "",
        email: "",
        telefono: "",
        password: "",
        });
        setAceptaTerminos(false);
    } catch (err) {
        if (err.response?.data?.error) {
        setError(err.response.data.error);
        } else {
        setError("Ocurrió un error al intentar registrar.");
        }
    } finally {
        setLoading(false);
    }
    };

    return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-950 shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold text-center text-indigo-600 mb-2">🩺 Registro de Pacientes</h2>
        <p className="text-center text-white mb-4">Completa el formulario para crear tu cuenta</p>

        {mensaje && <p className="text-green-600 text-center mb-4">{mensaje}</p>}
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
            icon={<FaUser />}
            name="nombre_completo"
            type="text"
            placeholder="Nombre completo"
            value={formData.nombre_completo}
            onChange={handleChange}
        />

        <InputField
            icon={<FaEnvelope />}
            name="email"
            type="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
        />

        <InputField
            icon={<FaPhone />}
            name="telefono"
            type="tel"
            placeholder="Número de teléfono"
            value={formData.telefono}
            onChange={handleChange}
        />

        <InputField
            icon={<FaLock />}
            name="password"
            type="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
        />

        <div className="flex items-center text-sm">
            <input
            type="checkbox"
            checked={aceptaTerminos}
            onChange={(e) => setAceptaTerminos(e.target.checked)}
            className="mr-2"
            />
            <span>
            Acepto los{" "}
            <a href="#" className="text-blue-600 underline">
                Términos y Condiciones
            </a>
            </span>
        </div>

        <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-800 hover:bg-indigo-600 text-white py-2 rounded-xl font-semibold transition"
        >
            {loading ? "Registrando..." : "Registrarme"}
        </button>
        </form>
    </div>
    );
};

const InputField = ({ icon, ...props }) => (
    <div className="relative">
    <span className="absolute left-3 top-3 text-gray-400">{icon}</span>
    <input
        {...props}
        className="w-full pl-10 pr-4 py-2 border rounded-xl bg-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
    />
    </div>
);

export default CrearUsuario;