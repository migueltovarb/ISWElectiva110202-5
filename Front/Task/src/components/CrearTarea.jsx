import { useState } from "react";
import axios from "axios";

export default function CrearTarea({ onTareaCreada, mostrarError }) {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const nuevaTarea = {
        title: titulo,
        description: descripcion,
        due_date: dueDate,
      };

      await axios.post("http://localhost:8000/api/tasks/", nuevaTarea);
      setTitulo("");
      setDescripcion("");
      setDueDate("");
      if (onTareaCreada) onTareaCreada();
    } catch (error) {
      if (mostrarError) {
        mostrarError("Error al crear la tarea");
      } else {
        console.error("Error al crear la tarea:", error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 bg-gray-50 p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-green-700">Crear nueva tarea</h2>
      <div className="mb-3">
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
      </div>
      <div className="mb-3">
        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
      </div>
      <div className="mb-3">
        <input
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
      >
        Crear tarea
      </button>
    </form>
);
}