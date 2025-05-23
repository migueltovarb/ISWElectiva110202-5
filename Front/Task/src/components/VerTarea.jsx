import { useEffect, useState } from "react";
import axios from "axios";

export default function VerTarea({ tareaId, onVolver, onActualizar }) {
  const [tarea, setTarea] = useState(null);
  const [cargando, setCargando] = useState(true);

  const obtenerTarea = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/tasks/${tareaId}/`);
      setTarea(res.data);
    } catch (error) {
      console.error("Error al obtener tarea", error);
    } finally {
      setCargando(false);
    }
  };

  const eliminarTarea = async () => {
    const confirmar = window.confirm("¿Estás seguro que deseas eliminar esta tarea?");
    if (!confirmar) return;

    try {
      await axios.delete(`http://localhost:8000/api/tasks/${tareaId}/`);
      onActualizar();    // refresca la lista
      onVolver();        // vuelve al listado
    } catch (error) {
      console.error("Error al eliminar la tarea", error);
    }
  };

  useEffect(() => {
    obtenerTarea();
  }, [tareaId]);

  if (cargando) return <p>Cargando tarea...</p>;
  if (!tarea) return <p>No se encontró la tarea.</p>;

  return (
    <div className="border p-4 rounded shadow-md">
      <h2 className="text-xl font-bold mb-2">Detalles de la Tarea</h2>
      <p><strong>ID:</strong> {tarea.id}</p>
      <p><strong>Título:</strong> {tarea.title}</p>
      {/* Agrega más campos aquí si tu modelo tiene más información */}

      <div className="mt-4 flex gap-2">
        <button
          onClick={eliminarTarea}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Eliminar
        </button>
        <button
          onClick={onVolver}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Volver
        </button>
      </div>
    </div>
  );
}
