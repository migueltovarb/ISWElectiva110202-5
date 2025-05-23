import { useState } from "react";
import axios from "axios";

function ListaTareas({ tareas, onActualizar, onSeleccionarTarea }) {
  const eliminarTarea = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/tasks/${id}/`);
      onActualizar(); 
    } catch (error) {
      console.error("Error al eliminar tarea", error);
    }
  };

  return (
    <ul>
      {tareas.length === 0 ? (
        <li className="text-center text-gray-500">No hay tareas registradas</li>
      ) : (
        tareas.map((tarea) => (
          <li
            key={tarea.id}
            className="border-b py-2 flex justify-between items-center"
          >
            <span>{tarea.title}</span>
            <div className="flex gap-2">
              <button
                onClick={() => onSeleccionarTarea(tarea)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Editar
              </button>
              <button
                onClick={() => eliminarTarea(tarea.id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))
      )}
    </ul>
  );
}

export default ListaTareas;

