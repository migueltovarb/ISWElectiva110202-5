from django.contrib import admin
from .models import Paciente, Medico, Especialidad, HorarioDisponible, Cita

admin.site.register(Paciente)
admin.site.register(Medico)
admin.site.register(Especialidad)
admin.site.register(HorarioDisponible)
admin.site.register(Cita)