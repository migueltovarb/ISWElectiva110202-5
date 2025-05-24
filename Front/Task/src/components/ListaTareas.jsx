import axios from "axios";

function ListaTareas({ tareas, onActualizar, onSeleccionarTarea, onVerTarea }) {
  const eliminarTarea = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/tasks/${id}/`);
      onActualizar();
    } catch (error) {
      console.error("Error al eliminar tarea", error);
    }
  };

  if (!tareas.length) {
    return (
      <div className="text-center text-gray-500 mt-8">
        No hay tareas registradas.
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-8">
      {tareas.map((tarea) => (
        <div
          key={tarea.id}
          className="bg-white shadow-md rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between hover:shadow-lg transition-shadow"
        >
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{tarea.title}</h3>
            <p className="text-gray-600">{tarea.description}</p>
          </div>
          <div className="flex mt-4 md:mt-0 md:ml-4 space-x-2">
            <button
              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded transition"
              onClick={() => onVerTarea(tarea)}
            >
              Ver
            </button>
            <button
              className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded transition"
              onClick={() => onSeleccionarTarea(tarea)}
            >
              Editar
            </button>
            <button
              className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded transition"
              onClick={() => {
                if (window.confirm("¿Seguro que deseas eliminar esta tarea?")) {
                  eliminarTarea(tarea.id);
                }
              }}
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ListaTareas;

