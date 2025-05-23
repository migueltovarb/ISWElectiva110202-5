import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function VerTarea({ Id: tareaIdProp, onVolver, onActualizar }) {
  const params = useParams();
  const Id = tareaIdProp || params.id;

  const [tarea, setTarea] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    console.log("tareaId usado:", Id); 
    if (!Id) {
      setCargando(false);
      setTarea(null);
      return;
    }
    const obtenerTarea = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/tasks/${Id}/`);
        setTarea(res.data);
      } catch (error) {
        console.error("Error al obtener tarea", error.response ? error.response.data : error);
        setTarea(null);
      } finally {
        setCargando(false);
      }
    };
    obtenerTarea();
  }, [Id]);

  const eliminarTarea = async () => {
    const confirmar = window.confirm("¿Estás seguro que deseas eliminar esta tarea?");
    if (!confirmar) return;
    try {
      await axios.delete(`http://localhost:8000/api/tasks/${Id}/`);
      onActualizar && onActualizar();
      onVolver && onVolver();
    } catch (error) {
      console.error("Error al eliminar la tarea", error);
    }
  };

  if (cargando) return <div className="text-center py-8">Cargando tarea...</div>;
  if (!tarea) return <div className="text-center py-8 text-red-600">No se encontró la tarea.</div>;

  return (
    <div className="border p-6 rounded-xl shadow-lg bg-white max-w-lg mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4 text-green-700">Detalles de la Tarea</h2>
      <div className="mb-2">
        <span className="font-semibold text-gray-700">ID:</span> {tarea.id}
      </div>
      <div className="mb-2">
        <span className="font-semibold text-gray-700">Título:</span> {tarea.title}
      </div>
      <div className="mb-2">
        <span className="font-semibold text-gray-700">Descripción:</span> {tarea.description}
      </div>
      <div className="mb-2">
        <span className="font-semibold text-gray-700">Fecha de vencimiento:</span>{" "}
        {tarea.due_date ? new Date(tarea.due_date).toLocaleString() : "No definida"}
      </div>
      <div className="mb-4">
        <span className="font-semibold text-gray-700">Creada el:</span>{" "}
        {tarea.created_at ? new Date(tarea.created_at).toLocaleString() : "No definida"}
      </div>
      <div className="flex gap-3 mt-6">
        <button
          onClick={eliminarTarea}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Eliminar
        </button>
        <button
          onClick={onVolver}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
        >
          Volver
        </button>
      </div>
    </div>
  );
}