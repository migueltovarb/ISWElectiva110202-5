// src/App.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import CrearTarea from "./components/CrearTarea";
import ListaTarea from "./components/ListaTarea"; // si ya tienes este componente

function App() {
  const [tareas, setTareas] = useState([]);

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
      <CrearTarea onTareaCreada={obtenerTareas} />
      <ListaTarea tareas={tareas} onActualizar={obtenerTareas} />
    </div>
  );
}

export default App;
