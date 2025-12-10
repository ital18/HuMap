# Back-end/users/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # Campos extras que seu formulário pede
    cpf = models.CharField(max_length=14, unique=True, null=True, blank=True)
    data_nascimento = models.DateField(null=True, blank=True)
    telefone = models.CharField(max_length=20, null=True, blank=True)
    receber_notificacoes = models.BooleanField(default=False)

    # Vamos usar o email como login principal em vez do 'username'
    email = models.EmailField(unique=True)
    
    # Configurações para logar com email
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name'] # username ainda é obrigatório no banco, mas geraremos auto

    def __str__(self):
        return self.email