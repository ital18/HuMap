from django.shortcuts import render

# Create your views here.

from django.http import JsonResponse
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def login_api(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            # O front-end mandou 'username' (que é o email) e 'password'
            usuario = data.get('username')
            senha = data.get('password')

            # O Django verifica no banco de dados se bate
            user = authenticate(username=usuario, password=senha)

            if user is not None:
                return JsonResponse({"message": "Sucesso", "user": user.username}, status=200)
            else:
                return JsonResponse({"message": "Credenciais inválidas"}, status=401)

        except Exception as e:
            return JsonResponse({"message": "Erro interno"}, status=500)
    
    return JsonResponse({"message": "Método não permitido"}, status=405)