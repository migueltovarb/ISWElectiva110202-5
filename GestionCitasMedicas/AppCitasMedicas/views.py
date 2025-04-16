from django.shortcuts import render

from django.shortcuts import render, redirect
from .forms import RegistroPacienteForm
from django.contrib.auth.models import User
from .models import Paciente

def registrar_paciente(request):
    if request.method == 'POST':
        form = RegistroPacienteForm(request.POST)
        if form.is_valid():
            user = User.objects.create_user(
                username=form.cleaned_data['username'],
                password=form.cleaned_data['password'],
                first_name=form.cleaned_data['first_name'],
                last_name=form.cleaned_data['last_name'],
                email=form.cleaned_data['email']
            )
            paciente = form.save(commit=False)
            paciente.user = user
            paciente.save()
            return redirect('login')  # Cambiar por tu vista de login
    else:
        form = RegistroPacienteForm()
    return render(request, 'registro_paciente.html', {'form': form})
