import AgendarCita from './components/AgendarCita';
import RegistrarMedico from './components/CrearMedico';
import RegistrarPaciente from './components/CrearUsuario';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mt-4">Plataforma Médica</h1>
      <RegistrarPaciente />
      <RegistrarMedico />
    </div>
  );
}

const App = () => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('auth_token'));

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setAuthToken={setAuthToken} />} />
        <Route path="/crear-medico" element={<CrearMedicos />} />
        <Route
          path="/agendar-cita"
          element={<ProtectedRoute authToken={authToken} component={<AgendarCita />} />}
        />
        {/* Puedes agregar más rutas protegidas o públicas */}
      </Routes>
    </Router>
  );
};

export default App;







