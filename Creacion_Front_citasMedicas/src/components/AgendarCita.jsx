import axios from 'axios';
import React, { useEffect, useState } from 'react';

const AgendarCita = ({ apiUrl = 'http://127.0.0.1:8000/api/' }) => {
    const [especialidades, setEspecialidades] = useState([]);
    const [medicos, setMedicos] = useState([]);
    const [selectedEspecialidad, setSelectedEspecialidad] = useState('');
    const [selectedMedico, setSelectedMedico] = useState('');
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchEspecialidades = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`${apiUrl}/especialidades/`);
                setEspecialidades(response.data);
            } catch (err) {
                setError('Error al cargar las especialidades');
            } finally {
                setIsLoading(false);
            }
        };

        fetchEspecialidades();
    }, [apiUrl]);

    useEffect(() => {
        const fetchMedicos = async () => {
            if (selectedEspecialidad) {
                try {
                    setIsLoading(true);
                    const response = await axios.get(
                        `${apiUrl}/medicos/?especialidad=${selectedEspecialidad}`
                    );
                    setMedicos(response.data);
                    setSelectedMedico('');
                } catch (err) {
                    setError('Error al cargar los médicos');
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchMedicos();
    }, [selectedEspecialidad, apiUrl]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Limpiar errores previos
        setIsLoading(true);

        const token = localStorage.getItem('auth_token');
        if (!token) {
            setError('Debes iniciar sesión para agendar una cita');
            setIsLoading(false);
            return;
        }

        const citaData = {
            medico: selectedMedico,
            fecha,
            hora,
        };

        try {
            const response = await axios.post(
                `${apiUrl}/agendar_cita/`,
                citaData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setMensaje(response.data.mensaje);
            setError('');
            setSelectedMedico('');
            setFecha('');
            setHora('');
        } catch (err) {
            setError(err.response?.data?.message || 'Error al agendar la cita');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fmax-w-md mx-auto mt-10 p-6 bg-gray-950 shadow-lg rounded-xl">
            <h1 className="text-2xl font-bold text-center text-indigo-600 mb-2">Request an Appointment</h1>
            <form
                onSubmit={handleSubmit}
                className="bg-gray-600 shadow-md rounded-lg p-8 w-full max-w-md"
            >
                <div className="mb-4">
                    <label className="block text-white font-medium mb-2">Especialidad</label>
                    <select
                        value={selectedEspecialidad}
                        onChange={(e) => setSelectedEspecialidad(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg p-2"
                        disabled={isLoading}
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
                    <label className="block text-white font-medium mb-2">Médico</label>
                    <select
                        value={selectedMedico}
                        onChange={(e) => setSelectedMedico(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg p-2"
                        disabled={!selectedEspecialidad || isLoading}
                    >
                        <option value="">Seleccione un médico</option>
                        {medicos.map((medico) => (
                            <option key={medico.id} value={medico.id}>
                                {medico.user?.first_name} {medico.user?.last_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-white font-medium mb-2">Fecha</label>
                    <input
                        type="date"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg p-2"
                        disabled={isLoading}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-white font-medium mb-2">Hora</label>
                    <input
                        type="time"
                        value={hora}
                        onChange={(e) => setHora(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg p-2"
                        disabled={isLoading}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-cyan-800 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    disabled={isLoading}
                >
                    {isLoading ? 'Processing...' : 'Confirm'}
                </button>
            </form>

            {mensaje && <p role="alert" className="text-green-600 mt-4">{mensaje}</p>}
            {error && <p role="alert" className="text-red-600 mt-4">{error}</p>}
        </div>
    );
};

export default AgendarCita;