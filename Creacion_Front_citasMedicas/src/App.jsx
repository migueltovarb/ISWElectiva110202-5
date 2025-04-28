import RegistrarPaciente from './components/CrearUsuario';
import RegistrarMedico from './components/CrearMedico';
import AgendarCita from './components/AgendarCita';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mt-4">Plataforma Médica</h1>
      <RegistrarPaciente />
      <RegistrarMedico />
      <AgendarCita />
    </div>
  );
}

export default App;









