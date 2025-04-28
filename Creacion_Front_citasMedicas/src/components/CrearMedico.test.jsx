import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import { vi, describe, it, beforeEach } from "vitest";
import RegistrarMedico from "./CrearMedico";

// Mock de axios para evitar solicitudes reales
vi.mock("axios");

describe("RegistrarMedico Component", () => {
    beforeEach(() => {
        // Limpiar todos los mocks antes de cada prueba
        vi.clearAllMocks();
    });

    it("debe renderizar el formulario con todos los campos y el botón de enviar", () => {
        render(<RegistrarMedico />);

        // Verificar que los campos del formulario estén presentes
        expect(screen.getByPlaceholderText("Nombre")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Especialidad")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Cédula Profesional")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Correo")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Teléfono")).toBeInTheDocument();
        expect(screen.getByText("Registrar")).toBeInTheDocument();
    });

    it("debe mostrar un error si algún campo obligatorio está vacío", async () => {
        render(<RegistrarMedico />);

        // Intentar enviar el formulario sin rellenar campos
        fireEvent.click(screen.getByText("Registrar"));

        // Verificar que aparezca el mensaje de error
        expect(await screen.findByText("Error al registrar médico.")).toBeInTheDocument();
    });

    it("debe enviar el formulario correctamente", async () => {
        // Simular una respuesta exitosa de la API
        axios.post.mockResolvedValueOnce({
            data: { mensaje: "Registro exitoso." },
        });

        render(<RegistrarMedico />);

        // Rellenar los campos del formulario
        fireEvent.change(screen.getByPlaceholderText("Nombre"), {
            target: { value: "Andrés Tapia" },
        });
        fireEvent.change(screen.getByPlaceholderText("Especialidad"), {
            target: { value: "Oftalmólogo" },
        });
        fireEvent.change(screen.getByPlaceholderText("Cédula Profesional"), {
            target: { value: "123456789" },
        });
        fireEvent.change(screen.getByPlaceholderText("Correo"), {
            target: { value: "andres.tapia@medico.com" },
        });
        fireEvent.change(screen.getByPlaceholderText("Teléfono"), {
            target: { value: "3216549871" },
        });

        // Enviar el formulario
        fireEvent.click(screen.getByText("Registrar"));

        // Verificar que aparezca el mensaje de éxito
        expect(await screen.findByText("Registro exitoso.")).toBeInTheDocument();
    });

    it("debe mostrar un mensaje de error si la API falla", async () => {
        // Simular un error en la respuesta de la API
        axios.post.mockRejectedValueOnce({
            response: { data: { error: "Error al registrar médico." } },
        });

        render(<RegistrarMedico />);

        // Rellenar los campos del formulario
        fireEvent.change(screen.getByPlaceholderText("Nombre"), {
            target: { value: "Andrés Tapia" },
        });
        fireEvent.change(screen.getByPlaceholderText("Especialidad"), {
            target: { value: "Oftalmólogo" },
        });
        fireEvent.change(screen.getByPlaceholderText("Cédula Profesional"), {
            target: { value: "123456789" },
        });
        fireEvent.change(screen.getByPlaceholderText("Correo"), {
            target: { value: "andres.tapia@medico.com" },
        });
        fireEvent.change(screen.getByPlaceholderText("Teléfono"), {
            target: { value: "3216549871" },
        });

        // Enviar el formulario
        fireEvent.click(screen.getByText("Registrar"));

        // Verificar que aparezca el mensaje de error
        expect(await screen.findByText("Error al registrar médico.")).toBeInTheDocument();
    });

    it("debe mostrar un mensaje de error si la API devuelve un error de validación", async () => {
        // Simular un error de validación en la API
        axios.post.mockRejectedValueOnce({
            response: { data: { error: "El correo ya está registrado." } },
        });

        render(<RegistrarMedico />);

        // Rellenar los campos del formulario
        fireEvent.change(screen.getByPlaceholderText("Nombre"), {
            target: { value: "Andrés Tapia" },
        });
        fireEvent.change(screen.getByPlaceholderText("Especialidad"), {
            target: { value: "Oftalmólogo" },
        });
        fireEvent.change(screen.getByPlaceholderText("Cédula Profesional"), {
            target: { value: "123456789" },
        });
        fireEvent.change(screen.getByPlaceholderText("Correo"), {
            target: { value: "andres.tapia@medico.com" },
        });
        fireEvent.change(screen.getByPlaceholderText("Teléfono"), {
            target: { value: "3216549871" },
        });

        // Enviar el formulario
        fireEvent.click(screen.getByText("Registrar"));

        // Verificar que aparezca el mensaje de error específico
        expect(await screen.findByText("El correo ya está registrado.")).toBeInTheDocument();
    });
});