# Back-end/users/urls.py
from django.urls import path
from .views import CadastroView, login_api

urlpatterns = [
    path('cadastro/', CadastroView.as_view(), name='cadastro'),
    path('login/', login_api, name='login'), 
]