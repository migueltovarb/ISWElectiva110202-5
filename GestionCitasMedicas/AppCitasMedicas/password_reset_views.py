# AppCitasMedicas/password_reset_views.py
from django.contrib.auth.views import PasswordResetView, PasswordResetConfirmView, PasswordResetDoneView, PasswordResetCompleteView
from django.urls import reverse_lazy
from django.utils.translation import gettext_lazy as _

# Vista personalizada para la solicitud de restablecimiento de contraseña
class CustomPasswordResetView(PasswordResetView):
    template_name = 'registration/password_reset_form.html'  # Ruta a la plantilla
    email_template_name = 'registration/password_reset_email.html'  # Ruta a la plantilla del correo
    subject_template_name = 'registration/password_reset_subject.txt'  # Ruta a la plantilla del asunto del correo
    success_url = reverse_lazy('password_reset_done')  # Redirige después de enviar el correo

# Vista personalizada para la vista de confirmación de restablecimiento de contraseña
class CustomPasswordResetConfirmView(PasswordResetConfirmView):
    template_name = 'registration/password_reset_confirm.html'  # Ruta a la plantilla de confirmación
    success_url = reverse_lazy('password_reset_complete')  # Redirige después de cambiar la contraseña

# Vista para cuando el restablecimiento de la contraseña es exitoso
class CustomPasswordResetDoneView(PasswordResetDoneView):
    template_name = 'registration/password_reset_done.html'  # Ruta a la plantilla de confirmación de que se envió el correo

# Vista cuando el restablecimiento de la contraseña está completo
class CustomPasswordResetCompleteView(PasswordResetCompleteView):
    template_name = 'registration/password_reset_complete.html'  # Ruta a la plantilla de éxito
