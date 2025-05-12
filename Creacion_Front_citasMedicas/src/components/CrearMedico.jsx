import axios from "axios";
import { useState } from "react";
import { FaEnvelope, FaPhone, FaUser } from "react-icons/fa";

const CrearMedico = () => {
    const [formData, setFormData] = useState({
    nombre: "",
    especialidad: "",
    cedula: "",
    email: "",
    telefono: "",
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
        `${import.meta.env.VITE_API_URL}registro-medico/`,
        formData
        );
        setMensaje(response.data.mensaje || "Registro exitoso.");
        setFormData({
        nombre: "",
        especialidad: "",
        cedula: "",
        email: "",
        telefono: "",
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
            <h2 className="text-2xl font-bold text-center text-indigo-600 mb-2">Registrar Médico</h2>
            <p className="text-center text-white mb-4">Completa el formulario para crear tu cuenta</p>

            {mensaje && <p className="text-green-600 text-center mb-4">{mensaje}</p>}
            {error && <p className="text-red-600 text-center mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <InputField
                    icon={<FaUser />}
                    name="nombre"
                    type="text"
                    placeholder="Nombre"
                    value={formData.Nombre}
                    onChange={handleChange}
                />
                <InputField
                    icon={<FaUser />}
                    name="especialidad"
                    type="text"
                    placeholder="Especialidad"
                    value={formData.Especialidad}
                    onChange={handleChange}
                    
                />
                <InputField
                    icon={<FaUser />}
                    name="cedula"
                    type="text"
                    placeholder="Cédula Profesional"
                    value={formData.Cedula_Profesional}
                    onChange={handleChange}
                />
                <InputField
                    icon={<FaEnvelope />}
                    name="email"
                    type="email"
                    placeholder="email"
                    value={formData.correo}
                    onChange={handleChange}
                />
                <InputField
                    icon={<FaPhone />}
                    name="telefono"
                    type="telefono"
                    placeholder="telefono"
                    value={formData.telefono}
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

export default CrearMedico;