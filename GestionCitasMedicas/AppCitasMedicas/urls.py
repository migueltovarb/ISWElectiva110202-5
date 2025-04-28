from django.urls import path
from . import views  
from .views import registrar_medico
from .password_reset_views import CustomPasswordResetView, CustomPasswordResetConfirmView
from django.contrib.auth import views as auth_views
from django.urls import path
from .password_reset_views import CustomPasswordResetView, CustomPasswordResetConfirmView, CustomPasswordResetDoneView, CustomPasswordResetCompleteView
from .views import LoginMedicoView
from .views import LoginPacienteView
from .views import ListaPacientesView
from .views import MedicosPorEspecialidad
from .views import AgendarCitaView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    path('registro-paciente/', views.registro_paciente, name='registro_paciente'),
    path('activar-cuenta/<int:uid>/<str:token>/', views.activar_cuenta, name='activar_cuenta'),
    path('registro-medico/', registrar_medico, name='registro_medico'),
    path('api/login-paciente/', LoginPacienteView.as_view(), name='login-paciente'),
    path('password_reset/', CustomPasswordResetView.as_view(), name='password_reset'),
    path('password_reset/done/', CustomPasswordResetDoneView.as_view(), name='password_reset_done'),
    path('reset/<uidb64>/<token>/', CustomPasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('reset/done/', CustomPasswordResetCompleteView.as_view(), name='password_reset_complete'),
    path('medico/login/', LoginMedicoView.as_view(), name='login-medico'),
    path('api/lista-pacientes/', ListaPacientesView.as_view(), name='lista-pacientes'),
    path('especialidades/', views.listar_especialidades, name='listar_especialidades'),
    path('medicos/', MedicosPorEspecialidad.as_view(), name='medicos_por_especialidad'),
    path('agendar_cita/', AgendarCitaView.as_view(), name='agendar_cita'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

]