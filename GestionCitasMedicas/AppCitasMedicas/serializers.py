from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Paciente
from .models import Medico
from django.contrib.auth.models import User
from rest_framework.validators import UniqueValidator

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email']

class PacienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paciente
        fields = ['id', 'telefono']

class MedicoSerializer(serializers.ModelSerializer):
    user = UsuarioSerializer()

    class Meta:
        model = Medico
        fields = ['id', 'user', 'especialidad', 'cedula_profesional', 'telefono', 'horario_disponible']

class RegistroPacienteSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(write_only=True, min_length=8)
    telefono = serializers.CharField(max_length=15)

    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password', 'telefono']

    def create(self, validated_data):
        telefono = validated_data.pop('telefono')
        user = User.objects.create_user(**validated_data)
        Paciente.objects.create(user=user, telefono=telefono)
        return user

class RegistroMedicoSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(write_only=True, min_length=8)
    telefono = serializers.CharField(max_length=15)
    especialidad = serializers.CharField(max_length=100)
    cedula_profesional = serializers.CharField(max_length=20)

    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password', 'telefono', 'especialidad', 'cedula_profesional']

    def create(self, validated_data):
        telefono = validated_data.pop('telefono')
        especialidad = validated_data.pop('especialidad')
        cedula_profesional = validated_data.pop('cedula_profesional')

        user = User.objects.create_user(**validated_data)
        Medico.objects.create(
            user=user,
            telefono=telefono,
            especialidad=especialidad,
            cedula_profesional=cedula_profesional
        )
        return user       