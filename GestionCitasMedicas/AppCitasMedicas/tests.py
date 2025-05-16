from django.test import TestCase

from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from AppCitasMedicas.models import Paciente

import json

class RegistroPacienteTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.url = reverse('registro_paciente')  

    def test_registro_paciente_valido(self):
        data = {
            "nombre_completo": "Juan Pérez",
            "email": "juan@example.com",
            "telefono": "123456789",
            "password": "Clave1234"
        }
        response = self.client.post(self.url, data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertIn("Usuario registrado correctamente", response.json()["mensaje"])
        self.assertTrue(User.objects.filter(email="juan@example.com").exists())
        self.assertTrue(Paciente.objects.filter(user__email="juan@example.com").exists())

    def test_registro_con_correo_existente(self):
        User.objects.create_user(username="juan@example.com", email="juan@example.com", password="Clave1234")
        data = {
            "nombre_completo": "Juan Pérez",
            "email": "juan@example.com",
            "telefono": "123456789",
            "password": "Clave1234"
        }
        response = self.client.post(self.url, data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()["error"], "El correo ya está registrado")

    def test_registro_con_datos_incompletos(self):
        data = {
            "nombre_completo": "",
            "email": "",
            "telefono": "",
            "password": ""
        }
        response = self.client.post(self.url, data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()["error"], "Todos los campos son obligatorios")


from rest_framework.test import APIClient
from rest_framework import status

class ListaPacientesTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('lista-pacientes')

        
        user = User.objects.create_user(username="luis@example.com", email="luis@example.com", password="Clave1234")
        Paciente.objects.create(user=user, telefono="123456789")

    def test_lista_pacientes(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) > 0)


from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from AppCitasMedicas.models import Paciente
import json

class PacienteTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.registro_url = reverse('registro_paciente')
        self.login_url = reverse('login-paciente')
        self.user_data = {
            'nombre_completo': 'Juan Pérez',
            'email': 'juan@example.com',
            'telefono': '1234567890',
            'password': 'Password123'
        }

    def test_registro_paciente_exitoso(self):
        response = self.client.post(self.registro_url, data=json.dumps(self.user_data), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('mensaje', response.json())
        self.assertTrue(User.objects.filter(email='juan@example.com').exists())
        self.assertTrue(Paciente.objects.filter(user__email='juan@example.com').exists())

    def test_registro_paciente_campos_faltantes(self):
        data = self.user_data.copy()
        data['email'] = ''
        response = self.client.post(self.registro_url, data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())

    def test_login_paciente_antes_de_activar(self):
        self.client.post(self.registro_url, data=json.dumps(self.user_data), content_type='application/json')
        response = self.client.post(self.login_url, data={'email': 'juan@example.com', 'password': 'Password123'})
        self.assertEqual(response.status_code, 403)
        self.assertIn('Cuenta no activada', response.json()['error'])

    def test_login_paciente_exitoso_despues_de_activar(self):
        self.client.post(self.registro_url, data=json.dumps(self.user_data), content_type='application/json')
        user = User.objects.get(email='juan@example.com')
        user.is_active = True
        user.save()

        response = self.client.post(self.login_url, data={'email': 'juan@example.com', 'password': 'Password123'})
        self.assertEqual(response.status_code, 200)
        self.assertIn('token', response.json())

