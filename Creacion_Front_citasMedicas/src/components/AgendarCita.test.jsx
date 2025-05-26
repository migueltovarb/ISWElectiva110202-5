import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import AgendarCita from './AgendarCita';

// Mock completo de axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('AgendarCita Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should show login error when no auth token is present', () => {
    localStorage.removeItem('auth_token');
    render(<AgendarCita />);
    
    expect(screen.getByText(/debes iniciar sesión/i)).toBeInTheDocument();
    const confirmButton = screen.getByRole('button', { name: /confirmar|confirm/i });
    expect(confirmButton).toBeDisabled();
  });

  it('should allow booking when auth token is present', async () => {
    localStorage.setItem('auth_token', 'test-token');
    axios.post.mockResolvedValueOnce({
      data: { message: 'Cita agendada exitosamente' }
    });

    render(<AgendarCita />);
    
    expect(screen.queryByText(/debes iniciar sesión/i)).not.toBeInTheDocument();
    
    // Simular llenado del formulario
    fireEvent.change(screen.getByLabelText(/fecha/i), { 
      target: { value: '2023-01-01' } 
    });
    fireEvent.change(screen.getByLabelText(/hora/i), { 
      target: { value: '10:00' } 
    });

    const confirmButton = await screen.findByRole('button', { 
      name: /confirmar|confirm/i 
    }, { timeout: 2000 });
    
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(screen.getByText(/cita agendada/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('should show API error when booking fails', async () => {
    localStorage.setItem('auth_token', 'test-token');
    axios.post.mockRejectedValueOnce({
      response: { 
        data: { message: 'Error al agendar la cita' } 
      }
    });

    render(<AgendarCita />);
    
    fireEvent.change(screen.getByLabelText(/fecha/i), { 
      target: { value: '2023-01-01' } 
    });

    const confirmButton = await screen.findByRole('button', { 
      name: /confirmar|confirm/i 
    }, { timeout: 2000 });
    
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(screen.getByText(/error al agendar/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('should show network error when booking fails', async () => {
    localStorage.setItem('auth_token', 'test-token');
    axios.post.mockRejectedValueOnce(new Error('Network Error'));

    render(<AgendarCita />);
    
    // Primero llenar los campos requeridos si es necesario
    fireEvent.change(screen.getByLabelText(/fecha/i), {
      target: { value: '2023-01-01' }
    });

    // Esperar a que el botón esté disponible
    const confirmButton = await screen.findByRole('button', {
      name: /confirmar|confirm/i
    }, { timeout: 3000 });

    // Verificar que el botón está habilitado
    expect(confirmButton).toBeEnabled();

    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(screen.getByText(/error de conexión|network error/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});