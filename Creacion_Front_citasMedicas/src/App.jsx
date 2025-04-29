import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistrarPaciente from './components/CrearUsuario';
import RegistrarMedico from './components/CrearMedico';
import AgendarCita from './components/AgendarCita';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 p-4">
        <h1 className="text-3xl font-bold text-center mt-4">Plataforma Citas Médica</h1>
        <nav className="flex justify-center space-x-4 mt-4">
          <button
            onClick={() => (window.location.href = "/registrar-paciente")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
          >
            Registrar Paciente
          </button>
          <button
            onClick={() => (window.location.href = "/registrar-medico")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
          >
            Registrar Médico
          </button>
          <button
            onClick={() => (window.location.href = "/agendar-cita")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
          >
            Agendar Cita
          </button>
        </nav>
        <Routes>
          <Route path="/registrar-paciente" element={<RegistrarPaciente />} />
          <Route path="/registrar-medico" element={<RegistrarMedico />} />
          <Route path="/agendar-cita" element={<AgendarCita />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;









