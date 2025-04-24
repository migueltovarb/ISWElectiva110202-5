from django.urls import path
from . import views  
from .views import registrar_medico

urlpatterns = [
    path('registro-paciente/', views.registro_paciente, name='registro_paciente'),
    path('activar-cuenta/<int:uid>/<str:token>/', views.activar_cuenta, name='activar_cuenta'),
    path('registro-medico/', registrar_medico, name='registro_medico'),
    path('login-paciente/', views.login_paciente, name='login_paciente'),
]

