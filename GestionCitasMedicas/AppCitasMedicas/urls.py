from django.urls import path
from . import views  
from .views import registrar_medico
from .password_reset_views import CustomPasswordResetView, CustomPasswordResetConfirmView
from django.contrib.auth import views as auth_views
from django.urls import path
from .password_reset_views import CustomPasswordResetView, CustomPasswordResetConfirmView, CustomPasswordResetDoneView, CustomPasswordResetCompleteView
from .views import LoginMedicoView
from .views import LoginPacienteView

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
]