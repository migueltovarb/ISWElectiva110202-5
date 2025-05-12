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
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from AppCitasMedicas.models import Medico
from .serializers import RegistroPacienteSerializer
from .serializers import RegistroMedicoSerializer
from .models import Paciente
from .serializers import PacienteSerializer, UsuarioSerializer
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAdminUser
from rest_framework.decorators import api_view
from .models import Especialidad
from .models import Medico
from .serializers import MedicoSerializer
from .models import Cita
from rest_framework.permissions import IsAuthenticated


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


        paciente = Paciente.objects.create(
            user=user, 
            telefono=telefono
        )
        paciente.save()

        token = generador_token.make_token(user)
        uid = user.pk
        ruta = reverse('activar_cuenta', kwargs={'uid': uid, 'token': token})
        enlace_activacion = f"http://127.0.0.1:8000{ruta}"

        asunto = 'Activa tu cuenta'
        mensaje = f'Hola {nombre_completo},\n\nGracias por registrarte. Activa tu cuenta dando clic en el siguiente enlace:\n\n{enlace_activacion}'
        send_mail(asunto, mensaje, settings.DEFAULT_FROM_EMAIL, [email])

        return JsonResponse({'mensaje': 'Usuario registrado correctamente. Por favor, revisa tu correo para activar la cuenta.'})


class RegistroPacienteView(APIView):
    def post(self, request):
        serializer = RegistroPacienteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"mensaje": "Paciente registrado correctamente"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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

User = get_user_model()

class LoginPacienteView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({'error': 'Email y contraseña son obligatorios'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        if not user.check_password(password):
            return Response({'error': 'Contraseña incorrecta'}, status=status.HTTP_401_UNAUTHORIZED)

        if not user.is_active:
            return Response({'error': 'Cuenta no activada. Revisa tu correo.'}, status=status.HTTP_403_FORBIDDEN)

        try:
            paciente = Paciente.objects.get(user=user)
        except Paciente.DoesNotExist:
            return Response({'error': 'No existe paciente asociado a este usuario'}, status=status.HTTP_404_NOT_FOUND)

        token, created = Token.objects.get_or_create(user=user)

        return Response({
            'token': token.key,
            'usuario': UsuarioSerializer(user).data,
            'paciente': PacienteSerializer(paciente).data,
        })

@method_decorator(csrf_exempt, name='dispatch')
class CustomPasswordResetConfirmView(PasswordResetConfirmView):
    form_class = SetPasswordForm
    success_url = '/api/restablecer/hecho/'

    def form_valid(self, form):
        form.save()
        return JsonResponse({'mensaje': 'La contraseña ha sido restablecida exitosamente.'}, status=200)

    def form_invalid(self, form):
        return JsonResponse({'error': 'La contraseña no cumple los requisitos.'}, status=400)

class ListaPacientesView(APIView):
    def get(self, request):
        pacientes = Paciente.objects.all()
        print("Pacientes encontrados:", pacientes) 
        serializer = PacienteSerializer(pacientes, many=True)
        return Response(serializer.data)

@api_view(['GET'])
def listar_especialidades(request):
    especialidades = Especialidad.objects.all()
    data = [{'id': esp.id, 'nombre': esp.nombre} for esp in especialidades]
    return Response(data)

class MedicosPorEspecialidad(APIView):
    def get(self, request, *args, **kwargs):
        especialidad_id = request.query_params.get('especialidad', None)
        
        if especialidad_id is not None:
            try:
                especialidad = Especialidad.objects.get(id=especialidad_id)
                medicos = Medico.objects.filter(especialidad=especialidad)
                serializer = MedicoSerializer(medicos, many=True)
                return Response(serializer.data)
            except Especialidad.DoesNotExist:
                return Response({"error": "Especialidad no encontrada"}, status=status.HTTP_404_NOT_FOUND)
        
        medicos = Medico.objects.all()
        serializer = MedicoSerializer(medicos, many=True)
        return Response(serializer.data)


class AgendarCitaView(APIView):
    permission_classes = [IsAuthenticated]  

    def post(self, request):
        paciente = request.user 
        medico_id = request.data.get('medico')
        fecha = request.data.get('fecha')
        hora = request.data.get('hora')

        try:
            medico = Medico.objects.get(id=medico_id)
        except Medico.DoesNotExist:
            return Response({"error": "Médico no encontrado"}, status=status.HTTP_400_BAD_REQUEST)

        
        cita = Cita(paciente=paciente, medico=medico, fecha=fecha, hora=hora)

        try:
            cita.full_clean()  
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        cita.save()

        mensaje = f"Hola {paciente.first_name},\n\nTu cita con el Dr. {medico.user.first_name} {medico.user.last_name} ha sido confirmada para el {fecha} a las {hora}."
        send_mail('Confirmación de cita médica', mensaje, settings.DEFAULT_FROM_EMAIL, [paciente.email])

        return Response({"mensaje": "Cita agendada con éxito"}, status=status.HTTP_201_CREATED)