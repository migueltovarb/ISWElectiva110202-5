import { useState } from "react";
import axios from "axios";

export default function CrearTarea() {
    const [titulo, setTitulo] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const nuevaTarea = {
                title: titulo,
            };

            await axios.post("http://localhost:8000/tareas", nuevaTarea);
            setTitulo("");
            onTareaCreada();
        } catch (error) {
            console.error("Error al crear la tarea:", error);
        }
    };

    return (
        <from onSubmit={handleSubmit} className="mb-4">
            <input
                type="text"
                placeholder="Nueva tarea"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="border p-2 mr-2"
                required
            />
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                Crear tarea
            </button>
        </from>
    )

}