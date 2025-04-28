    // src/components/AgendarCita.jsx
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
            .catch((err) => setError('Error al cargar las especialidades'));
        }, []);

    useEffect(() => {
        if (selectedEspecialidad) {
            axios.get(`http://127.0.0.1:8000/api/medicos/?especialidad=${selectedEspecialidad}`)
                .then((response) => setMedicos(response.data))
                .catch((err) => setError('Error al cargar los médicos'));
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
        } catch (err) {
        setError('Error al agendar la cita');
        console.error(err);
        }
    };

    return (
        <div>
            <h1>Agendar Cita</h1>
            <form onSubmit={handleSubmit}>
            <div>
                <label>Especialidad</label>
                <select
                    value={selectedEspecialidad}
                    onChange={(e) => setSelectedEspecialidad(e.target.value)}
                    required
                >
                <option value="">Seleccione una especialidad</option>
                {especialidades.map((especialidad) => (
                    <option key={especialidad.id} value={especialidad.id}>
                        {especialidad.nombre}
                    </option>
                ))}
            </select>
            </div>

            <div>
                <label>Médico</label>
                <select
                    value={selectedMedico}
                    onChange={(e) => setSelectedMedico(e.target.value)}
                    required
                >
                    <option value="">Seleccione un médico</option>
                    {medicos.map((medico) => (
                    <option key={medico.id} value={medico.id}>
                        {medico.user.first_name} {medico.user.last_name}
                    </option>
                    ))}
                </select>
            </div>

            <div>
            <label>Fecha</label>
            <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                required
            />
            </div>

            <div>
                <label>Hora</label>
                <input
                    type="time"
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                    required
                />
            </div>

                <button type="submit">Agendar Cita</button>
            </form>

            {mensaje && <p>{mensaje}</p>}
            {error && <p>{error}</p>}
        </div>
    );
    };

    export default AgendarCita;
