# Back-end/users/views.py

from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from rest_framework import generics # Do cadastro
from .serializers import CadastroSerializer # Do cadastro
from .models import User # Do cadastro
import json

# --- VIEW DE CADASTRO (DRF) ---
class CadastroView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = CadastroSerializer
    permission_classes = [] 

# --- VIEW DE LOGIN (Sua função) ---
@csrf_exempt
def login_api(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # O front manda 'email' ou 'username', mas no python tratamos como usuario
            usuario = data.get('email') # Mudei para .get('email') para ficar mais claro no Front
            if not usuario:
                usuario = data.get('username') # Tenta username se email falhar
                
            senha = data.get('password')

            # O Django verifica no banco
            user = authenticate(request, username=usuario, password=senha)

            if user is not None:
                return JsonResponse({
                    "message": "Sucesso", 
                    "user": user.first_name, # Retorna o nome da pessoa
                    "id": user.id # Útil para salvar nas denúncias depois
                }, status=200)
            else:
                return JsonResponse({"message": "Email ou senha incorretos"}, status=401)

        except Exception as e:
            return JsonResponse({"message": f"Erro interno: {str(e)}"}, status=500)
    
    return JsonResponse({"message": "Método não permitido"}, status=405)