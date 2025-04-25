import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CrearUsuario from "./CrearUsuario";
import axios from "axios";

jest.mock("axios");

// luego usas directamente:
axios.post.mockResolvedValue({ data: { mensaje: "Registro exitoso" } });
describe("CrearUsuario", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("renderiza todos los campos correctamente", () => {
    render(<CrearUsuario />);
    expect(screen.getByPlaceholderText(/nombre completo/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/número de teléfono/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/contraseña/i)).toBeInTheDocument();
  });

  test("muestra error si no se aceptan los términos", async () => {
    render(<CrearUsuario />);
    fireEvent.change(screen.getByPlaceholderText(/nombre completo/i), { target: { value: "Juan Pérez" } });
    fireEvent.change(screen.getByPlaceholderText(/correo electrónico/i), { target: { value: "juan@mail.com" } });
    fireEvent.change(screen.getByPlaceholderText(/número de teléfono/i), { target: { value: "1234567890" } });
    fireEvent.change(screen.getByPlaceholderText(/contraseña/i), { target: { value: "secreta123" } });

    fireEvent.click(screen.getByRole("button", { name: /registrarme/i }));

    expect(await screen.findByText(/debes aceptar los términos/i)).toBeInTheDocument();
  });

  test("envía el formulario correctamente si todo está bien", async () => {
    axios.post.mockResolvedValue({ data: { mensaje: "Registro exitoso." } });

    render(<CrearUsuario />);
    fireEvent.change(screen.getByPlaceholderText(/nombre completo/i), { target: { value: "Ana Gómez" } });
    fireEvent.change(screen.getByPlaceholderText(/correo electrónico/i), { target: { value: "ana@mail.com" } });
    fireEvent.change(screen.getByPlaceholderText(/número de teléfono/i), { target: { value: "987654321" } });
    fireEvent.change(screen.getByPlaceholderText(/contraseña/i), { target: { value: "claveSegura" } });
    fireEvent.click(screen.getByRole("checkbox"));

    fireEvent.click(screen.getByRole("button", { name: /registrarme/i }));

    await waitFor(() =>
      expect(screen.getByText(/registro exitoso/i)).toBeInTheDocument()
    );
  });

  test("muestra error si axios responde con error", async () => {
    axios.post.mockRejectedValue({
      response: { data: { error: "Email ya registrado" } },
    });

    render(<CrearUsuario />);
    fireEvent.change(screen.getByPlaceholderText(/nombre completo/i), { target: { value: "Pedro López" } });
    fireEvent.change(screen.getByPlaceholderText(/correo electrónico/i), { target: { value: "pedro@mail.com" } });
    fireEvent.change(screen.getByPlaceholderText(/número de teléfono/i), { target: { value: "111222333" } });
    fireEvent.change(screen.getByPlaceholderText(/contraseña/i), { target: { value: "contraseña123" } });
    fireEvent.click(screen.getByRole("checkbox"));

    fireEvent.click(screen.getByRole("button", { name: /registrarme/i }));

    expect(await screen.findByText(/email ya registrado/i)).toBeInTheDocument();
  });

});
  
