from django.urls import path
from . import views  
from .views import registrar_medico
from .password_reset_views import CustomPasswordResetView, CustomPasswordResetConfirmView
from django.contrib.auth import views as auth_views
from django.urls import path
from .password_reset_views import CustomPasswordResetView, CustomPasswordResetConfirmView, CustomPasswordResetDoneView, CustomPasswordResetCompleteView
from .views import LoginMedicoView

urlpatterns = [
    path('registro-paciente/', views.registro_paciente, name='registro_paciente'),
    path('activar-cuenta/<int:uid>/<str:token>/', views.activar_cuenta, name='activar_cuenta'),
    path('registro-medico/', registrar_medico, name='registro_medico'),
]