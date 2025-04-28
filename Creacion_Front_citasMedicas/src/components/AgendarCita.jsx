import axios from 'axios';
import React, { useEffect, useState } from 'react';

const AgendarCita = () => {
    const [especialidades, setEspecialidades] = useState([]);
    const [medicos, setMedicos] = useState([]);
    const [selectedEspecialidad, setSelectedEspecialidad] = useState('');
    const [selectedMedico, setSelectedMedico] = useState('');
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/especialidades/')
            .then((response) => setEspecialidades(response.data))
            .catch(() => setError('Error al cargar las especialidades'));
    }, []);

    useEffect(() => {
        if (selectedEspecialidad) {
            axios.get(`http://127.0.0.1:8000/api/medicos/?especialidad=${selectedEspecialidad}`)
                .then((response) => setMedicos(response.data))
                .catch(() => setError('Error al cargar los médicos'));
        }
    }, [selectedEspecialidad]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('auth_token');
        if (!token) {
            setError('Debes iniciar sesión para agendar una cita');
            return;
        }

        const citaData = {
            medico: selectedMedico,
            fecha,
            hora,
        };

        try {
            const response = await axios.post(
                'http://127.0.0.1:8000/api/agendar_cita/',
                citaData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setMensaje(response.data.mensaje);
            setError('');
        } catch {
            setError('Error al agendar la cita');
        }
    };

    return (
        <div className="flex flex-col items-center bg-gray-50 min-h-screen py-10">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Request an Appointment</h1>
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-md rounded-lg p-8 w-full max-w-md"
            >
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Especialidad</label>
                    <select
                        value={selectedEspecialidad}
                        onChange={(e) => setSelectedEspecialidad(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg p-2"
                    >
                        <option value="">Seleccione una especialidad</option>
                        {especialidades.map((especialidad) => (
                            <option key={especialidad.id} value={especialidad.id}>
                                {especialidad.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Médico</label>
                    <select
                        value={selectedMedico}
                        onChange={(e) => setSelectedMedico(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg p-2"
                    >
                        <option value="">Seleccione un médico</option>
                        {medicos.map((medico) => (
                            <option key={medico.id} value={medico.id}>
                                {medico.user.first_name} {medico.user.last_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Fecha</label>
                    <input
                        type="date"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg p-2"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Hora</label>
                    <input
                        type="time"
                        value={hora}
                        onChange={(e) => setHora(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg p-2"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Confirm
                </button>
            </form>

            {mensaje && <p className="text-green-600 mt-4">{mensaje}</p>}
            {error && <p className="text-red-600 mt-4">{error}</p>}
        </div>
    );
};

export default AgendarCita;