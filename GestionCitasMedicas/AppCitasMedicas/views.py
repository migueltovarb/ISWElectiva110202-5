
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import re
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.urls import reverse
from django.core.mail import send_mail
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate

@csrf_exempt
def registro_paciente(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        print("Datos recibidos desde Postman:", data)
        nombre_completo = data.get('nombre_completo')
        email = data.get('email')
        telefono = data.get('telefono')
        password = data.get('password')

        if not nombre_completo or not email or not telefono or not password:
            return JsonResponse({'error': 'Todos los campos son obligatorios'}, status=400)

        if User.objects.filter(email=email).exists():
            return JsonResponse({'error': 'El correo ya está registrado'}, status=400)

        if len(password) < 8 or not re.search(r'[A-Za-z]', password) or not re.search(r'\d', password):
            return JsonResponse({'error': 'La contraseña debe tener al menos 8 caracteres, incluyendo letras y números'}, status=400)

        user = User.objects.create_user(username=email, email=email, password=password, first_name=nombre_completo)
        user.is_active = False  
        user.save()

        token = generador_token.make_token(user)
        uid = user.pk
        ruta = reverse('activar_cuenta', kwargs={'uid': uid, 'token': token})
        enlace_activacion = f"http://127.0.0.1:8000{ruta}"  

        asunto = 'Activa tu cuenta'
        mensaje = f'Hola {nombre_completo},\n\nGracias por registrarte. Activa tu cuenta dando clic en el siguiente enlace:\n\n{enlace_activacion}'
        send_mail(asunto, mensaje, settings.DEFAULT_FROM_EMAIL, [email])

        # (Aquí más adelante agregaremos el envío de correo de confirmación)

        return JsonResponse({'mensaje': 'Usuario registrado correctamente. Por favor, revisa tu correo para activar la cuenta.'})

    return JsonResponse({'error': 'Método no permitido'}, status=405)


class TokenDeActivacion(PasswordResetTokenGenerator):
    pass

generador_token = TokenDeActivacion()


def activar_cuenta(request, uid, token):
    User = get_user_model()
    user = get_object_or_404(User, pk=uid)

    if generador_token.check_token(user, token):
        user.is_active = True
        user.save()
        return JsonResponse({'mensaje': 'Cuenta activada exitosamente. Ya puedes iniciar sesión.'})
    else:
        return JsonResponse({'error': 'Token inválido o expirado'}, status=400)


