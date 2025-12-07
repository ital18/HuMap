from django.contrib import admin
from .models import User
from django.contrib.auth.admin import UserAdmin

# Isto diz ao Django para mostrar o seu utilizador no painel /admin
admin.site.register(User, UserAdmin)