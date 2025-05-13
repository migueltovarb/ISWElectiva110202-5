import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { vi } from "vitest";
import CrearMedico from "./CrearMedico";

vi.mock("axios");

describe("CrearMedico Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("renders the form with all fields and submit button", () => {
        render(<CrearMedico />);

        expect(screen.getByPlaceholderText("Nombre")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Especialidad")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Cédula Profesional")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Correo")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Teléfono")).toBeInTheDocument();
        expect(screen.getByText("Registrar")).toBeInTheDocument();
    });

    test("shows error if terms are not accepted", async () => {
        render(<CrearMedico />);

        fireEvent.change(screen.getByPlaceholderText("Nombre"), {
            target: { value: "Andres Tapia" },
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

        fireEvent.click(screen.getByText("Registrar"));

        await waitFor(() => {
            expect(screen.getByText("Debes aceptar los términos y condiciones.")).toBeInTheDocument();
        });
    });

    test("submits the form successfully", async () => {
        axios.post.mockResolvedValueOnce({
            data: { mensaje: "Registro exitoso." },
        });

        render(<CrearMedico />);

        fireEvent.change(screen.getByPlaceholderText("Nombre"), {
            target: { value: "Andres Tapia" },
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

        fireEvent.click(screen.getByLabelText("Acepto los términos y condiciones"));
        fireEvent.click(screen.getByText("Registrar"));

        await waitFor(() => {
            expect(screen.getByText("Registro exitoso.")).toBeInTheDocument();
        });
    });

    test("shows error if API call fails", async () => {
        axios.post.mockRejectedValueOnce({
            response: {
                data: {
                    error: "Error al registrar médico."
                }
            }
        });

        render(<CrearMedico />);

        fireEvent.change(screen.getByPlaceholderText("Nombre"), {
            target: { value: "Andres Tapia" },
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

        fireEvent.click(screen.getByLabelText("Acepto los términos y condiciones"));
        fireEvent.click(screen.getByText("Registrar"));

        await waitFor(() => {
            expect(screen.getByText("Error al registrar médico.")).toBeInTheDocument();
        });
    });

    test("shows validation error for empty fields", async () => {
        render(<CrearMedico />);

        fireEvent.click(screen.getByText("Registrar"));

        await waitFor(() => {
            // Aseguramos que se muestre el mensaje de error por campos vacíos
            expect(screen.getByText("Todos los campos son obligatorios.")).toBeInTheDocument();
        });
    });

    test("does not call API if form is invalid", async () => {
        render(<CrearMedico />);

        fireEvent.change(screen.getByPlaceholderText("Nombre"), {
            target: { value: "" },
        });

        fireEvent.click(screen.getByText("Registrar"));

        await waitFor(() => {
            expect(axios.post).not.toHaveBeenCalled();
        });
    });
});