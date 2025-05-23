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

  const obtenerTareas = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/tasks/");
      setTareas(res.data);
    } catch (error) {
      console.error("Error al obtener tareas", error);
    }
  };

  useEffect(() => {
    obtenerTareas();
  }, []);

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center">Gestor de Tareas</h1>

      {tareaAVer && (
        <VerTarea
          tarea={tareaAVer}
          onCerrar={() => setTareaAVer(null)}
        />
      )}

      {!tareaAVer && (
        <>
          {tareaSeleccionada ? (
            <EditarTarea
              tareaSeleccionada={tareaSeleccionada}
              onActualizar={obtenerTareas}
              onCancelarEdicion={() => setTareaSeleccionada(null)}
            />
          ) : (
            <CrearTarea onTareaCreada={obtenerTareas} />
          )}

          <ListaTareas
            tareas={tareas}
            onActualizar={obtenerTareas}
            onSeleccionarTarea={setTareaSeleccionada}
            onVerTarea={setTareaAVer} 
          />
        </>
      )}
    </div>
  );
}

export default App;
