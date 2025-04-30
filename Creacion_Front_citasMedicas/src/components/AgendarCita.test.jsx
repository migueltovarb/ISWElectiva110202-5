import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import axios from 'axios';
import AgendarCita from './AgendarCita';

vi.mock('axios');

describe('AgendarCita Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the form correctly', () => {
        render(<AgendarCita />);
        expect(screen.getByText('Request an Appointment')).toBeInTheDocument();
        expect(screen.getByLabelText('Especialidad')).toBeInTheDocument();
        expect(screen.getByLabelText('Médico')).toBeInTheDocument();
        expect(screen.getByLabelText('Fecha')).toBeInTheDocument();
        expect(screen.getByLabelText('Hora')).toBeInTheDocument();
        expect(screen.getByText('Confirm')).toBeInTheDocument();
    });

    it('fetches and displays specialties on load', async () => {
        const mockEspecialidades = [
            { id: 1, nombre: 'Cardiología' },
            { id: 2, nombre: 'Dermatología' },
        ];
        axios.get.mockResolvedValueOnce({ data: mockEspecialidades });

        render(<AgendarCita />);

        await waitFor(() => {
            expect(screen.getByText('Cardiología')).toBeInTheDocument();
            expect(screen.getByText('Dermatología')).toBeInTheDocument();
        });
    });

    it('fetches and displays doctors when a specialty is selected', async () => {
        const mockMedicos = [
            { id: 1, user: { first_name: 'Juan', last_name: 'Pérez' } },
            { id: 2, user: { first_name: 'Ana', last_name: 'Gómez' } },
        ];
        axios.get.mockResolvedValueOnce({ data: mockMedicos });

        render(<AgendarCita />);
        fireEvent.change(screen.getByLabelText('Especialidad'), {
            target: { value: '1' },
        });

        await waitFor(() => {
            expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
            expect(screen.getByText('Ana Gómez')).toBeInTheDocument();
        });
    });

    it('submits the form successfully', async () => {
        const mockResponse = { data: { mensaje: 'Cita agendada con éxito' } };
        axios.post.mockResolvedValueOnce(mockResponse);
        localStorage.setItem('auth_token', 'mockToken');

        render(<AgendarCita />);
        fireEvent.change(screen.getByLabelText('Especialidad'), {
            target: { value: '1' },
        });
        fireEvent.change(screen.getByLabelText('Médico'), {
            target: { value: '1' },
        });
        fireEvent.change(screen.getByLabelText('Fecha'), {
            target: { value: '2023-10-10' },
        });
        fireEvent.change(screen.getByLabelText('Hora'), {
            target: { value: '10:00' },
        });
        fireEvent.click(screen.getByText('Confirm'));

        await waitFor(() => {
            expect(screen.getByText('Cita agendada con éxito')).toBeInTheDocument();
        });
    });

    it('displays an error message if fetching specialties fails', async () => {
        axios.get.mockRejectedValueOnce(new Error('Error al cargar las especialidades'));

        render(<AgendarCita />);

        await waitFor(() => {
            expect(screen.getByText('Error al cargar las especialidades')).toBeInTheDocument();
        });
    });

    it('displays an error message if fetching doctors fails', async () => {
        axios.get.mockRejectedValueOnce(new Error('Error al cargar los médicos'));

        render(<AgendarCita />);
        fireEvent.change(screen.getByLabelText('Especialidad'), {
            target: { value: '1' },
        });

        await waitFor(() => {
            expect(screen.getByText('Error al cargar los médicos')).toBeInTheDocument();
        });
    });

    it('displays an error message if form submission fails', async () => {
        axios.post.mockRejectedValueOnce(new Error('Error al agendar la cita'));
        localStorage.setItem('auth_token', 'mockToken');

        render(<AgendarCita />);
        fireEvent.change(screen.getByLabelText('Especialidad'), {
            target: { value: '1' },
        });
        fireEvent.change(screen.getByLabelText('Médico'), {
            target: { value: '1' },
        });
        fireEvent.change(screen.getByLabelText('Fecha'), {
            target: { value: '2023-10-10' },
        });
        fireEvent.change(screen.getByLabelText('Hora'), {
            target: { value: '10:00' },
        });
        fireEvent.click(screen.getByText('Confirm'));

        await waitFor(() => {
            expect(screen.getByText('Error al agendar la cita')).toBeInTheDocument();
        });
    });

    it('displays an error message if no auth token is found', async () => {
        localStorage.removeItem('auth_token');

        render(<AgendarCita />);
        fireEvent.click(screen.getByText('Confirm'));

        await waitFor(() => {
            expect(screen.getByText('Debes iniciar sesión para agendar una cita')).toBeInTheDocument();
        });
    });
});