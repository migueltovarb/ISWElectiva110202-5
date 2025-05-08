import React, { useState } from "react";
import axios from "axios";

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
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
            />
            <input
                type="text"
                placeholder="Especialidad"
                value={especialidad}
                onChange={(e) => setEspecialidad(e.target.value)}
            />
            <input
                type="text"
                placeholder="Cédula Profesional"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
            />
            <input
                type="email"
                placeholder="Correo"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
            />
            <input
                type="tel"
                placeholder="Teléfono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
            />
            <label>
                <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={() => setTermsAccepted(!termsAccepted)}
                />
                Acepto los términos y condiciones
            </label>
            {error && <p>{error}</p>}
            <button type="submit">Registrar</button>
        </form>
    );
};

export default CrearMedico;