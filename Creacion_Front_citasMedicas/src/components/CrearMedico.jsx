import React, { useState } from "react";
import axios from "axios";
import "./CrearMedico.css"; // Archivo CSS para estilos personalizados

const CrearMedico = () => {
    const [nombre, setNombre] = useState("");
    const [especialidad, setEspecialidad] = useState("");
    const [cedula, setCedula] = useState("");
    const [correo, setCorreo] = useState("");
    const [telefono, setTelefono] = useState("");
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nombre || !especialidad || !cedula || !correo || !telefono) {
            setError("Todos los campos son obligatorios.");
            return;
        }

        if (!termsAccepted) {
            setError("Debes aceptar los términos y condiciones.");
            return;
        }

        try {
            const response = await axios.post("/api/medicos", { nombre, especialidad, cedula, correo, telefono });
            setError(response.data.mensaje);
        } catch (error) {
            setError(error.response?.data?.error || "Error al registrar médico.");
        }
    };

    return (
        <div className="form-container">
            <h2>Registrar Médico</h2>
            <form onSubmit={handleSubmit} className="form">
                <input
                    type="text"
                    placeholder="Nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="form-input"
                />
                <input
                    type="text"
                    placeholder="Especialidad"
                    value={especialidad}
                    onChange={(e) => setEspecialidad(e.target.value)}
                    className="form-input"
                />
                <input
                    type="text"
                    placeholder="Cédula Profesional"
                    value={cedula}
                    onChange={(e) => setCedula(e.target.value)}
                    className="form-input"
                />
                <input
                    type="email"
                    placeholder="Correo"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    className="form-input"
                />
                <input
                    type="tel"
                    placeholder="Teléfono"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="form-input"
                />
                <label className="form-checkbox">
                    <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={() => setTermsAccepted(!termsAccepted)}
                    />
                    Acepto los términos y condiciones
                </label>
                {error && <p className="form-error">{error}</p>}
                <button type="submit" className="form-button">Registrar</button>
            </form>
        </div>
    );
};

export default CrearMedico;