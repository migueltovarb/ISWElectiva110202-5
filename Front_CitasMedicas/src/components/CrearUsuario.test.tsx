import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CrearUsuario from './CrearUsuario'
import axios from 'axios'
import React from 'react'

// Solución recomendada - Opción 1
const mockedAxios = vi.mocked(axios, true)

describe('CrearUsuario Component', () => {
    beforeEach(() => {
    vi.clearAllMocks()
    })

    it('maneja errores de red', async () => {
    const user = userEvent.setup()
    
    // Configurar el mock para rechazar con error de red
    mockedAxios.post.mockRejectedValue(new Error('Network Error'))
    
    render(<CrearUsuario />)
    
    // Llenar y enviar formulario...
    await user.type(screen.getByPlaceholderText('Nombre completo'), 'Juan Perez')
    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByText('Registrarme'))
    
    await waitFor(() => {
        expect(screen.getByText(/Ocurrió un error al intentar registrar/i)).toBeInTheDocument()
    })
    })
})