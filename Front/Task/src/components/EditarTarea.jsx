import { useState, useEffect } from "react";
import axios from "axios";

export default function EditarTarea({ tareaSeleccionada, onActualizar, onCancelarEdicion }) {
    const [titulo, setTitulo] = useState("");

    useEffect(() => {
    if (tareaSeleccionada) {
        setTitulo(tareaSeleccionada.title);
    }
    }, [tareaSeleccionada]);

    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        await axios.put(
        `http://localhost:8000/api/tasks/${tareaSeleccionada.id}/`,
        { title: titulo }
        );
        setTitulo("");
        onActualizar();
      onCancelarEdicion(); // limpia la tarea seleccionada
    } catch (error) {
        console.error("Error al editar la tarea", error);
    }
    };

    if (!tareaSeleccionada) return null; 

    return (
    <form onSubmit={handleSubmit} className="mb-4">
        <input
        type="text"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        className="border p-2 mr-2"
        required
        />
        <button type="submit" className="bg-yellow-500 text-white px-4 py-2 rounded">
        Guardar
        </button>
        <button
        type="button"
        onClick={onCancelarEdicion}
        className="bg-gray-400 text-white px-4 py-2 ml-2 rounded"
        >
        Cancelar
        </button>
    </form>
    );
}
