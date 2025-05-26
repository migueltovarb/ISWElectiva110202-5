import { render, screen, fireEvent } from "@testing-library/react";
import CrearUsuario from "./CrearUsuario";
import axios from "axios";
import { vi } from "vitest";

vi.mock("axios");

describe("CrearUsuario Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders the form with all fields and submit button", () => {
    render(<CrearUsuario />);

    expect(screen.getByPlaceholderText("Nombre completo")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Correo electrónico")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Número de teléfono")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Contraseña")).toBeInTheDocument();
    expect(screen.getByText("Registrarme")).toBeInTheDocument();
  });

  test("shows error if terms are not accepted", async () => {
    render(<CrearUsuario />);

    fireEvent.change(screen.getByPlaceholderText("Nombre completo"), {
      target: { value: "Juan Pérez" },
    });
    fireEvent.change(screen.getByPlaceholderText("Correo electrónico"), {
      target: { value: "juan@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Número de teléfono"), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByPlaceholderText("Contraseña"), {
      target: { value: "password123" },
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

    render(<CrearUsuario />);

    fireEvent.change(screen.getByPlaceholderText("Nombre completo"), {
      target: { value: "Juan Pérez" },
    });
    fireEvent.change(screen.getByPlaceholderText("Correo electrónico"), {
      target: { value: "juan@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Número de teléfono"), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByPlaceholderText("Contraseña"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByText("Registrarme"));

    expect(await screen.findByText("Registro exitoso.")).toBeInTheDocument();
  });
});