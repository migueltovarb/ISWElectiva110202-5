import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Sidebar mejorado
const Sidebar = ({ userName, avatarUrl, currentSection, setSection }) => {
  const navigate = useNavigate();

  return (
    <aside className="h-full w-64 bg-white border-r flex flex-col justify-between py-6 px-4">
      <div>
        <h1 className="text-2xl font-bold mb-8 flex items-center gap-2 text-indigo-700">
          <span className="text-3xl">🩺</span> Cita Salud
        </h1>
        <nav className="flex flex-col gap-2">
          <button
            onClick={() => setSection('mis-citas')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold ${
              currentSection === 'mis-citas'
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-gray-600 hover:bg-indigo-50'
            }`}
          >
            <span>📅</span> My Appointments
          </button>
          <button
            onClick={() => setSection('agendar')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold ${
              currentSection === 'agendar'
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-gray-600 hover:bg-indigo-50'
            }`}
          >
            <span>📘</span> Booking Appointments
          </button>
          <button
            onClick={() => setSection('cancelar')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold ${
              currentSection === 'cancelar'
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-gray-600 hover:bg-indigo-50'
            }`}
          >
            <span>🚫</span> Cancel Appointments
          </button>
          <button
            onClick={() => setSection('configuracion')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold ${
              currentSection === 'configuracion'
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-gray-600 hover:bg-indigo-50'
            }`}
          >
            <span>⚙️</span> Config Profile
          </button>
        </nav>
      </div>
      <div>
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-indigo-50">
          <img src={avatarUrl} alt="avatar" className="w-10 h-10 rounded-full" />
          <div>
            <div className="font-semibold">{userName}</div>
            <div className="text-xs text-gray-500">View profile</div>
          </div>
          <span className="ml-auto text-green-500 text-xs">●</span>
        </div>
        <button
          onClick={() => navigate("/auth/login/")}
          className="w-full mt-3 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
};

// Header component
const Header = () => (
  <header className="h-16 flex items-center justify-between px-8 border-b bg-white">
    <nav className="flex gap-8">
      <span className="text-indigo-700 font-semibold border-b-2 border-indigo-700 pb-2">Home</span>
    </nav>
    <div className="flex items-center gap-4">
      <button className="text-gray-500 hover:text-indigo-700">
        <svg width="22" height="22" fill="none" stroke="currentColor"><circle cx="10" cy="10" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
      </button>
      <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="avatar" className="w-9 h-9 rounded-full" />
    </div>
  </header>
);

// Mis Citas
const MisCitas = ({ apiUrl = import.meta.env.VITE_API_URL }) => {
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({});
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line
  }, [apiUrl]);

  const fetchAppointments = async () => {
    setLoading(true);
    setMsg("");
    try {
      const token = localStorage.getItem('auth_token');
      const res = await axios.get(
        `${apiUrl}appointments/patient/appointments/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      // Soporta ambos formatos: { appointments: [...] } o array directo
      setAppointments(res.data.appointments || res.data.results || res.data || []);
      setStats(res.data.statistics || {});
    } catch (err) {
      setMsg("Error al cargar citas.");
    }
    setLoading(false);
  };

  const fetchDetail = async (id) => {
    setLoading(true);
    setMsg("");
    try {
      const token = localStorage.getItem('auth_token');
      const res = await axios.get(
        `${apiUrl}appointments/patient/appointments/${id}/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setDetail(res.data);
      setSelected(id);
    } catch (err) {
      setMsg("No se pudo cargar el detalle.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4 text-indigo-700">Mis Citas Agendadas</h2>
      {msg && <div className="text-red-500 mb-2">{msg}</div>}
      {loading && <div className="text-gray-500">Cargando...</div>}

      {/* Estadísticas */}
      {stats && stats.total_appointments !== undefined && (
        <div className="mb-4 p-4 bg-blue-50 rounded">
          <div>Total de citas: <b>{stats.total_appointments}</b></div>
          <div>Citas próximas: <b>{stats.upcoming_appointments}</b></div>
          {stats.next_appointment && (
            <div>
              Próxima cita: <b>{stats.next_appointment.appointment_date} {stats.next_appointment.appointment_time}</b>
            </div>
          )}
        </div>
      )}

      {/* Tabla de citas */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Fecha</th>
              <th className="p-2">Hora</th>
              <th className="p-2">Médico</th>
              <th className="p-2">Motivo</th>
              <th className="p-2">Estado</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {appointments.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-gray-400 p-4">
                  No tienes citas agendadas.
                </td>
              </tr>
            )}
            {appointments.map((apt) => (
              <tr key={apt.id} className={selected === apt.id ? "bg-blue-50" : ""}>
                <td className="p-2">{apt.appointment_date}</td>
                <td className="p-2">{apt.appointment_time}</td>
                <td className="p-2">{apt.doctor_info?.user?.full_name || apt.doctor_info?.user?.username || apt.doctor_name}</td>
                <td className="p-2">{apt.reason}</td>
                <td className="p-2">{apt.status}</td>
                <td className="p-2">
                  <button
                    className="text-indigo-600 hover:underline"
                    onClick={() => fetchDetail(apt.id)}
                  >
                    Ver detalle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detalle de cita */}
      {detail && (
        <div className="mt-8 p-4 bg-gray-50 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Detalle de la cita</h2>
          <div><b>Fecha:</b> {detail.appointment.appointment_date}</div>
          <div><b>Hora:</b> {detail.appointment.appointment_time}</div>
          <div><b>Médico:</b> {detail.appointment.doctor_info?.user?.full_name || detail.appointment.doctor_name}</div>
          <div><b>Motivo:</b> {detail.appointment.reason}</div>
          <div><b>Estado:</b> {detail.appointment.status}</div>
          <div className="mt-2">
            {detail.can_cancel ? (
              <span className="text-green-600 font-semibold">
                Puedes cancelar esta cita hasta {detail.cancellation_info.can_cancel_until} ({detail.cancellation_info.hours_remaining_to_cancel} horas restantes)
              </span>
            ) : (
              <span className="text-gray-500">
                {detail.cancellation_info?.cancellation_deadline_passed
                  ? "Ya no puedes cancelar esta cita."
                  : ""}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Cancelar Citas
const CancelarCitas = ({ apiUrl = import.meta.env.VITE_API_URL }) => {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [selected, setSelected] = useState(null);

  // Obtener todas las citas del paciente
  const fetchCitas = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(
        `${apiUrl}appointments/patient/appointments/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      // Soporta ambos formatos: { appointments: [...] } o array directo
      const data = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data.appointments)
          ? response.data.appointments
          : Array.isArray(response.data.results)
            ? response.data.results
            : [];
      setCitas(data);
    } catch (err) {
      setError('Error al cargar tus citas');
      setCitas([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCitas();
    // eslint-disable-next-line
  }, [apiUrl, mensaje]);

  // Cancelar cita usando la URL correcta con el ID
  const cancelarCita = async (id) => {
  setMensaje('');
  setError('');
  setSelected(id);
  try {
    const token = localStorage.getItem('auth_token');
    await axios.patch(
      `${apiUrl}appointments/patient/appointments/${id}/cancel/`,
      {}, // puedes enviar { reason: "Cancelada por el paciente" } si quieres
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    setMensaje('Cita cancelada correctamente.');
    fetchCitas(); // Refresca la lista tras cancelar
  } catch (err) {
    setError(
      err.response?.data?.error ||
      'No se pudo cancelar la cita.'
    );
  }
  setSelected(null);
};

  if (loading) return <div className="text-center py-8">Cargando citas...</div>;
  if (error) return <div className="text-center text-red-600 py-8">{error}</div>;
  if (citas.length === 0) return <div className="text-center py-8">No tienes citas para cancelar.</div>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4 text-indigo-700">Cancelar Citas</h2>
      {mensaje && <div className="mb-4 text-green-600">{mensaje}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Fecha</th>
              <th className="p-2">Hora</th>
              <th className="p-2">Médico</th>
              <th className="p-2">Motivo</th>
              <th className="p-2">Estado</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {citas.filter(cita => cita.status !== 'Cancelada').length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-gray-400 p-4">
                  No tienes citas activas para cancelar.
                </td>
              </tr>
            )}
            {citas
              .filter((cita) => cita.status !== 'Cancelada')
              .map((cita) => (
                <tr key={cita.id} className={selected === cita.id ? "bg-red-50" : ""}>
                  <td className="p-2">{cita.appointment_date}</td>
                  <td className="p-2">{cita.appointment_time}</td>
                  <td className="p-2">{cita.doctor_info?.user?.full_name || cita.doctor_info?.user?.username || cita.doctor_name}</td>
                  <td className="p-2">{cita.reason}</td>
                  <td className="p-2">{cita.status}</td>
                  <td className="p-2">
                    <button
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                      onClick={() => cancelarCita(cita.id)}
                      disabled={selected === cita.id}
                    >
                      {selected === cita.id ? 'Cancelando...' : 'Cancelar'}
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Configuración
const Configuracion = ({ apiUrl = import.meta.env.VITE_API_URL }) => {
  const [profile, setProfile] = useState({
    full_name: localStorage.getItem('user_full_name') || '',
    email: localStorage.getItem('user_email') || '',
    phone: localStorage.getItem('user_phone') || '',
    address: '',
  });
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const formData = new FormData();
      formData.append('full_name', profile.full_name);
      formData.append('email', profile.email);
      formData.append('phone', profile.phone);
      formData.append('address', profile.address);

      const token = localStorage.getItem('auth_token');
      const response = await axios.put(
        `${apiUrl}auth/profile/update/`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setSuccessMsg('Perfil actualizado correctamente');
      // Actualizar localStorage con los nuevos datos
      localStorage.setItem('user_full_name', profile.full_name);
      localStorage.setItem('user_email', profile.email);
      localStorage.setItem('user_phone', profile.phone);
    } catch (err) {
      setErrorMsg('Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold mb-4 text-center">Gestión de Perfil</h2>
      <form onSubmit={handleProfileSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Nombre</label>
          <input
            name="full_name"
            value={profile.full_name}
            onChange={handleProfileChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Ingresa tu nombre"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            name="email"
            value={profile.email}
            onChange={handleProfileChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Ingresa tu email"
          />
          <span className="text-xs text-gray-500">Enviaremos una verificación a su correo</span>
        </div>
        <div>
          <label className="block font-medium mb-1">Celular</label>
          <input
            name="phone"
            value={profile.phone}
            onChange={handleProfileChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Ingresa tu celular"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Dirección</label>
          <input
            name="address"
            value={profile.address}
            onChange={handleProfileChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Ingresa tu dirección"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded mt-2"
          disabled={loading}
        >
          {loading ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>

      {successMsg && (
        <div className="text-center text-indigo-700 mt-8 font-semibold">
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="text-center text-red-600 mt-4">{errorMsg}</div>
      )}
    </div>
  );
};