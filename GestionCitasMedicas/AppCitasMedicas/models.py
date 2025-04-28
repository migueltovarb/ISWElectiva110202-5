
from django.db import models
from django.contrib.auth.models import User

from django.db import models
from django.contrib.auth.models import User

class Paciente(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    telefono = models.CharField(max_length=15)
    direccion = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}"

    @property
    def nombre_completo(self):
        return f"{self.user.first_name} {self.user.last_name}"


class Medico(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    especialidad = models.ForeignKey('Especialidad', on_delete=models.CASCADE)
    cedula_profesional = models.CharField(max_length=20, unique=True)
    telefono = models.CharField(max_length=15)

    def __str__(self):
        return f"Dr. {self.user.first_name} {self.user.last_name} - {self.especialidad.nombre}"

    @property
    def nombre_completo(self):
        return f"{self.user.first_name} {self.user.last_name}"

class HorarioDisponible(models.Model):
    medico = models.ForeignKey(Medico, on_delete=models.CASCADE)
    dia_semana = models.CharField(max_length=10) 
    hora_inicio = models.TimeField()
    hora_fin = models.TimeField()

class Especialidad(models.Model):
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre

class Cita(models.Model):
    paciente = models.ForeignKey(User, on_delete=models.CASCADE)
    medico = models.ForeignKey(Medico, on_delete=models.CASCADE)
    fecha = models.DateField()
    hora = models.TimeField()

    def __str__(self):
        return f"Cita con {self.medico} el {self.fecha} a las {self.hora}"

    def clean(self):
        citas_existentes = Cita.objects.filter(medico=self.medico, fecha=self.fecha, hora=self.hora)
        if citas_existentes.exists():
            raise ValidationError("Este horario ya está ocupado por otro paciente.")
