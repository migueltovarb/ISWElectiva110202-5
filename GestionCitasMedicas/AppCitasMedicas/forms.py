# AppCitasMedicas/forms.py
from django import forms
from django.contrib.auth.models import User
from .models import Paciente

class RegistroPacienteForm(forms.ModelForm):
    username = forms.CharField()
    password = forms.CharField(widget=forms.PasswordInput)
    first_name = forms.CharField()
    last_name = forms.CharField()
    email = forms.EmailField()

    class Meta:
        model = Paciente
        fields = ['cedula', 'telefono', 'direccion']
