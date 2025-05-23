import { useEffect, useState } from "react";
import axios from "axios";
import CrearTarea from "./components/CrearTarea";
import EditarTarea from "./components/EditarTarea";
import ListaTareas from "./components/ListaTareas";
import VerTarea from "./components/VerTarea";

function App() {
  const [tareas, setTareas] = useState([]);
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);
  const [tareaAVer, setTareaAVer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const obtenerTareas = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("http://localhost:8000/api/tasks/");
      setTareas(res.data);
    } catch (err) {
      setError("Error al obtener tareas");
    }
    setLoading(false);
  };

  useEffect(() => {
    obtenerTareas();
  }, []);

  // Feedback visual para acciones exitosas
  const mostrarMensaje = (msg) => {
    setMensaje(msg);
    setTimeout(() => setMensaje(""), 2500);
  };

  // Feedback visual para errores
  const mostrarError = (msg) => {
    setError(msg);
    setTimeout(() => setError(""), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100 py-10">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-green-700 drop-shadow">
          Gestor de Tareas
        </h1>

        {/* Mensajes de feedback */}
        {mensaje && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded text-center font-semibold shadow">
            {mensaje}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded text-center font-semibold shadow">
            {error}
          </div>
        )}

        {/* Loader */}
        {loading && (
          <div className="flex justify-center my-8">
            <div className="w-8 h-8 border-4 border-green-500 border-dashed rounded-full animate-spin"></div>
          </div>
        )}

        {/* Vista de tarea */}
        {tareaAVer && (
          <VerTarea
            tarea={tareaAVer}
            onCerrar={() => setTareaAVer(null)}
          />
        )}

        {/* Crear o editar tarea */}
        {!tareaAVer && (
          <>
            {tareaSeleccionada ? (
              <EditarTarea
                tareaSeleccionada={tareaSeleccionada}
                onActualizar={() => {
                  obtenerTareas();
                  setTareaSeleccionada(null);
                  mostrarMensaje("Tarea actualizada correctamente");
                }}
                onCancelarEdicion={() => setTareaSeleccionada(null)}
                mostrarError={mostrarError}
              />
            ) : (
              <CrearTarea
                onTareaCreada={() => {
                  obtenerTareas();
                  mostrarMensaje("Tarea creada correctamente");
                }}
                mostrarError={mostrarError}
              />
            )}

            <ListaTareas
              tareas={tareas}
              onActualizar={() => {
                obtenerTareas();
                mostrarMensaje("Tarea eliminada correctamente");
              }}
              onSeleccionarTarea={setTareaSeleccionada}
              onVerTarea={setTareaAVer}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
