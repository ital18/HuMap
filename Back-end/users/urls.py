# users/urls.py
from django.urls import path
from .views import login_api  # Importa de dentro da própria pasta (.)

urlpatterns = [
    # Como já definimos 'api/' no arquivo principal, aqui só colocamos o resto
    path('login/', login_api, name='login'),
]