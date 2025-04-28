
from django.db import models
from django.contrib.auth.models import User

class Paciente(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    cedula = models.CharField(max_length=20, unique=True)
    telefono = models.CharField(max_length=15)
    direccion = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}"

class Medico(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    especialidad = models.CharField(max_length=100)
    cedula_profesional = models.CharField(max_length=20, unique=True)
    telefono = models.CharField(max_length=15)

    def __str__(self):
        return f'{self.user.first_name} - {self.especialidad}'

    @property
    def nombre_completo(self):
        return f'{self.user.first_name} {self.user.last_name}'

class HorarioDisponible(models.Model):
    medico = models.ForeignKey(Medico, on_delete=models.CASCADE)
    dia_semana = models.CharField(max_length=10) 
    hora_inicio = models.TimeField()
    hora_fin = models.TimeField()
