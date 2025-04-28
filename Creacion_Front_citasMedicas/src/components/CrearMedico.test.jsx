import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { vi } from "vitest";
import CrearMedico from "./CrearMedico";

vi.mock("axios");

describe("CrearMedico Component", () => {
beforeEach(() => {
    vi.clearAllMocks();
});

test("renders the form with all fields and submit button", async () => {
    render(<CrearMedico />);

    await waitFor(() => screen.getByPlaceholderText('Nombre'));

    expect(screen.getByPlaceholderText("nombre")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("especialidad")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("cedula")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("telefono")).toBeInTheDocument();
    expect(screen.getByText("Registrarme")).toBeInTheDocument();
});

test("shows error if terms are not accepted", async () => {
    render(<CrearMedico />);

    fireEvent.change(screen.getByPlaceholderText("nombre"), {
    target: { value: "andres tapia" },
    });
    fireEvent.change(screen.getByPlaceholderText("especialidad"), {
    target: { value: "oftalmologo" },
    });
    fireEvent.change(screen.getByPlaceholderText("cedula"), {
    target: { value: "123456789" },
    });
    fireEvent.change(screen.getByPlaceholderText("email"), {
    target: { value: "andres.tapia@medico.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("telefono"), {
        target: { value: "3216549871" },
        });

    fireEvent.click(screen.getByText("Registrarme"));

    expect(
    await screen.findByText("Debes aceptar los términos y condiciones.")
    ).toBeInTheDocument();
});

test("submits the form successfully", async () => {
    axios.post.mockResolvedValueOnce({
        data: { mensaje: "Registro exitoso." },
    });

    render(<CrearMedico />);

    fireEvent.change(screen.getByPlaceholderText("nombre"), {
        target: { value: "andres tapia" },
    });
    fireEvent.change(screen.getByPlaceholderText("especialidad"), {
        target: { value: "Oftalmologo" },
    });
    fireEvent.change(screen.getByPlaceholderText("cedula"), {
        target: { value: "123456789" },
    });
        fireEvent.change(screen.getByPlaceholderText("email"), {
        target: { value: "andres.tapia@medico.com" },
    });
        fireEvent.change(screen.getByPlaceholderText("telefono"), {
        target: { value: "3216549871" },
    });
        fireEvent.click(screen.getByRole("checkbox"));
        fireEvent.click(screen.getByText("Registrarme"));

    expect(await screen.findByText("Registro exitoso.")).toBeInTheDocument();
    });
});