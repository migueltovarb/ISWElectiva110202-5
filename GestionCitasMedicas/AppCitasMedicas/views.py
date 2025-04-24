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
import random
import string
from django.utils.decorators import method_decorator
from django.contrib.auth.views import PasswordResetConfirmView
from django.contrib.auth.forms import SetPasswordForm
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from AppCitasMedicas.models import Medico
from rest_framework.authtoken.models import Token


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


@csrf_exempt
def registrar_medico(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        nombre = data.get('nombre')
        especialidad = data.get('especialidad')
        cedula = data.get('cedula')
        email = data.get('email')
        telefono = data.get('telefono')

        if not all([nombre, especialidad, cedula, email, telefono]):
            return JsonResponse({'error': 'Todos los campos son obligatorios'}, status=400)

        if User.objects.filter(email=email).exists():
            return JsonResponse({'error': 'El correo ya esta registrado'}, status=400)

        from .models import Medico
        if Medico.objects.filter(cedula_profesional=cedula).exists():
            return JsonResponse({'error': 'La cédula profesional ya está registrada'}, status=400)

        password_generada = ''.join(random.choices(string.ascii_letters + string.digits, k=10))
        user = User.objects.create_user(username=email, email=email, password=password_generada, first_name=nombre)
        user.is_active = True
        user.save()

        medico = Medico.objects.create(
            user=user,
            especialidad=especialidad,
            cedula_profesional=cedula,
            telefono=telefono
        )

        mensaje = f"Hola Dr. {nombre},\n\nHa sido registrado en la plataforma.\n\nCorreo: {email}\nContraseña: {password_generada}"
        send_mail('Registro en la plataforma', mensaje, settings.DEFAULT_FROM_EMAIL, [email])

        return JsonResponse({'mensaje': 'Médico registrado correctamente. Se han enviado sus credenciales al correo electrónico.'})
    
    return JsonResponse({'error': 'Método no permitido'}, status=405)

class LoginMedicoView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'Correo o contraseña incorrectos'}, status=status.HTTP_401_UNAUTHORIZED)

        user = authenticate(username=user.username, password=password)

        if user is not None:
            try:
                medico = Medico.objects.get(user=user)
            except Medico.DoesNotExist:
                return Response({'error': 'Este usuario no está registrado como médico'}, status=status.HTTP_403_FORBIDDEN)

            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'medico': {
                    'nombre': medico.nombre_completo,
                    'especialidad': medico.especialidad,
                    'email': user.email
                }
            })
        else:
            return Response({'error': 'Correo o contraseña incorrectos'}, status=status.HTTP_401_UNAUTHORIZED)

@csrf_exempt
def login_paciente(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Formato JSON inválido'}, status=400)

        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return JsonResponse({'error': 'Email y contraseña son obligatorios'}, status=400)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return JsonResponse({'error': 'Usuario no encontrado'}, status=404)

        if not user.check_password(password):
            return JsonResponse({'error': 'Contraseña incorrecta'}, status=400)

        if not user.is_active:
            return JsonResponse({'error': 'La cuenta no está activada. Revisa tu correo.'}, status=403)

        return JsonResponse({'mensaje': 'Inicio de sesión exitoso'}, status=200)

    return JsonResponse({'error': 'Método no permitido'}, status=405)

@method_decorator(csrf_exempt, name='dispatch')
class CustomPasswordResetConfirmView(PasswordResetConfirmView):
    form_class = SetPasswordForm
    success_url = '/api/restablecer/hecho/'

    def form_valid(self, form):
        form.save()
        return JsonResponse({'mensaje': 'La contraseña ha sido restablecida exitosamente.'}, status=200)

    def form_invalid(self, form):
        return JsonResponse({'error': 'La contraseña no cumple los requisitos.'}, status=400)


